"""Read source packs, assign persistent IDs and guard local writes."""

import json
import os
import re
import tempfile
import unicodedata
from contextlib import contextmanager
from dataclasses import dataclass
from hashlib import sha256
from pathlib import Path
from uuid import uuid4

import fcntl


FIELDS = (
    "category", "subcategory", "question", "answer", "options",
    "explanation_correct", "explanation_incorrect", "language",
)
CHECK_FIELDS = {
    "structure": FIELDS,
    "duplicate": ("question", "answer", "language"),
    "factuality": ("category", "subcategory", "question", "answer", "language"),
    "ambiguity": ("question", "answer", "options", "language"),
    "distractors": ("question", "answer", "options", "language"),
    "explanation": FIELDS,
    "language": FIELDS,
    "category_relevance": ("category", "subcategory", "question", "answer", "language"),
    "quality": FIELDS,
    "generator": FIELDS,
}


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False)


def digest(value):
    return "sha256:" + sha256(compact(value).encode("utf-8")).hexdigest()


def render(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def text(value):
    return value if isinstance(value, str) else ""


def normalized(value):
    return " ".join(unicodedata.normalize("NFKC", text(value)).casefold().split())


def question_key(value):
    value = unicodedata.normalize("NFKC", text(value)).casefold()
    return " ".join("".join(
        " " if unicodedata.category(char).startswith("P") else char for char in value
    ).split())


def new_id():
    return "q_" + uuid4().hex


def effective(question, pack):
    return {
        "category": text(question.get("category")) or text(pack.get("name")),
        "subcategory": text(question.get("subcategory")),
        "question": text(question.get("question")),
        "answer": text(question.get("answer")),
        "options": question.get("options") if isinstance(question.get("options"), list) else [],
        "explanation_correct": text(question.get("explanation_correct")),
        "explanation_incorrect": text(question.get("explanation_incorrect")),
        "language": text(question.get("language")) or text(pack.get("language")) or "pl",
    }


def fields_hash(content, fields=FIELDS):
    return digest([content[field] for field in fields])


@dataclass
class Pack:
    path: Path
    relative: str
    raw: bytes
    data: dict

    @property
    def id(self):
        return text(self.data.get("id")) or self.path.stem


def read_packs(root):
    directory = root / "databases"
    if not directory.is_dir():
        raise ValueError(f"Missing {directory}")
    packs, errors = [], []
    for path in sorted(directory.rglob("*.json")):
        if path == directory / "list.json":
            continue
        relative = path.relative_to(root).as_posix()
        try:
            if not path.resolve().is_relative_to(directory.resolve()):
                raise ValueError("pack path leaves the databases directory")
            raw = path.read_bytes()
            data = json.loads(raw)
            if not isinstance(data, dict) or not isinstance(data.get("questions"), list):
                raise ValueError("expected a pack object with a questions array")
            packs.append(Pack(path, relative, raw, data))
        except (ValueError, OSError) as error:
            errors.append({"file": relative, "type": "invalid_pack", "details": str(error)})
    return packs, errors


@contextmanager
def writer(root):
    state = root / ".trivia"
    state.mkdir(exist_ok=True)
    with (state / "write.lock").open("a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        yield


def atomic_write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    mode = path.stat().st_mode & 0o777 if path.exists() else 0o644
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as stream:
        temp = Path(stream.name)
        try:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
            temp.chmod(mode)
            temp.replace(path)
        finally:
            temp.unlink(missing_ok=True)


def replace_files(changes):
    """Check every expected snapshot before writing. Roll back on an ordinary failure."""
    for path, before, _ in changes:
        if (path.read_bytes() if path.exists() else None) != before:
            raise ValueError(f"File changed since validation: {path}")
    written = []
    try:
        for path, before, after in changes:
            if (path.read_bytes() if path.exists() else None) != before:
                raise ValueError(f"File changed while applying changes: {path}")
            atomic_write(path, after)
            written.append((path, before, after))
    except BaseException:
        for path, before, after in reversed(written):
            if path.read_bytes() == after:
                if before is None:
                    path.unlink()
                else:
                    atomic_write(path, before)
        raise


def with_ids(pack, ids):
    """Insert fields into the original bytes so unrelated formatting stays intact."""
    if not ids:
        return pack.raw
    source = pack.raw.decode("utf-8")
    decoder = json.JSONDecoder()
    whitespace = re.compile(r"\s*")

    def skip(offset):
        return whitespace.match(source, offset).end()

    offset = skip(skip(0) + 1)
    while True:
        key, end = decoder.raw_decode(source, offset)
        offset = skip(skip(end) + 1)
        if key == "questions":
            break
        _, end = decoder.raw_decode(source, offset)
        offset = skip(skip(end) + 1)

    inserts = []
    offset = skip(offset + 1)
    for position, question in enumerate(pack.data["questions"]):
        _, end = decoder.raw_decode(source, offset)
        if position in ids:
            start = offset + 1
            first = skip(start)
            spacing = source[start:first]
            separator = ": " if spacing else ":"
            prefix = spacing + '"id"' + separator + json.dumps(ids[position])
            if question:
                prefix += ","
            inserts.append((start, prefix))
        offset = skip(skip(end) + 1) if position + 1 < len(pack.data["questions"]) else end

    for offset, insertion in reversed(inserts):
        source = source[:offset] + insertion + source[offset:]
    expected = json.loads(pack.raw)
    for position, ident in ids.items():
        expected["questions"][position]["id"] = ident
    if json.loads(source) != expected:
        raise ValueError(f"Unexpected JSON change: {pack.relative}")
    return source.encode("utf-8")


def migrate(root, apply=False):
    packs, errors = read_packs(root)
    if errors:
        raise ValueError(f"Cannot migrate unreadable packs: {errors[:5]}")
    seen, changes, summary = set(), [], []
    for pack in packs:
        missing = {}
        for position, question in enumerate(pack.data["questions"]):
            if not isinstance(question, dict):
                raise ValueError(f"{pack.relative}:{position + 1}: invalid question")
            ident = question.get("id")
            if "id" not in question:
                ident = new_id()
                missing[position] = ident
            if not isinstance(ident, str) or not ident.strip() or ident in seen:
                raise ValueError(f"{pack.relative}:{position + 1}: invalid or duplicate ID {ident!r}")
            seen.add(ident)
        if missing:
            summary.append({"file": pack.relative, "ids_to_add": len(missing)})
            if apply:
                changes.append((pack.path, pack.raw, with_ids(pack, missing)))
    if apply:
        replace_files(changes)
    return {"applied": apply, "packs": len(summary), "ids": sum(x["ids_to_add"] for x in summary),
            "files": summary}

"""Blueprint workspaces, staged candidates and deliberate local publication."""

from collections import Counter
from importlib.util import module_from_spec, spec_from_file_location
from hashlib import sha256
import json
from pathlib import Path
import re
import tempfile

from . import audit
from .quality import validate_question
from .source import effective, fields_hash, new_id, normalized, question_key, read_packs, render, replace_files


PACK_ID = re.compile(r"[a-z0-9]+(?:_[a-z0-9]+)*_(pl|en)")
REVIEW_TYPES = {"ambiguity", "distractors", "category_relevance", "factuality"}
PREPARER = Path(__file__).resolve().parents[2] / ".agents/skills/trivia-question-packs/scripts/prepare_packs.py"


def preparer():
    spec = spec_from_file_location("trivia_pack_preparer", PREPARER)
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_id(ident):
    if not isinstance(ident, str) or not PACK_ID.fullmatch(ident):
        raise ValueError("Expected pack ID in snake_case ending in _pl or _en")
    return ident


def stage_path(root, ident):
    return root / ".trivia" / "staging" / (validate_id(ident) + ".json")


def reserved_aliases(root):
    manifest = root / "databases" / "list.json"
    if not manifest.exists():
        return set()
    return {alias for entry in load(manifest) for alias in entry.get("aliases", [])}


def create(root, db, args):
    base = re.sub(r"[^a-z0-9]+", "_", normalized(args.name).translate(str.maketrans(
        "ąćęłńóśźż", "acelnoszz"))).strip("_")
    if not args.id and not base:
        raise ValueError("Supply --id for a name without Latin letters")
    names = {row[0] for row in db.execute("SELECT id FROM packs")}
    names.update(reserved_aliases(root))
    names.update(path.stem for path in (root / ".trivia" / "staging").glob("*.json"))
    names.update(path.name for path in (root / ".trivia" / "drafts").glob("*") if path.is_dir())
    ident = args.id or f"{base}_{args.language}"
    if not args.id and ident in names:
        number = 2
        while f"{base}_{number}_{args.language}" in names:
            number += 1
        ident = f"{base}_{number}_{args.language}"
    validate_id(ident)
    if ident in names or not ident.endswith("_" + args.language):
        raise ValueError("Pack ID already exists or has a different language")
    path = root / ".trivia" / "drafts" / ident
    candidate = {"id": ident, "name": args.name, "language": args.language,
                 "description": args.description, "questions": []}
    blueprint = {"pack_id": ident, "language": args.language, "count": args.count, "topics": []}
    changes = [(path / "candidate.json", None, render(candidate).encode("utf-8")),
               (path / "blueprints.json", None, render(blueprint).encode("utf-8"))]
    if not args.dry_run:
        replace_files(changes)
    return {"pack_id": ident, "count": args.count, "files": [str(item[0]) for item in changes],
            "dry_run": args.dry_run}


def draft_status(root, ident):
    folder = root / ".trivia" / "drafts" / validate_id(ident)
    blueprint = load(folder / "blueprints.json")
    candidate = load(folder / "candidate.json")
    rows = candidate["questions"]
    complete = []
    missing = []
    for position in range(blueprint["count"]):
        question = rows[position] if position < len(rows) else None
        topic = blueprint["topics"][position] if position < len(blueprint["topics"]) else None
        if isinstance(question, dict) and topic and (
            question.get("subcategory") == topic.get("subcategory")
            and normalized(question.get("answer")) == normalized(topic.get("target_answer"))
        ):
            complete.append(position + 1)
        else:
            missing.append({"position": position + 1, "blueprint": topic,
                            "candidate_present": question is not None})
    return {"pack_id": ident, "expected": blueprint["count"], "complete": len(complete),
            "missing": missing}


def validate_blueprints(db, file, count):
    spec = load(file)
    ident = validate_id(spec["pack_id"])
    lang = spec["language"]
    if lang != ident.rsplit("_", 1)[1]:
        raise ValueError("Blueprint language must match pack ID")
    topics = preparer().validate_blueprints(file, ident, lang, count or spec.get("count", 100))
    warnings = []
    for i, topic in enumerate(topics, 1):
        if "target_fact" in topic and not isinstance(topic["target_fact"], str):
            raise ValueError(f"Blueprint {i}: target_fact must be text")
        matches = db.execute("SELECT count(*) FROM questions WHERE language=? AND answer_key=?",
                             (lang, normalized(topic["target_answer"]))).fetchone()[0]
        if matches:
            warnings.append({"position": i, "answer": topic["target_answer"], "existing": matches})
    return {"pack_id": ident, "topics": len(topics), "answer_collisions": warnings}


def validate_candidate(root, db, source, count, blueprints=None, update=False):
    pack = load(source)
    if not isinstance(pack, dict):
        raise ValueError("Pack must be an object")
    ident = validate_id(pack.get("id"))
    if ident in reserved_aliases(root):
        raise ValueError("Pack ID is reserved as an alias for a consolidated pack")
    for field in ("name", "language", "description"):
        if not isinstance(pack.get(field), str) or not pack[field].strip():
            raise ValueError(f"Required pack field: {field}")
    if not ident.endswith("_" + pack["language"]):
        raise ValueError("Pack ID must end in its language")
    if len(pack["description"]) > 100 or pack["description"].startswith(
        ("Pytania z zakresu:", "Questions covering:")
    ):
        raise ValueError("Use a specific description of at most 100 characters")
    questions = pack.get("questions")
    if not isinstance(questions, list) or len(questions) != count:
        raise ValueError(f"Expected {count} questions")
    paths = list(db.execute("SELECT path FROM packs WHERE id=?", (ident,)))
    if bool(paths) != update or len(paths) > 1:
        raise ValueError("Use update for an existing, unambiguous pack and import for a new pack")
    original = paths[0]["path"] if paths else None
    topics = None
    if blueprints:
        validate_blueprints(db, blueprints, count)
        topics = preparer().validate_blueprints(blueprints, ident, pack["language"], count)
    ids, answers, stems = set(), set(), set()
    warnings = []
    published = {row["id"]: row["path"] for row in db.execute("SELECT id,path FROM questions WHERE stable")}
    expected_ids = {qid for qid, owner in published.items() if owner == original}
    for position, q in enumerate(questions, 1):
        if not isinstance(q, dict):
            raise ValueError(f"Question {position} is not an object")
        content = validate_question(q, pack)
        if content["language"] != pack["language"]:
            raise ValueError(f"Question {position}: language differs from pack")
        qid = q.get("id")
        if "id" in q and (not isinstance(qid, str) or not qid.strip() or qid in ids or (
            qid in published and published[qid] != original
        )):
            raise ValueError(f"Question {position}: invalid or conflicting ID {qid!r}")
        if not qid:
            if update:
                raise ValueError(f"Question {position}: updating a migrated pack requires IDs")
            qid = new_id()
            q["id"] = qid
        ids.add(qid)
        answer, stem = normalized(q["answer"]), question_key(q["question"])
        if answer in answers or stem in stems:
            raise ValueError(f"Question {position}: repeated answer or question within pack")
        if topics:
            topic = topics[position - 1]
            if q["subcategory"] != topic["subcategory"] or answer != normalized(topic["target_answer"]):
                raise ValueError(f"Question {position} differs from its blueprint")
        same = db.execute("SELECT id,path FROM questions WHERE language=? AND question_key=?",
                          (content["language"], stem)).fetchall()
        if any(row["id"] != qid for row in same):
            raise ValueError(f"Question {position} duplicates an existing question")
        if len(question_key(q["answer"])) >= 3 and f" {question_key(q['answer'])} " in f" {stem} ":
            warnings.append({"position": position, "id": qid, "type": "answer_in_question"})
        similar = db.execute(
            "SELECT id,question_key FROM questions WHERE language=? AND answer_key=? LIMIT 160",
            (content["language"], answer),
        ).fetchall()
        tokens = set(stem.split())
        for row in similar:
            other = set(row["question_key"].split())
            if row["id"] != qid and len(tokens & other) / max(len(tokens | other), 1) >= 0.70:
                warnings.append({"position": position, "id": qid, "type": "similar_question",
                                 "compared_to": row["id"]})
        answers.add(answer)
        stems.add(stem)
    if update and not expected_ids <= ids:
        raise ValueError("Pack update omits existing IDs; use explicit question removal outside import")
    pack["question_count"] = count
    return pack, original, warnings


def load_reviews(file, pack):
    expected = {q["id"]: fields_hash(effective(q, pack)) for q in pack["questions"]}
    completed = set()
    for entry in audit.read_jsonl(file):
        qid = entry.get("question_id")
        if qid not in expected or entry.get("content_hash") != expected[qid]:
            raise ValueError(f"Review revision conflict for {qid!r}")
        kind = entry.get("type")
        if (kind not in REVIEW_TYPES or entry.get("status") != "passed"
                or entry.get("method") not in {"llm_review", "human_review", "source_review"}):
            raise ValueError(f"Unsuccessful or malformed prepublication review for {qid!r}")
        completed.add((qid, kind))
    missing = [(qid, kind) for qid in expected for kind in sorted(REVIEW_TYPES)
               if (qid, kind) not in completed]
    if missing:
        raise ValueError(f"{len(missing)} required reviews missing; examples: {missing[:3]}")


def stage(root, db, args):
    pack, original, warnings = validate_candidate(
        root, db, args.source, args.count, args.blueprints, update=args.command == "update"
    )
    if args.reviews:
        if any(not q.get("id") for q in load(args.source)["questions"]):
            raise ValueError("Stage candidate first to assign IDs, then submit reviews for those IDs")
        load_reviews(args.reviews, pack)
    report = {"pack_id": pack["id"], "questions": len(pack["questions"]),
              "warnings": warnings, "source": original, "reviews_ready": bool(args.reviews)}
    if args.command == "validate":
        return report
    path = stage_path(root, pack["id"])
    before = path.read_bytes() if path.exists() else None
    envelope = {"pack": pack, "replaces": original, "original_sha256": None}
    if original:
        original_payload = (root / original).read_bytes()
        envelope["original_sha256"] = sha256(original_payload).hexdigest()
        envelope["pack"] = {**json.loads(original_payload), **pack}
    report.update({"staged": str(path), "dry_run": args.dry_run})
    if not args.dry_run:
        replace_files([(path, before, render(envelope).encode("utf-8"))])
    return report


def staged_questions(root, ident):
    pack = load(stage_path(root, ident))["pack"]
    return [{"id": q["id"], "position": position, "content_hash": fields_hash(effective(q, pack)),
             **effective(q, pack)} for position, q in enumerate(pack["questions"], 1)]


def publish(root, db, args):
    path = stage_path(root, args.pack_id)
    envelope = load(path)
    pack = envelope["pack"]
    if pack.get("id") != args.pack_id:
        raise ValueError("Staged pack ID differs from the target")
    original = envelope["replaces"]
    load_reviews(args.reviews, pack)
    # Reuse the existing publication validator for new packs. It checks the live manifest and cache.
    if not original:
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / path.name
            source.write_text(render(pack), encoding="utf-8")
            validate_candidate(root, db, source, len(pack["questions"]))
            plan = preparer().prepare(root, [source], len(pack["questions"]), write=not args.dry_run)
            return {"pack_id": args.pack_id, **plan}

    target = (root / original).resolve()
    if not target.is_relative_to((root / "databases").resolve()):
        raise ValueError("Invalid pack target")
    before = target.read_bytes()
    if sha256(before).hexdigest() != envelope["original_sha256"]:
        raise ValueError("Published pack changed since staging")
    with tempfile.TemporaryDirectory() as folder:
        source = Path(folder) / path.name
        source.write_text(render(pack), encoding="utf-8")
        _, indexed_path, _ = validate_candidate(root, db, source, len(pack["questions"]), update=True)
    if indexed_path != original:
        raise ValueError("Staged update does not match the indexed pack path")
    manifest = root / "databases/list.json"
    manifest_before = manifest.read_bytes()
    entries = json.loads(manifest_before)
    matching = [item for item in entries if item.get("path") == original]
    if len(matching) != 1:
        raise ValueError("Pack must have exactly one manifest entry")
    pack["updated_at"] = audit.now()
    matching[0].update({key: pack[key] for key in ("name", "description", "language",
                                                 "question_count", "updated_at")})
    service_worker = root / "sw.js"
    cache_before = service_worker.read_bytes()
    cache, changed = re.subn(rb"(const CACHE_NAME = 'trivia-board-game-v)(\d+)(')",
                            lambda m: m[1] + str(int(m[2]) + 1).encode() + m[3], cache_before)
    if changed != 1:
        raise ValueError("Service worker cache version is not recognized")
    if not args.dry_run:
        replace_files([(target, before, render(pack).encode("utf-8")),
                       (manifest, manifest_before, render(entries).encode("utf-8")),
                       (service_worker, cache_before, cache)])
    return {"pack_id": args.pack_id, "written": not args.dry_run,
            "paths": [original, "databases/list.json", "sw.js"]}


def topics(db, theme):
    candidates = db.execute("SELECT path,id,name FROM packs ORDER BY path")
    matches = [row for row in candidates if normalized(theme) in normalized(row["name"])]
    counts, answers = Counter(), Counter()
    for pack in matches:
        for subcategory, answer in db.execute("SELECT subcategory,answer_key FROM questions WHERE path=?",
                                              (pack["path"],)):
            counts[subcategory] += 1
            answers[answer] += 1
    return {"packs": [dict(row) for row in matches], "topics": counts.most_common(),
            "answers": answers.most_common()}

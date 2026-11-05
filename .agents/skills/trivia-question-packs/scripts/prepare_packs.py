#!/usr/bin/env python3
"""Validate new Trivia packs; optionally add them, index entries and a cache bump."""

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import re
import sys
import unicodedata


def normalized(value):
    value = unicodedata.normalize("NFKC", value).casefold()
    return " ".join(value.split())


def question_key(value):
    return normalized(value).rstrip("?!.… ")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def render(data):
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def validate_blueprints(path, pack_id, language, count):
    data = load(path)
    require(isinstance(data, dict), f"{path}: blueprint file must be an object")
    require(data.get("pack_id") == pack_id, f"{path}: blueprint pack_id mismatch")
    require(data.get("language") == language, f"{path}: blueprint language mismatch")
    topics = data.get("topics")
    require(isinstance(topics, list) and len(topics) == count,
            f"{path}: expected exactly {count} blueprints")
    seen_targets = set()
    for number, topic in enumerate(topics, 1):
        label = f"{pack_id}, blueprint {number}"
        require(isinstance(topic, dict), f"{label}: must be an object")
        for field in ("subcategory", "target_answer"):
            require(nonempty(topic.get(field)), f"{label}: missing {field}")
        target = normalized(topic["target_answer"])
        require(target not in seen_targets, f"{label}: duplicate target_answer")
        seen_targets.add(target)
    return topics


def prepare(repo, inputs, count, write=False, blueprints_dir=None):
    require(count > 0, "count must be positive")
    repo = repo.resolve()
    category_dir = repo / "databases/categories"
    index_path = repo / "databases/list.json"
    sw_path = repo / "sw.js"
    require(category_dir.is_dir(), "Missing databases/categories directory")
    index_before = index_path.read_bytes()
    sw_before = sw_path.read_bytes()
    index = json.loads(index_before)
    require(isinstance(index, list), "Index must be a JSON array")
    require(all(isinstance(e, dict) and nonempty(e.get("path")) for e in index),
            "Index has malformed entries")
    ids = {e.get("id") for e in index}
    paths = {e["path"] for e in index}
    names = {(e.get("language", "pl"), normalized(e.get("name", ""))) for e in index}
    seen_questions = {}
    # Include legacy databases at the root, not only indexed category files.
    existing_paths = sorted((repo / "databases").rglob("*.json"))
    for path in existing_paths:
        if path == index_path:
            continue
        data = load(path)
        if not isinstance(data, dict):
            continue
        ids.add(data.get("id", path.stem))
        lang = data.get("language", "pl")
        names.add((lang, normalized(data.get("name", path.stem))))
        for q in data.get("questions", []):
            if isinstance(q, dict) and nonempty(q.get("question")):
                seen_questions[(lang, question_key(q["question"]))] = str(path.relative_to(repo))

    sw_text = sw_before.decode("utf-8")
    cache_pattern = r"(const CACHE_NAME = 'trivia-board-game-v)(\d+)(';?)"
    matches = list(re.finditer(cache_pattern, sw_text))
    require(len(matches) == 1, "Unrecognized CACHE_NAME; review current service worker")
    cache_match = matches[0]
    new_cache = int(cache_match.group(2)) + 1
    sw_after = (sw_text[:cache_match.start(2)] + str(new_cache)
                + sw_text[cache_match.end(2):]).encode("utf-8")
    now = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    new_files = []
    entries = []

    for source in inputs:
        pack = load(source)
        require(isinstance(pack, dict), f"{source}: pack must be an object")
        for key in ("id", "name", "language", "description"):
            require(nonempty(pack.get(key)), f"{source}: missing {key}")
        pack_id = pack["id"]
        lang = pack["language"]
        require(lang in ("pl", "en"), f"{pack_id}: language must be pl or en")
        require(re.fullmatch(r"[a-z0-9]+(?:_[a-z0-9]+)*_" + lang, pack_id),
                f"{pack_id}: invalid ID or language suffix")
        require(pack_id not in ids, f"{pack_id}: ID already exists; use next pack number")
        name_key = (lang, normalized(pack["name"]))
        require(name_key not in names, f"{pack_id}: display name already exists")
        require(len(pack["description"]) <= 100, f"{pack_id}: description exceeds 100 chars")
        require(not pack["description"].startswith(("Pytania z zakresu:", "Questions covering:")),
                f"{pack_id}: use a specific description, not the scanner's generated prefix")
        relative = f"databases/categories/{pack_id}.json"
        target = repo / relative
        require(not target.exists() and relative not in paths, f"{relative}: path already exists")
        require(target.resolve().parent == category_dir.resolve(), "Invalid target path")
        questions = pack.get("questions")
        require(isinstance(questions, list) and len(questions) == count,
                f"{pack_id}: expected exactly {count} questions")
        topics = None
        if blueprints_dir is not None:
            topics = validate_blueprints(blueprints_dir / f"{pack_id}.json", pack_id, lang, count)
        for number, question in enumerate(questions, 1):
            label = f"{pack_id}, question {number}"
            require(isinstance(question, dict), f"{label}: must be an object")
            for field in ("subcategory", "question", "answer", "explanation_correct", "explanation_incorrect"):
                require(nonempty(question.get(field)), f"{label}: missing {field}")
            if topics is not None:
                topic = topics[number - 1]
                require(question["subcategory"] == topic["subcategory"],
                        f"{label}: subcategory differs from blueprint {number}")
                require(question["answer"] == topic["target_answer"],
                        f"{label}: answer differs from blueprint {number}")
            options = question.get("options")
            require(isinstance(options, list) and len(options) == 4 and all(map(nonempty, options)),
                    f"{label}: expected four nonempty options")
            require(len({normalized(o) for o in options}) == 4, f"{label}: duplicate options")
            require(options.count(question["answer"]) == 1,
                    f"{label}: answer must exactly match one option")
            key = (lang, question_key(question["question"]))
            require(key not in seen_questions,
                    f"{label}: duplicate question from {seen_questions.get(key)}")
            seen_questions[key] = label
        pack["question_count"] = count
        pack["created_at"] = now
        pack["updated_at"] = now
        entries.append({key: pack[key] for key in (
            "id", "name", "language", "description", "created_at", "updated_at", "question_count")}
            | {"path": relative})
        new_files.append((target, render(pack).encode("utf-8")))
        ids.add(pack_id)
        names.add(name_key)
        paths.add(relative)

    require(bool(new_files), "No packs provided")
    plan = {
        "written": write,
        "packs": [{"id": e["id"], "name": e["name"], "question_count": count} for e in entries],
        "paths": [e["path"] for e in entries] + ["databases/list.json", "sw.js"],
        "cache_version": new_cache,
    }
    if write:
        # Validate all inputs before any writes, and refuse stale index/cache snapshots.
        require(index_path.read_bytes() == index_before and sw_path.read_bytes() == sw_before,
                "Index/cache changed during validation; rerun on the current state")
        created = []
        try:
            for target, payload in new_files:
                with target.open("xb") as handle:
                    created.append(target)
                    handle.write(payload)
            index_path.write_text(render(index + entries), encoding="utf-8")
            sw_path.write_bytes(sw_after)
        except BaseException:
            for target in created:
                target.unlink(missing_ok=True)
            index_path.write_bytes(index_before)
            sw_path.write_bytes(sw_before)
            raise
    return plan


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, type=Path)
    parser.add_argument("--count", type=int, default=100, help="Questions per input pack (default: 100)")
    parser.add_argument("--blueprints-dir", type=Path,
                        help="Check each pack against <pack_id>.json blueprints in this directory")
    parser.add_argument("--write", action="store_true", help="Apply local changes after validation")
    parser.add_argument("packs", type=Path, nargs="+")
    args = parser.parse_args()
    try:
        print(render(prepare(args.repo, args.packs, args.count, args.write, args.blueprints_dir)), end="")
    except (ValueError, OSError, TypeError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

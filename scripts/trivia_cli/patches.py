"""Validate field-level patches and apply them to source JSON."""

from collections import defaultdict

from . import audit
from .quality import validate_question
from .source import FIELDS, effective, fields_hash, normalized, question_key, read_packs, render, replace_files


def prospected_groups(packs, edits):
    groups = defaultdict(set)
    for pack in packs:
        for position, question in enumerate(pack.data["questions"]):
            if not isinstance(question, dict):
                continue
            ident = question.get("id") or f"{pack.relative}:{position}"
            q = effective(edits.get(ident, question), pack.data)
            key = q["language"], question_key(q["question"])
            if key[1]:
                groups[key].add(ident)
    return groups


def apply(root, source, write=False):
    packs, errors = read_packs(root)
    if errors:
        raise ValueError(f"Unreadable packs: {errors[:5]}")
    ids = {}
    for pack in packs:
        for position, question in enumerate(pack.data["questions"]):
            if isinstance(question, dict) and question.get("id"):
                ident = question["id"]
                if ident in ids:
                    raise ValueError(f"Duplicate question ID: {ident}")
                ids[ident] = pack, position, question

    edits, report, affected = {}, [], {}
    for patch in audit.read_jsonl(source):
        ident = patch.get("question_id")
        if ident not in ids or ident in edits:
            raise ValueError(f"Unknown or repeated ID in patch: {ident!r}")
        pack, position, question = ids[ident]
        previous = effective(question, pack.data)
        expected = fields_hash(previous)
        if patch.get("expected_hash") != expected:
            raise ValueError(f"Revision conflict for {ident}: current {expected}")
        changes = patch.get("changes")
        if not isinstance(changes, dict) or not changes or changes.keys() - set(FIELDS):
            raise ValueError(f"{ident}: changes must contain editable question fields")
        reason = patch.get("reason")
        if not isinstance(reason, str) or not reason.strip():
            raise ValueError(f"{ident}: reason is required")
        if any(field != "options" and not isinstance(value, str) for field, value in changes.items()):
            raise ValueError(f"{ident}: edited text fields must be strings")
        updated = {**question, **changes}
        current = validate_question(updated, pack.data)
        new_hash = fields_hash(current)
        if updated == question:
            continue
        edits[ident] = updated
        affected.setdefault(pack.relative, (pack, {}))[1][position] = updated
        report.append({"question_id": ident, "file": pack.relative, "position": position + 1,
                       "expected_hash": expected, "content_hash": new_hash, "reason": reason,
                       "fields": {key: {"before": previous[key], "after": current[key]}
                                  for key in changes if previous[key] != current[key]}})

    before = prospected_groups(packs, {})
    after = prospected_groups(packs, edits)
    for key, members in after.items():
        if len(members) > 1 and members - before.get(key, set()) and members & edits.keys():
            raise ValueError(f"Patch creates a duplicate question: {', '.join(sorted(members))}")

    warnings = []
    if edits:
        peers = defaultdict(list)
        for ident, (pack, _, question) in ids.items():
            data = effective(edits.get(ident, question), pack.data)
            if data["answer"]:
                peers[(data["language"], normalized(data["answer"]))].append(
                    (ident, set(question_key(data["question"]).split()))
                )
        for ident, updated in edits.items():
            pack, _, original = ids[ident]
            before_data = effective(original, pack.data)
            current = effective(updated, pack.data)
            old_tokens = set(question_key(before_data["question"]).split())
            new_tokens = set(question_key(current["question"]).split())
            key = current["language"], normalized(current["answer"])
            old_key = before_data["language"], normalized(before_data["answer"])
            if old_tokens == new_tokens and old_key == key:
                continue
            matches = []
            for other, tokens in peers[key]:
                if other == ident or not tokens:
                    continue
                score = len(new_tokens & tokens) / max(len(new_tokens | tokens), 1)
                old_score = len(old_tokens & tokens) / max(len(old_tokens | tokens), 1)
                if score >= 0.75 and (old_key != key or old_score < 0.75):
                    matches.append((score, other))
            if matches:
                warnings.append({"question_id": ident, "type": "possible_duplicate",
                                 "candidates": sorted(matches, reverse=True)[:5]})

    changes_to_write = []
    for pack, changed in affected.values():
        data = {**pack.data, "questions": list(pack.data["questions"])}
        for position, question in changed.items():
            data["questions"][position] = question
        changes_to_write.append((pack.path, pack.raw, render(data).encode("utf-8")))
    if write and report:
        history = audit.registry(root, "patches")
        records = [{"schema": 1, "date": audit.now(), **entry} for entry in report]
        changes_to_write.extend(audit.registry_change(root, "patches", [*history, *records]))
        replace_files(changes_to_write)
    return {"applied": write, "patches": len(report), "files": sorted(affected), "changes": report, "warnings": warnings}

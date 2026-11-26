"""Structural diagnostics and bounded quality heuristics."""

from collections import Counter, defaultdict
import json
import re

from scripts.audit_questions import collect, question_issues

from .source import effective, fields_hash, normalized, question_key


TIME_FLAGS = re.compile(
    r"\b(obecnie|najnowsz\w*|największ\w*|pierwsz\w*|jedyn\w*|zawsze|"
    r"currently|latest|newest|largest|first|only|always)\b", re.I
)
WARNING_TYPES = {"unexpected_question_fields", "duplicate_question_in_pack",
                 "pack_missing_from_index", "index_metadata_mismatch"}


def inventory(root, db, selected_pack=None):
    rows = list(db.execute("SELECT q.*,p.id AS pack_id,p.language AS pack_language "
                           "FROM questions q JOIN packs p ON q.path=p.path"))
    by_location = {(row["path"], row["position"]): row for row in rows}
    chosen = {row["path"] for row in rows
              if not selected_pack or selected_pack in (row["path"], row["pack_id"])}
    if selected_pack and not chosen:
        raise ValueError(f"Unknown pack: {selected_pack}")
    findings = []

    def issue(kind, detail, path, row=None, severity="warning"):
        findings.append({
            "type": kind, "severity": severity, "status": "open", "method": "rule",
            "rules_version": 1, "file": path, "details": detail,
            **({"question_id": row["id"], "position": row["position"],
                "content_hash": row["content_hash"]} if row is not None else {}),
        })

    base = collect(root)
    for kind, records in base["issues"].items():
        for record in records:
            path, detail = record["file"], record["detail"]
            if selected_pack and path not in chosen:
                continue
            match = re.match(r"pytanie (\d+)\b", detail)
            row = by_location.get((path, int(match[1]))) if match else None
            issue(kind, detail, path, row, "warning" if kind in WARNING_TYPES else "error")

    subtotals = defaultdict(Counter)
    options_seen = defaultdict(list)
    id_rows = {row["id"]: row for row in rows}
    for row in rows:
        if row["path"] not in chosen:
            continue
        path = row["path"]
        check = lambda kind, detail: issue(kind, detail, path, row)
        if not row["stable"]:
            check("missing_question_id", "Question needs a stable ID")
        if row["language"] != row["pack_language"] or row["language"] not in ("pl", "en"):
            check("language_mismatch", f"Question={row['language']}, pack={row['pack_language']}")
        answer = question_key(row["answer"])
        stem = question_key(row["question"])
        if len(answer) >= 3 and f" {answer} " in f" {stem} ":
            check("answer_in_question", row["answer"])
        flags = sorted({match.casefold() for match in TIME_FLAGS.findall(row["question"])})
        if flags:
            check("time_or_absolute_claim", ", ".join(flags))
        if re.search(r"\b(stan na|as of|at present|at the moment)\b", row["question"], re.I):
            check("possible_outdated_question", "Time-dependent wording")
        opts = json.loads(row["options"])
        if len(opts) == 4 and all(isinstance(o, str) for o in opts):
            distractors = tuple(sorted(normalized(o) for o in opts if o != row["answer"]))
            if len(distractors) == 3:
                options_seen[distractors].append(row["id"])
            lengths = [len(o) for o in opts if o != row["answer"]]
            length = len(row["answer"])
            if len(lengths) == 3 and (
                length >= 3 * max(lengths, default=0) + 10 or min(lengths) >= 3 * length + 10
            ):
                check("answer_length_outlier", f"Answer length {length}, distractors {lengths}")
            numeric = [bool(re.fullmatch(r"[+-]?\d+(?:[.,]\d+)?", o.strip())) for o in opts]
            if sum(numeric) in (1, 3) and row["answer"] in opts:
                if numeric[opts.index(row["answer"])] == (sum(numeric) == 1):
                    check("answer_format_outlier", "Only one option differs in numeric format")
        subtotals[path][row["subcategory"]] += 1

    for ids in options_seen.values():
        if len(ids) > 1:
            for ident in ids:
                row = id_rows[ident]
                issue("reused_distractors", f"Shared across {len(ids)} questions", row["path"], row)
    for path, counts in subtotals.items():
        subcategory, count = counts.most_common(1)[0]
        total = sum(counts.values())
        if total >= 20 and count / total >= 0.75:
            issue("subcategory_concentration", f"{subcategory}: {count}/{total}", path)
    return findings


def validate_question(question, pack):
    issues = [(kind, detail) for kind, detail in question_issues(question)
              if kind not in WARNING_TYPES]
    if "language" in question and question["language"] not in ("pl", "en"):
        issues.append(("language", "question language must be pl or en"))
    if issues:
        raise ValueError("; ".join(detail for _, detail in issues))
    return effective(question, pack)

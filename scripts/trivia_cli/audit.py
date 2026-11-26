"""Revision-bound review tasks, persistent registers and progress summaries."""

from collections import Counter, defaultdict
from datetime import datetime, timezone
import json
import random

from .index import row_dict
from .quality import inventory
from .source import CHECK_FIELDS, compact, digest, fields_hash, replace_files


STATUSES = {"passed", "issues_found", "uncertain"}
METHODS = {"rule", "llm_review", "human_review", "source_review"}
RULES_VERSION = 1
PROJECTIONS = {
    **CHECK_FIELDS,
    "duplicate": ("question", "answer", "category", "language"),
    "ambiguity": ("question", "options", "language"),
    "distractors": ("question", "options", "language"),
}


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def directory(root):
    return root / "audit-state"


def path_for(root, name):
    if name == "rule-findings":
        return root / ".trivia" / "rule-findings.jsonl"
    return directory(root) / f"{name}.jsonl"


def read_jsonl(path):
    with path.open(encoding="utf-8") as stream:
        for line_no, line in enumerate(stream, 1):
            if not line.strip():
                continue
            try:
                value = json.loads(line)
                if not isinstance(value, dict):
                    raise ValueError("expected an object")
            except ValueError as error:
                raise ValueError(f"{path}:{line_no}: {error}") from error
            yield value


def registry(root, name):
    path = path_for(root, name)
    return list(read_jsonl(path)) if path.exists() else []


def registry_change(root, name, rows):
    path = path_for(root, name)
    old = path.read_bytes() if path.exists() else None
    new = "".join(compact(row) + "\n" for row in rows).encode("utf-8")
    if new == (old or b""):
        return []
    return [(path, old, new)]


def is_inventory_finding(row):
    return row.get("method") == "rule" and not row.get("task_id")


def recorded_findings(root, db):
    durable = registry(root, "findings")
    local = path_for(root, "rule-findings")
    recorded = [row for row in durable if is_inventory_finding(row)]
    if local.exists():
        recorded = registry(root, "rule-findings")
    elif not recorded:
        recorded = inventory(root, db)
    return [row for row in durable if not is_inventory_finding(row)] + recorded


def task_projection(question, kind, blind, seed):
    projection = {field: question[field] for field in PROJECTIONS[kind]}
    if blind:
        projection.pop("answer", None)
        projection["options"] = list(question["options"])
        random.Random(digest([seed, question["id"]])).shuffle(projection["options"])
    return projection


def compact_task(task):
    return {**task, "questions": [
        {key: value for key, value in entry.items() if key != "data"}
        for entry in task["questions"]
    ]}


def check_hash(q, kind, peers=None):
    if kind == "duplicate" and peers is not None:
        return digest([fields_hash(q, CHECK_FIELDS[kind]), peers.get(q["id"], [])])
    return fields_hash(q, CHECK_FIELDS[kind])


def duplicate_context(db):
    groups = defaultdict(list)
    for row in db.execute("SELECT id,question_key,answer_key,language,content_hash FROM questions"):
        if row["question_key"]:
            groups[("question", row["language"], row["question_key"])].append(row)
        if row["answer_key"]:
            groups[("answer", row["language"], row["answer_key"])].append(row)
    peers = defaultdict(set)
    for group in groups.values():
        if len(group) < 2:
            continue
        members = {(row["id"], row["question_key"], row["answer_key"]) for row in group}
        for row in group:
            peers[row["id"]].update(item for item in members if item[0] != row["id"])
    return {ident: sorted(items) for ident, items in peers.items()}


def latest_reviews(root, db):
    questions = {row["id"]: row_dict(row)
                 for row in db.execute("SELECT * FROM questions WHERE stable=1")}
    peers = duplicate_context(db)
    latest, stale = {}, set()
    for review in registry(root, "reviews"):
        ident, kind = review["question_id"], review["type"]
        key = ident, kind
        q = questions.get(ident)
        if q and kind in CHECK_FIELDS and review["check_hash"] == check_hash(q, kind, peers):
            if review["method"] != "rule" or review.get("rules_version") == RULES_VERSION:
                latest[key] = review
                continue
        stale.add(key)
    for ident, q in questions.items():
        review = q.get("verification")
        if not isinstance(review, dict) or review.get("type") != "generator":
            continue
        key = ident, "generator"
        if (review.get("schema") == 1 and review.get("status") in STATUSES
                and review.get("method") == "llm_review"
                and review.get("check_hash") == q["content_hash"]):
            latest[key] = {**review, "source_verified": False}
        else:
            stale.add(key)
    stale = {key for key in stale if key[0] in questions}
    return questions, latest, stale - latest.keys(), peers


def work(root, db, kind, count, seed=None, blind=False, requested=None, follow_up=False):
    questions, reviewed, _, peers = latest_reviews(root, db)
    tasks = registry(root, "tasks")
    if requested:
        previous = next((task for task in tasks if task["task_id"] == requested), None)
        if previous is None:
            raise ValueError(f"Unknown task: {requested}")
        completed = {(review["task_id"], review["question_id"], review["content_hash"])
                     for review in registry(root, "reviews")}
        remaining = [entry for entry in previous["questions"]
                     if (requested, entry["question_id"], entry["expected_hash"]) not in completed]
        kind = previous["type"]
        stale, entries = [], []
        for entry in remaining:
            ident = entry["question_id"]
            q = questions.get(ident)
            if not q or q["content_hash"] != entry["expected_hash"] or (
                check_hash(q, kind, peers) != entry["check_hash"]
            ):
                stale.append(ident)
                entries.append({key: value for key, value in entry.items() if key != "data"})
                continue
            entries.append({**entry, "data": task_projection(
                q, kind, previous["blind"], previous["seed"]
            )})
        return {**previous, "questions": entries[:count], "remaining": len(remaining),
                "stale": stale}
    completed = {(review["task_id"], review["question_id"]) for review in registry(root, "reviews")}
    open_tasks = {(task["type"], entry["question_id"], entry["expected_hash"], entry["check_hash"])
                  for task in tasks if not task.get("released_at") for entry in task["questions"]
                  if (task["task_id"], entry["question_id"]) not in completed}
    risks = risk_scores(root, db, kind)
    candidates = []
    for q in questions.values():
        ident = q["id"]
        previous = reviewed.get((ident, kind))
        if follow_up:
            if not previous or previous["status"] == "passed":
                continue
        elif previous:
            continue
        if seed is None and (kind, ident, q["content_hash"], check_hash(q, kind, peers)) in open_tasks:
            continue
        candidates.append(q)
    if seed is None:
        candidates.sort(key=lambda q: (-risks[q["id"]], q["path"], q["position"]))
    else:
        candidates = stratified(candidates, risks, seed, count)
    entries = []
    for q in candidates[:count]:
        projection = task_projection(q, kind, blind, seed)
        entries.append({"question_id": q["id"], "expected_hash": q["content_hash"],
                        "check_hash": check_hash(q, kind, peers), "data": projection})
    task = {"schema": 1, "type": kind, "seed": seed, "blind": blind, "questions": entries}
    if seed is None:
        task["allocation"] = len(tasks)
    return {"task_id": "task_" + digest(task)[7:27], **task}


def risk_scores(root, db, kind):
    risks = Counter()
    current = dict(db.execute("SELECT id,content_hash FROM questions"))
    weight = 8 if kind == "duplicate" else 2
    for ident, count in db.execute(
        "SELECT id, count(*) OVER (PARTITION BY language,question_key) "
        "FROM questions WHERE question_key!=''"
    ):
        if count > 1:
            risks[ident] += weight
    for finding in recorded_findings(root, db):
        ident = finding.get("question_id")
        if not ident or finding.get("status") != "open":
            continue
        if current.get(ident) == finding.get("content_hash"):
            risks[ident] += 3 if finding.get("severity") in {"error", "high"} else 1
            if kind == "factuality" and finding["type"] in {
                "time_or_absolute_claim", "possible_outdated_question"
            }:
                risks[ident] += 5
    return risks


def stratified(candidates, risks, seed, count):
    rng = random.Random(seed)
    strata = defaultdict(list)
    for q in sorted(candidates, key=lambda row: row["id"]):
        strata[(q["language"], q["path"], bool(risks[q["id"]]))].append(q)
    keys = sorted(strata)
    rng.shuffle(keys)
    for key in keys:
        rng.shuffle(strata[key])
    result = []
    while keys and len(result) < count:
        next_keys = []
        for key in keys:
            result.append(strata[key].pop())
            if strata[key]:
                next_keys.append(key)
            if len(result) == count:
                break
        keys = next_keys
    return result


def save_task(root, task, extra_changes=()):
    changes = list(extra_changes)
    tasks = registry(root, "tasks")
    if task["questions"] and not any(item["task_id"] == task["task_id"] for item in tasks):
        changes.extend(registry_change(root, "tasks", [*tasks, compact_task(task)]))
    replace_files(changes)
    return task


def release(root, task_id, dry_run=False):
    tasks = registry(root, "tasks")
    task = next((row for row in tasks if row["task_id"] == task_id), None)
    if task is None:
        raise ValueError(f"Unknown task: {task_id}")
    if not dry_run and not task.get("released_at"):
        task["released_at"] = now()
        replace_files(registry_change(root, "tasks", tasks))
    return {"task_id": task_id, "released": bool(task.get("released_at")), "dry_run": dry_run}


def submit(root, db, source, write=True):
    tasks = {task["task_id"]: task for task in registry(root, "tasks")}
    reviews = registry(root, "reviews")
    findings = registry(root, "findings")
    imported = {review["result_id"] for review in reviews}
    existing = {(review["task_id"], review["question_id"]): review["result_id"] for review in reviews}
    lookup = {ident: {e["question_id"]: e for e in task["questions"]}
              for ident, task in tasks.items()}
    questions = {row["id"]: row_dict(row) for row in db.execute("SELECT * FROM questions WHERE stable")}
    peers = duplicate_context(db)
    added, skipped, conflicts = 0, 0, []
    for result in read_jsonl(source):
        task_id, ident = result.get("task_id"), result.get("question_id")
        if task_id not in tasks or ident not in lookup[task_id]:
            raise ValueError(f"Question {ident!r} is not in task {task_id!r}")
        entry, kind = lookup[task_id][ident], tasks[task_id]["type"]
        status, method = result.get("status"), result.get("method")
        if status not in STATUSES or method not in METHODS:
            raise ValueError(f"{ident}: unsupported status or method")
        source_urls = result.get("sources", [])
        if not isinstance(source_urls, list) or not all(
            isinstance(url, str) and url.startswith(("https://", "http://")) for url in source_urls
        ):
            raise ValueError(f"{ident}: sources must be a list of HTTP(S) URLs")
        verified = result.get("source_verified", False)
        if not isinstance(verified, bool) or (verified and not source_urls):
            raise ValueError(f"{ident}: source_verified needs supporting URLs")
        model = result.get("model")
        if method == "llm_review" and (not isinstance(model, str) or not model.strip()):
            raise ValueError(f"{ident}: model is required")
        expected = result.get("content_hash")
        if expected != entry["expected_hash"]:
            raise ValueError(f"{ident}: result hash does not match its task")
        proposed = result.get("findings", [])
        if not isinstance(proposed, list) or (status == "issues_found") != bool(proposed):
            raise ValueError(f"{ident}: findings must be supplied exactly for issues_found")
        for finding in proposed:
            if not isinstance(finding, dict) or not all(
                isinstance(finding.get(key), str) and finding[key].strip()
                for key in ("type", "details")
            ) or finding.get("severity") not in {"warning", "error", "low", "medium", "high"}:
                raise ValueError(f"{ident}: invalid finding")
        record = {
            "schema": 1, "task_id": task_id, "question_id": ident, "type": kind,
            "content_hash": expected, "check_hash": entry["check_hash"],
            "status": status, "method": method, "model": model, "rules_version": RULES_VERSION,
            "source_verified": verified, "sources": source_urls, "details": result.get("details", ""),
        }
        key = digest([record, proposed])
        if key in imported:
            skipped += 1
            continue
        current = questions.get(ident)
        if tasks[task_id].get("released_at") or (task_id, ident) in existing or not current or current["content_hash"] != expected or (
            check_hash(current, kind, peers) != entry["check_hash"]
        ):
            conflicts.append({"task_id": task_id, "question_id": ident,
                              "current_hash": current["content_hash"] if current else None})
            continue
        reviews.append({**record, "result_id": key, "date": now()})
        for finding in proposed:
            findings.append({**finding, "schema": 1, "question_id": ident, "task_id": task_id,
                             "review_type": kind, "status": "open", "method": method,
                             "content_hash": expected, "check_hash": entry["check_hash"],
                             "result_id": key, "date": now()})
        imported.add(key)
        existing[(task_id, ident)] = key
        added += 1
    changes = registry_change(root, "reviews", reviews) + registry_change(root, "findings", findings)
    if write:
        replace_files(changes)
    return {"imported": added if write else 0, "would_import": added,
            "already_imported": skipped, "conflicts": conflicts}


def progress(root, db):
    questions, latest, stale, peers = latest_reviews(root, db)
    reviewed = defaultdict(Counter)
    for (_, kind), review in latest.items():
        reviewed[kind][review["status"]] += 1
    for _, kind in stale:
        reviewed[kind]["stale"] += 1
    for kind in CHECK_FIELDS:
        reviewed[kind]["not_reviewed"] = len(questions) - sum(reviewed[kind].values())
    all_reviews = registry(root, "reviews")
    completed = {(r["task_id"], r["question_id"], r["content_hash"]) for r in all_reviews}
    queued = set()
    for task in registry(root, "tasks"):
        if task.get("released_at"):
            continue
        for entry in task["questions"]:
            ident = entry["question_id"]
            q = questions.get(ident)
            if q and (task["task_id"], ident, entry["expected_hash"]) not in completed:
                if entry["expected_hash"] == q["content_hash"] and (
                    entry["check_hash"] == check_hash(q, task["type"], peers)
                ):
                    queued.add((task["type"], ident))
    current_findings = findings_view(root, db)
    return {
        "questions": len(questions),
        "packs": db.execute("SELECT count(*) FROM packs").fetchone()[0],
        "reviews": dict(reviewed), "history_records": len(all_reviews), "stale": len(stale),
        "source_verified_questions": len({i for (i, _), r in latest.items() if r["source_verified"]}),
        "unresolved_reviews": sum(r["status"] == "uncertain" for r in latest.values()),
        "findings_by_type": Counter(r["type"] for r in current_findings if r["status"] == "open"),
        "findings_by_severity": Counter(r["severity"] for r in current_findings if r["status"] == "open"),
        "pending": len(queued), "applied_patches": len(registry(root, "patches")),
        "staged_packs": sorted(p.stem for p in (root / ".trivia" / "staging").glob("*.json")),
    }


def findings_view(root, db):
    current = {row["id"]: row_dict(row) for row in db.execute("SELECT * FROM questions")}
    peers = duplicate_context(db)
    rows = recorded_findings(root, db)
    for finding in rows:
        ident = finding.get("question_id")
        if not ident or finding["status"] == "resolved":
            continue
        q = current.get(ident)
        if finding.get("review_type") in CHECK_FIELDS:
            valid = q and finding["check_hash"] == check_hash(q, finding["review_type"], peers)
        else:
            valid = q and finding["content_hash"] == q["content_hash"]
        if not valid:
            finding["status"] = "stale"
    return rows


def save_inventory(root, findings):
    path = path_for(root, "rule-findings")
    previous = (registry(root, "rule-findings") if path.exists() else
                [row for row in registry(root, "findings") if is_inventory_finding(row)])
    def key(row):
        return (row.get("question_id"), row["file"], row["type"], row.get("content_hash"),
                row["details"])

    live = {key(row): {"schema": 1, **row} for row in findings}
    rows = []
    for row in previous:
        if key(row) in live:
            current = live.pop(key(row))
            rows.append({**row, **current})
        elif row["status"] == "resolved":
            rows.append(row)
        else:
            rows.append({**row, "status": "resolved", "resolved_at": now()})
    rows.extend({**row, "date": now()} for row in live.values())
    replace_files(registry_change(root, "rule-findings", rows))

"""Terminal entry point. Source mutations are explicit and previewable."""

import argparse
from collections import Counter
from contextlib import closing, nullcontext
import json
from pathlib import Path
import sqlite3
import sys

from . import audit, index, packs, patches, quality
from .source import CHECK_FIELDS, compact, migrate, normalized, replace_files, render, writer


ROOT = Path(__file__).resolve().parents[2]


def positive(value):
    number = int(value)
    if number < 1:
        raise argparse.ArgumentTypeError("must be positive")
    return number


def nonnegative(value):
    number = int(value)
    if number < 0:
        raise argparse.ArgumentTypeError("must be non-negative")
    return number


def parser():
    cli = argparse.ArgumentParser(prog="trivia", description="Local Trivia question database tools")
    cli.add_argument("--root", type=Path, default=ROOT, help="Alternate Trivia checkout")
    cli.add_argument("--db", type=Path, help="Alternate local SQLite index")
    cli.add_argument("--json", action="store_true", help="Machine-readable output")
    commands = cli.add_subparsers(dest="group", required=True)

    def command(parent, name, help):
        sub = parent.add_parser(name, help=help)
        sub.add_argument("--json", action="store_true", default=argparse.SUPPRESS)
        return sub

    def nested(name, help):
        return command(commands, name, help).add_subparsers(dest="command", required=True)

    def page(sub, default=20):
        sub.add_argument("--limit", type=positive, default=default)
        sub.add_argument("--offset", type=nonnegative, default=0)

    def query(sub):
        sub.add_argument("query")
        sub.add_argument("--pack")
        sub.add_argument("--language", choices=("pl", "en"))
        sub.add_argument("--subcategory")
        page(sub)

    def dry_run(sub):
        sub.add_argument("--dry-run", action="store_true", help="Validate and show the changes")

    sub = command(commands, "index", "Update or rebuild the SQLite index")
    sub.add_argument("--rebuild", action="store_true")
    sub.add_argument("--details", action="store_true", help="Include all changed question IDs")
    sub = command(commands, "migrate-ids", "Preview or apply stable ID migration")
    sub.add_argument("--apply", action="store_true")
    sub.add_argument("--dry-run", action="store_true", help="Preview only (the default)")
    page(sub)
    command(commands, "stats", "Summarize packs and questions")

    sub = command(commands, "search", "Search indexed question text")
    query(sub)
    sub.add_argument("--field", choices=sorted(index.FIELDS))
    sub = command(commands, "answer", "Find normalized answers")
    query(sub)
    sub.add_argument("--partial", action="store_true")
    questions = nested("question", "Inspect questions")
    sub = command(questions, "show", "Show a question by ID")
    sub.add_argument("question_id")

    sub = command(commands, "lint", "Run deterministic quality checks")
    sub.add_argument("--pack")
    sub.add_argument("--record", action="store_true", help="Replace the recorded global lint snapshot")
    sub.add_argument("--type")
    page(sub)
    sub = command(commands, "duplicates", "Find duplicates, similarities or common answers")
    mode = sub.add_mutually_exclusive_group()
    mode.add_argument("--exact", action="store_const", const="exact", dest="mode")
    mode.add_argument("--fuzzy", action="store_const", const="fuzzy", dest="mode")
    mode.add_argument("--by-answer", action="store_const", const="answer", dest="mode")
    sub.set_defaults(mode="exact")
    sub.add_argument("--threshold", type=float, default=0.75)
    sub.add_argument("--members", type=positive, default=5)
    page(sub)
    sub = command(commands, "overlap", "Rank the overlap between packs")
    sub.add_argument("--min-count", type=positive, default=10)
    page(sub)

    finding_cmds = nested("findings", "Read the durable register of findings")
    sub = command(finding_cmds, "list", "List findings")
    sub.add_argument("--type")
    sub.add_argument("--severity")
    sub.add_argument("--status", choices=("open", "stale", "resolved"))
    page(sub)
    command(finding_cmds, "stats", "Count findings by severity and type")

    review_cmds = nested("audit", "Plan, resume and submit review tasks")
    for name in ("plan", "next", "sample"):
        sub = command(review_cmds, name, f"{name.capitalize()} an audit task")
        sub.add_argument("--type", choices=[kind for kind in CHECK_FIELDS if kind != "generator"],
                         default="factuality")
        sub.add_argument("--blind", action="store_true")
        sub.add_argument("--output", type=Path, help="Write machine-readable task to a new file")
        sub.add_argument("--dry-run", action="store_true", help="Print preview without saving")
        if name == "sample":
            sub.add_argument("--count", type=positive, default=500)
            sub.add_argument("--seed", type=int, default=42)
            sub.add_argument("--save", action="store_true")
        else:
            sub.add_argument("--limit", type=positive, default=25)
        if name == "next":
            sub.add_argument("--task")
            sub.add_argument("--follow-up", action="store_true",
                             help="Prioritize already reviewed issues and uncertain outcomes")
    sub = command(review_cmds, "submit", "Import explicit results from JSONL")
    sub.add_argument("source", type=Path)
    dry_run(sub)
    sub = command(review_cmds, "release", "Make unfinished questions available for another task")
    sub.add_argument("task")
    dry_run(sub)
    command(review_cmds, "progress", "Show coverage, unresolved results and pending work")
    sub = command(review_cmds, "report", "Summarize inventory, reviews and pack overlap")
    sub.add_argument("--markdown", action="store_true")

    patch_cmds = nested("patch", "Validate, preview and apply question patches")
    for name in ("validate", "apply"):
        sub = command(patch_cmds, name, f"{name.capitalize()} a JSONL patch")
        sub.add_argument("source", type=Path)
        dry_run(sub)

    pack_cmds = nested("packs", "Inspect, prepare, stage and publish local packs")
    sub = command(pack_cmds, "list", "List question packs")
    sub.add_argument("--language", choices=("pl", "en"))
    page(sub)
    sub = command(pack_cmds, "inspect", "Inspect a pack")
    sub.add_argument("pack_id")
    page(sub)
    sub = command(pack_cmds, "inspect-staged", "Show stable IDs and hashes of staged candidates")
    sub.add_argument("pack_id")
    page(sub)
    sub = command(pack_cmds, "related", "Find packs by title")
    sub.add_argument("theme")
    page(sub)
    sub = command(pack_cmds, "topics", "Summarize subcategories and answers")
    sub.add_argument("--theme", default="")
    page(sub)
    sub = command(pack_cmds, "create", "Create a draft candidate and blueprint workspace")
    sub.add_argument("--name", required=True)
    sub.add_argument("--id")
    sub.add_argument("--language", choices=("pl", "en"), required=True)
    sub.add_argument("--description", default="")
    sub.add_argument("--count", type=positive, default=100)
    dry_run(sub)
    sub = command(pack_cmds, "draft", "Show missing candidate slots to resume generation")
    sub.add_argument("pack_id")
    page(sub)
    sub = command(pack_cmds, "validate-blueprints", "Validate a blueprint and list answer collisions")
    sub.add_argument("source", type=Path)
    sub.add_argument("--count", type=positive)
    for name in ("validate", "import", "update"):
        sub = command(pack_cmds, name, f"{name.capitalize()} a candidate pack")
        sub.add_argument("source", type=Path)
        sub.add_argument("--count", type=positive, default=100)
        sub.add_argument("--blueprints", type=Path)
        sub.add_argument("--reviews", type=Path)
        dry_run(sub)
    sub = command(pack_cmds, "publish", "Publish an explicitly staged and reviewed pack locally")
    sub.add_argument("pack_id")
    sub.add_argument("--reviews", type=Path, required=True)
    dry_run(sub)
    return cli


def paged(items, args):
    return {"total": len(items), "items": items[args.offset:args.offset + args.limit]}


def review_result(root, db, args):
    command = args.command
    if command == "progress":
        return audit.progress(root, db)
    if command == "report":
        return {"inventory": stats(db), "audit": audit.progress(root, db),
                "overlap": index.overlap(db, 10)[:10], "runs": audit.registry(root, "runs")}
    if command == "submit":
        return audit.submit(root, db, args.source, write=not args.dry_run)
    if command == "release":
        return audit.release(root, args.task, args.dry_run)
    count = getattr(args, "count", getattr(args, "limit", None))
    if count > 500:
        raise ValueError("Limit an audit task to 500 questions")
    kind = args.type
    if args.blind and kind not in ("ambiguity", "distractors"):
        raise ValueError("Blind review is available for ambiguity and distractor checks")
    requested = getattr(args, "task", None)
    task = audit.work(root, db, kind, count, getattr(args, "seed", None), args.blind, requested,
                      getattr(args, "follow_up", False))
    reserve = not args.dry_run and not requested and (
        command == "next" or (command == "sample" and args.save)
    )
    output = ([(args.output, None, render(task).encode("utf-8"))]
              if args.output and not args.dry_run else [])
    if reserve:
        audit.save_task(root, task, extra_changes=output)
    elif output:
        replace_files(output)
    if output:
        return {key: value for key, value in task.items() if key != "questions"} | {
            "output": str(args.output), "question_count": len(task["questions"])}
    return task


def pack_result(root, db, args):
    command = args.command
    if command == "create":
        return packs.create(root, db, args)
    if command == "draft":
        status = packs.draft_status(root, args.pack_id)
        return {**status, "missing": paged(status["missing"], args)}
    if command == "validate-blueprints":
        return packs.validate_blueprints(db, args.source, args.count)
    if command in ("validate", "import", "update"):
        return packs.stage(root, db, args)
    if command == "publish":
        result = packs.publish(root, db, args)
        if not args.dry_run:
            index.sync(db, root)
        return result
    if command in ("related", "topics"):
        results = packs.topics(db, args.theme)
        pack_page = paged(results["packs"], args)
        if command == "related":
            return pack_page
        return {"packs": pack_page, "topics": paged(results["topics"], args),
                "answers": paged(results["answers"], args)}
    if command == "inspect-staged":
        return paged(packs.staged_questions(root, args.pack_id), args)
    if command == "inspect":
        rows = db.execute("SELECT * FROM packs WHERE id=? OR path=?", (args.pack_id, args.pack_id))
        matches = [dict(row) for row in rows]
        if len(matches) != 1:
            raise ValueError("Pack not found or ambiguous; specify its path")
        name = matches[0]["path"]
        members = db.execute("SELECT * FROM questions WHERE path=? ORDER BY position LIMIT ? OFFSET ?",
                             (name, args.limit, args.offset))
        return {"pack": matches[0], "items": [index.row_dict(row) for row in members]}
    return paged([dict(row) for row in db.execute("SELECT * FROM packs ORDER BY path")
                  if not args.language or row["language"] == args.language], args)


def stats(db):
    return {
        "packs": db.execute("SELECT count(*) FROM packs").fetchone()[0],
        "questions": db.execute("SELECT count(*) FROM questions").fetchone()[0],
        "legacy_without_id": db.execute("SELECT count(*) FROM questions WHERE NOT stable").fetchone()[0],
        "languages": dict(db.execute("SELECT language,count(*) FROM questions GROUP BY language")),
        "exact_duplicate_groups": len(index.duplicate_groups(db, "exact")),
        "repeated_answer_groups": len(index.duplicate_groups(db, "answer")),
    }


def execute(root, db, args):
    group = args.group
    if group == "index":
        result = index.sync(db, root, args.rebuild)
        return result if args.details else {
            key: len(value) if isinstance(value, list) else value for key, value in result.items()
        }
    if group == "stats":
        return stats(db)
    if group in ("search", "answer"):
        return index.search(db, args, by_answer=group == "answer")
    if group == "question":
        row = db.execute("SELECT * FROM questions WHERE id=?", (args.question_id,)).fetchone()
        if not row:
            raise ValueError(f"Unknown question ID: {args.question_id}")
        return index.row_dict(row)
    if group == "packs":
        return pack_result(root, db, args)
    if group == "duplicates":
        if not 0 < args.threshold <= 1:
            raise ValueError("Threshold must be in (0, 1]")
        result = (list(index.fuzzy(db, args.threshold)) if args.mode == "fuzzy"
                  else index.duplicate_groups(db, args.mode))
        if args.mode != "fuzzy":
            for entry in result:
                entry["questions"] = entry["questions"][:args.members]
        return paged(result, args)
    if group == "overlap":
        return paged(index.overlap(db, args.min_count), args)
    if group == "lint":
        findings = quality.inventory(root, db, args.pack)
        if args.record:
            if args.pack:
                raise ValueError("Record a global snapshot without --pack")
            audit.save_inventory(root, findings)
        selected = [row for row in findings if not args.type or row["type"] == args.type]
        return {**paged(selected, args), "by_type": Counter(row["type"] for row in findings),
                "by_severity": Counter(row["severity"] for row in findings)}
    if group == "findings":
        rows = audit.findings_view(root, db)
        if args.command == "stats":
            return {"total": len(rows), "by_type": Counter(row["type"] for row in rows),
                    "by_status": Counter(row["status"] for row in rows),
                    "by_severity": Counter(row["severity"] for row in rows)}
        return paged([row for row in rows if all(
            not getattr(args, key) or getattr(args, key) == row[key]
            for key in ("type", "severity", "status"))], args)
    if group == "audit":
        return review_result(root, db, args)
    if group == "patch":
        result = patches.apply(root, args.source, write=args.command == "apply" and not args.dry_run)
        if result["applied"]:
            index.sync(db, root)
        return result
    raise ValueError(f"Unknown command: {group}")


def print_text(result):
    for key, value in result.items():
        if key in ("items", "questions") and isinstance(value, list):
            print(f"{key}: {len(value)} shown")
            for item in value[:50]:
                if isinstance(item, dict) and isinstance(item.get("question"), str):
                    print(f"  {item['id']} {item['path']}:{item['position']}  "
                          f"{item['question']}  →  {item['answer']}")
                else:
                    print("  " + compact(item))
            if len(value) > 50:
                print("  Use --json or --output for the full selection.")
        elif isinstance(value, str):
            print(f"{key}: {value}")
        else:
            print(f"{key}: {compact(value)}")


def markdown_report(result):
    lines = ["# Raport audytu Trivia", "", "## Inwentaryzacja", ""]
    inventory = result["inventory"]
    lines.extend([
        f"- Paczki — {inventory['packs']}",
        f"- Pytania — {inventory['questions']}",
        f"- Grupy dokładnych duplikatów — {inventory['exact_duplicate_groups']}",
        f"- Grupy powtarzających się odpowiedzi — {inventory['repeated_answer_groups']}",
    ])
    progress = result["audit"]
    lines.extend(["", "## Najbardziej pokrywające się paczki", ""])
    for row in result["overlap"]:
        a, b = (Path(path).stem for path in row["packs"])
        lines.append(f"- `{a}` i `{b}` — wspólne pytania {row['shared_questions']} "
                     f"(pokrycie {row['coverage'][0]:g}% i {row['coverage'][1]:g}%), "
                     f"wspólne odpowiedzi {row['shared_answers']}")
    lines.extend(["", "## Wyniki i kontynuacja", ""])
    for label, key in (("Zastosowane poprawki", "applied_patches"),
                       ("Kontrole nieaktualne", "stale"), ("Przypadki niepewne", "unresolved_reviews"),
                       ("Pytania potwierdzone źródłowo", "source_verified_questions"),
                       ("Oczekujące kontrole", "pending")):
        lines.append(f"- {label} — {progress[key]}")
    for kind, counts in progress["reviews"].items():
        submitted = {name: count for name, count in counts.items() if name != "not_reviewed"}
        if submitted:
            lines.append(f"- `{kind}` — " + ", ".join(f"{name} {count}" for name, count in submitted.items()))
    for severity, count in sorted(progress["findings_by_severity"].items()):
        lines.append(f"- Otwarte problemy `{severity}` — {count}")
    for kind, count in sorted(progress["findings_by_type"].items()):
        lines.append(f"- `{kind}` — {count}")
    if progress["staged_packs"]:
        lines.append("- Paczki w stagingu — " + ", ".join(progress["staged_packs"]))
    for run in result["runs"]:
        lines.append(f"- Przebieg `{run['run_id']}` — wyszukiwania {run['web_searches']}, "
                     f"uruchomienia subagentów {run['subagents']}")
        if run.get("tokens") is not None:
            lines.append(f"- Tokeny — {run['tokens']}")
    return "\n".join(lines) + "\n"


def main(argv=None):
    args = parser().parse_args(argv)
    root = args.root.resolve()
    group = args.group
    dry = getattr(args, "dry_run", False)
    command = getattr(args, "command", None)
    mutation = (group == "index" or
                group == "migrate-ids" and args.apply and not dry or
                group == "lint" and args.record or
                not dry and (group == "patch" and command == "apply" or
                             group == "audit" and command in {"next", "sample", "plan", "submit", "release"} or
                             group == "packs" and command in {"create", "import", "update", "publish"}))
    try:
        if hasattr(args, "limit") and args.limit > 500:
            raise ValueError("Maximum page size is 500")
        if group == "migrate-ids" and dry and args.apply:
            raise ValueError("Choose --dry-run or --apply")
        with writer(root) if group != "migrate-ids" or mutation else nullcontext():
            if group == "migrate-ids":
                result = migrate(root, args.apply)
                result["files"] = result["files"][args.offset:args.offset + args.limit]
            else:
                with closing(index.connect(root, args.db)) as db:
                    if group != "index" and (
                        mutation or group in {"audit", "findings", "lint", "patch", "packs"} or
                        not db.execute("SELECT 1 FROM packs LIMIT 1").fetchone()
                    ):
                        index.sync(db, root)
                    result = execute(root, db, args)
        if args.json:
            print(render(result), end="")
        elif group == "audit" and command == "report" and args.markdown:
            print(markdown_report(result), end="")
        else:
            print_text(result)
        return 1 if group == "audit" and command == "submit" and result["conflicts"] else 0
    except (ValueError, OSError, TypeError, KeyError, sqlite3.Error) as error:
        print(f"trivia: {error}", file=sys.stderr)
        return 1

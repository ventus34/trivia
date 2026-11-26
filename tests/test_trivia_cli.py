"""End-to-end tests of the local question database workflows."""

import json
from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory
import unittest

from scripts.trivia_cli.source import render


CLI = Path(__file__).resolve().parents[1] / "trivia"


def question(stem, answer="Mars", options=None):
    return {
        "subcategory": "Planety",
        "question": stem,
        "answer": answer,
        "options": options or [answer, "Wenus", "Saturn", "Merkury"],
        "explanation_correct": "Przykładowa odpowiedź.",
        "explanation_incorrect": "Pozostałe opcje nie pasują.",
    }


class TriviaTests(unittest.TestCase):
    def setUp(self):
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.file = self.make_pack("kosmos_pl", "Kosmos", [
            question("Która planeta ma czerwoną powierzchnię?"),
            question("Która planeta ma księżyce Fobos i Deimos?"),
        ])
        self.other = self.make_pack("drugi_pl", "Inny", [
            question(" KTÓRA  PLANETA MA CZERWONĄ POWIERZCHNIĘ?!"),
            question("Która planeta ma wyraźne pierścienie?", "Jowisz"),
        ])
        (self.root / "sw.js").write_text("const CACHE_NAME = 'trivia-board-game-v1';\n")

    def make_pack(self, ident, title, rows):
        path = self.root / "databases" / "categories" / (ident + ".json")
        path.parent.mkdir(parents=True, exist_ok=True)
        pack = {"id": ident, "name": title, "language": "pl", "description": "Opis",
                "question_count": len(rows), "questions": rows}
        path.write_text(render(pack), encoding="utf-8")
        manifest = path.parents[1] / "list.json"
        previous = json.loads(manifest.read_text()) if manifest.exists() else []
        previous.append({key: value for key, value in pack.items() if key != "questions"}
                        | {"path": path.relative_to(self.root).as_posix()})
        manifest.write_text(render(previous), encoding="utf-8")
        return path

    def cli(self, *args, failed=False):
        proc = subprocess.run(
            [str(CLI), "--root", str(self.root), "--json", *map(str, args)],
            capture_output=True, text=True,
        )
        if failed:
            self.assertNotEqual(proc.returncode, 0, proc.stdout)
            return proc.stderr or json.loads(proc.stdout)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        return json.loads(proc.stdout)

    def jsonl(self, name, results):
        path = self.root / name
        path.write_text("".join(json.dumps(result) + "\n" for result in results), encoding="utf-8")
        return path

    def migrate(self):
        return self.cli("migrate-ids", "--apply")

    def ids(self):
        return [question["id"] for question in json.loads(self.file.read_text())["questions"]]

    def review(self, task, entry, status="passed"):
        return {"task_id": task["task_id"], "question_id": entry["question_id"],
                "content_hash": entry["expected_hash"], "status": status, "method": "human_review"}

    def test_migration_preserves_bytes_other_than_ids_and_can_repeat(self):
        original = self.file.read_text()
        self.assertEqual(self.cli("migrate-ids")["ids"], 4)
        self.assertEqual(original, self.file.read_text())
        self.assertEqual(self.migrate()["ids"], 4)
        self.assertEqual(self.migrate()["ids"], 0)
        qids = self.ids()
        self.assertEqual(len(set(qids)), 2)
        updated = self.file.read_text()
        for ident in qids:
            updated = updated.replace(f'\n      "id": "{ident}",', "")
        self.assertEqual(updated, original)
        self.assertEqual(self.cli("stats")["legacy_without_id"], 0)

    def test_search_duplicates_and_delta_after_reordering(self):
        self.migrate()
        self.cli("index")
        self.assertEqual(self.cli("answer", "mars")["total"], 3)
        self.assertEqual(self.cli("search", "CZERWONĄ", "--language", "pl")["total"], 2)
        self.assertEqual(self.cli("search", "wenus", "--field", "options")["total"], 4)
        self.assertEqual(self.cli("duplicates", "--exact")["total"], 1)
        self.assertEqual(self.cli("duplicates", "--by-answer")["total"], 1)
        pack = json.loads(self.file.read_text())
        pack["questions"].reverse()
        self.file.write_text(render(pack))
        delta = self.cli("index")
        self.assertEqual(delta["relocated"], 2)
        self.assertEqual(delta["changed"], 0)
        pack["questions"][0]["question"] += " Wybierz."
        del pack["questions"][1]
        self.file.write_text(render(pack))
        delta = self.cli("index")
        self.assertEqual((delta["changed"], delta["deleted"]), (1, 1))
        self.assertEqual(self.cli("search", "Wybierz")["total"], 1)

    def test_partial_audit_idempotency_and_selective_invalidation(self):
        self.migrate()
        ident = self.ids()[0]
        for kind in ("distractors", "explanation"):
            task = self.cli("audit", "next", "--type", kind)
            entry = next(entry for entry in task["questions"] if entry["question_id"] == ident)
            file = self.jsonl(kind + ".jsonl", [self.review(task, entry)])
            self.assertEqual(self.cli("audit", "submit", file)["imported"], 1)
            self.assertEqual(self.cli("audit", "submit", file)["already_imported"], 1)
            resumed = self.cli("audit", "next", "--task", task["task_id"])
            self.assertEqual(resumed["remaining"], 3)
        before = self.cli("question", "show", ident)["content_hash"]
        patch = self.jsonl("patch.jsonl", [{"question_id": ident, "expected_hash": before,
                         "reason": "Uzupełnienie wyjaśnienia", "changes": {
                            "explanation_correct": "Poprawione wyjaśnienie.",
                         }}])
        self.assertEqual(self.cli("patch", "apply", patch, "--dry-run")["patches"], 1)
        self.assertEqual(self.cli("question", "show", ident)["content_hash"], before)
        self.assertTrue(self.cli("patch", "apply", patch)["applied"])
        self.assertIn("Revision conflict", self.cli("patch", "apply", patch, failed=True))
        (self.root / ".trivia/index.sqlite").unlink()
        self.cli("index", "--rebuild")
        progress = self.cli("audit", "progress")
        self.assertEqual(progress["reviews"]["distractors"]["passed"], 1)
        self.assertEqual(progress["reviews"]["explanation"]["stale"], 1)
        self.assertEqual(progress["history_records"], 2)

    def test_stale_tasks_reassignment_and_blind_projection(self):
        self.migrate()
        task = self.cli("audit", "next", "--type", "ambiguity", "--blind", "--limit", 1)
        entry = task["questions"][0]
        self.assertNotIn("answer", entry["data"])
        self.assertEqual(len(entry["data"]["options"]), 4)
        stored = json.loads((self.root / "audit-state/tasks.jsonl").read_text())
        self.assertNotIn("data", stored["questions"][0])
        resumed = self.cli("audit", "next", "--task", task["task_id"])
        self.assertEqual(resumed["questions"], task["questions"])
        self.cli("audit", "release", task["task_id"])
        replacement = self.cli("audit", "next", "--type", "ambiguity", "--blind", "--limit", 1)
        self.assertNotEqual(task["task_id"], replacement["task_id"])
        self.assertEqual(replacement["questions"][0]["question_id"], entry["question_id"])
        file = self.jsonl("expired.jsonl", [self.review(task, entry)])
        self.assertEqual(len(self.cli("audit", "submit", file, failed=True)["conflicts"]), 1)

    def test_deterministic_quality_warnings(self):
        pack = json.loads(self.file.read_text())
        pack["questions"][0] = question("Czy Mars jest planetą?", options=["Mars", "Mars", "Słońce"])
        self.file.write_text(render(pack))
        self.migrate()
        metrics = self.cli("lint", "--record")["by_type"]
        for kind in ("duplicate_options", "option_count", "answer_match", "answer_in_question"):
            self.assertEqual(metrics[kind], 1)
        saved = self.cli("findings", "stats")
        self.assertGreater(saved["total"], 0)
        self.assertFalse((self.root / "audit-state/findings.jsonl").exists())
        (self.root / ".trivia/rule-findings.jsonl").unlink()
        self.assertEqual(self.cli("findings", "stats"), saved)

    def test_staged_pack_needs_reviews_before_publication(self):
        self.migrate()
        candidate = self.root / "candidate.json"
        pack = {"id": "fizyka_pl", "name": "Próbna fizyka", "language": "pl",
                "description": "Test", "questions": [question("Jaka jest jednostka siły?", "Niuton")]}
        candidate.write_text(render(pack))
        staged = self.cli("packs", "import", candidate, "--count", 1)
        data = json.loads(Path(staged["staged"]).read_text())["pack"]
        self.assertFalse((self.root / "databases/categories/fizyka_pl.json").exists())
        from scripts.trivia_cli.source import effective, fields_hash
        q = data["questions"][0]
        reviews = self.jsonl("reviews.jsonl", [
            {"question_id": q["id"], "content_hash": fields_hash(effective(q, data)), "type": kind,
             "status": "passed", "method": "human_review"}
            for kind in ("ambiguity", "distractors", "category_relevance", "factuality")
        ])
        self.cli("packs", "publish", "fizyka_pl", "--reviews", reviews, "--dry-run")
        self.assertFalse((self.root / "databases/categories/fizyka_pl.json").exists())
        self.cli("packs", "publish", "fizyka_pl", "--reviews", reviews)
        self.assertIn("v2", (self.root / "sw.js").read_text())
        self.assertEqual(self.cli("question", "show", q["id"])["answer"], "Niuton")


if __name__ == "__main__":
    unittest.main()

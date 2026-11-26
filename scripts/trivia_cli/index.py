"""Rebuildable SQLite index and deterministic analysis."""

from collections import Counter, defaultdict
from itertools import combinations
import json
from pathlib import Path
import re
import sqlite3

from .source import compact, effective, fields_hash, normalized, question_key, read_packs, text


SCHEMA = """
CREATE TABLE IF NOT EXISTS packs (
    path TEXT PRIMARY KEY, id TEXT NOT NULL, name TEXT, language TEXT, count INTEGER
);
CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY, path TEXT NOT NULL, position INTEGER NOT NULL,
    stable INTEGER NOT NULL, content_hash TEXT NOT NULL,
    category TEXT, subcategory TEXT, language TEXT, question TEXT, answer TEXT,
    options TEXT, explanation_correct TEXT, explanation_incorrect TEXT,
    answer_key TEXT, question_key TEXT, legacy_verified_at TEXT, legacy_model TEXT,
    generator_review TEXT
);
CREATE INDEX IF NOT EXISTS questions_answer ON questions(answer_key);
CREATE INDEX IF NOT EXISTS questions_question ON questions(language,question_key);
CREATE INDEX IF NOT EXISTS questions_pack ON questions(path,position);
CREATE VIRTUAL TABLE IF NOT EXISTS questions_fts USING fts5(
    id UNINDEXED, question, answer, options, explanation, tokenize='unicode61 remove_diacritics 2'
);
"""
FIELDS = {"question", "answer", "options", "explanation"}


def connect(root, database=None):
    path = Path(database) if database else root / ".trivia" / "index.sqlite"
    path.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(path, timeout=30)
    db.row_factory = sqlite3.Row
    db.executescript(SCHEMA)
    if not any(row["name"] == "generator_review" for row in db.execute("PRAGMA table_info(questions)")):
        db.execute("ALTER TABLE questions ADD COLUMN generator_review TEXT")
    return db


def sync(db, root, rebuild=False):
    packs, errors = read_packs(root)
    if errors:
        raise ValueError(f"Unreadable packs; index left unchanged: {errors[:5]}")
    seen, pack_rows, rows = set(), [], {}
    for pack in packs:
        pack_rows.append((pack.relative, pack.id, text(pack.data.get("name")),
                          text(pack.data.get("language")) or "pl", len(pack.data["questions"])))
        for position, question in enumerate(pack.data["questions"], 1):
            if not isinstance(question, dict):
                question = {}
            ident = text(question.get("id"))
            stable = bool(ident)
            if not ident:
                ident = f"legacy:{pack.relative}:{position}"
            if ident in seen:
                raise ValueError(f"Duplicate question ID {ident!r} at {pack.relative}:{position}")
            seen.add(ident)
            q = effective(question, pack.data)
            rows[ident] = (ident, pack.relative, position, int(stable), fields_hash(q),
                           q["category"], q["subcategory"], q["language"], q["question"],
                           q["answer"], compact(q["options"]), q["explanation_correct"],
                           q["explanation_incorrect"], normalized(q["answer"]),
                           question_key(q["question"]), text(question.get("last_verified_at")),
                           text(question.get("verifying_model")), compact(question.get("verification")))
    with db:
        # Acquire the write lock before reading the previous snapshot.
        db.execute("BEGIN IMMEDIATE")
        indexed = list(db.execute("SELECT rowid,* FROM questions"))
        rowids = {r["id"]: r[0] for r in indexed}
        previous = {r["id"]: tuple(r)[1:] for r in indexed}
        added = rows.keys() - previous.keys()
        deleted = previous.keys() - rows.keys()
        changed = {k for k in rows.keys() & previous.keys() if rows[k][4] != previous[k][4]}
        relocated = {k for k in rows.keys() & previous.keys() if rows[k][1:3] != previous[k][1:3]}
        updated = {k for k, row in rows.items() if row != previous.get(k)}
        if rebuild:
            db.execute("DELETE FROM questions_fts")
            db.execute("DELETE FROM questions")
            updated = rows.keys()
        else:
            removed = ((rowids[k],) for k in (deleted | updated) & rowids.keys())
            db.executemany("DELETE FROM questions_fts WHERE rowid=?", removed)
            db.executemany("DELETE FROM questions WHERE id=?", ((k,) for k in deleted | updated))
        db.execute("DELETE FROM packs")
        db.executemany("INSERT INTO packs VALUES (?,?,?,?,?)", pack_rows)
        db.executemany("INSERT INTO questions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                       (rows[key] for key in sorted(updated)))
        db.executemany(
            "INSERT INTO questions_fts(rowid,id,question,answer,options,explanation) "
            "SELECT rowid,id,question,answer,options,explanation_correct || char(10) || "
            "explanation_incorrect FROM questions WHERE id=?",
            ((key,) for key in sorted(updated)),
        )
    return {
        "packs": len(packs), "questions": len(rows), "added": sorted(added),
        "changed": sorted(changed), "deleted": sorted(deleted), "relocated": sorted(relocated),
        "legacy_without_id": sum(not row[3] for row in rows.values()), "rebuilt": rebuild,
    }


def row_dict(row):
    result = dict(row)
    if "options" in result:
        result["options"] = json.loads(result["options"])
        stored = json.loads(result.pop("generator_review", None) or "null")
        if stored:
            result["verification"] = stored
        result.pop("answer_key", None)
        result.pop("question_key", None)
    return result


def filters(args):
    clauses, values = [], []
    for name, sql in (("language", "q.language=?"), ("subcategory", "q.subcategory=?"),
                      ("pack", "(p.id=? OR q.path=?)")):
        value = getattr(args, name, None)
        if value:
            clauses.append(sql)
            values.extend([value] * sql.count("?"))
    return clauses, values


def search(db, args, by_answer=False):
    clauses, values = filters(args)
    source = "questions q JOIN packs p ON p.path=q.path"
    order = "q.path,q.position"
    if by_answer:
        key = normalized(args.query)
        if not key:
            raise ValueError("Enter an answer")
        if args.partial:
            clauses.append("instr(q.answer_key,?)>0")
        else:
            clauses.append("q.answer_key=?")
        values.append(key)
    else:
        terms = re.findall(r"[^\W_]+", args.query, flags=re.UNICODE)
        if not terms:
            raise ValueError("Enter a searchable term")
        query = " AND ".join('"' + term + '"' for term in terms)
        if args.field:
            query = f"{args.field}: ({query})"
        source += " JOIN questions_fts ON questions_fts.rowid=q.rowid"
        clauses.append("questions_fts MATCH ?")
        values.append(query)
        order = "bm25(questions_fts),q.path,q.position"
    where = " WHERE " + " AND ".join(clauses)
    count = db.execute(f"SELECT count(*) FROM {source}{where}", values).fetchone()[0]
    rows = db.execute(f"SELECT q.*,p.id AS pack_id FROM {source}{where} ORDER BY {order} LIMIT ? OFFSET ?",
                      [*values, args.limit, args.offset])
    return {"total": count, "items": [row_dict(row) for row in rows]}


def duplicate_groups(db, mode):
    key = "answer_key" if mode == "answer" else "question_key"
    group_fields = key if mode == "answer" else f"language,{key}"
    groups = defaultdict(list)
    rows = db.execute(
        f"""SELECT id,path,position,question,answer,language,{key}
            FROM questions WHERE {key}!='' AND ({group_fields}) IN
            (SELECT {group_fields} FROM questions GROUP BY {group_fields} HAVING count(*)>1)
            ORDER BY {group_fields},path,position""" if mode != "answer" else
        """SELECT id,path,position,question,answer,language,answer_key FROM questions
           WHERE answer_key!='' AND answer_key IN
           (SELECT answer_key FROM questions GROUP BY answer_key HAVING count(*)>1)
           ORDER BY answer_key,path,position"""
    )
    for row in rows:
        group = (row[key], row["language"] if mode != "answer" else "")
        groups[group].append({k: row[k] for k in row.keys() if k != key})
    return [{"key": k, **({"language": lang} if lang else {}), "count": len(items),
             "questions": items} for (k, lang), items in
            sorted(groups.items(), key=lambda entry: (-len(entry[1]), entry[0]))]


def fuzzy(db, threshold=0.75, cross_language=True):
    rows = list(db.execute(
        "SELECT id,path,position,question,answer,answer_key,question_key,language FROM questions "
        "WHERE question_key!='' ORDER BY id"))
    tokens = [set(row["question_key"].split()) for row in rows]
    postings, answers = defaultdict(list), defaultdict(list)
    for i, row in enumerate(rows):
        if row["answer_key"]:
            answers[row["answer_key"]].append(i)
        for word in sorted(tokens[i]):
            if len(word) >= 3:
                postings[(row["language"], word)].append(i)
    for i, left in enumerate(rows):
        rare = sorted(
            (bucket for word in sorted(tokens[i])
             if 1 < len(bucket := postings.get((left["language"], word), ())) <= 160),
            key=len,
        )[:4]
        candidates = {j for bucket in rare for j in bucket if j > i}
        same_answer = answers.get(left["answer_key"], ())
        if len(same_answer) <= 160:
            candidates.update(j for j in same_answer if j > i)
        for j in sorted(candidates):
            right = rows[j]
            same_lang = left["language"] == right["language"]
            if same_lang and left["question_key"] != right["question_key"]:
                score = len(tokens[i] & tokens[j]) / len(tokens[i] | tokens[j])
                if score >= threshold:
                    yield pair(left, right, "similar_wording", score)
            elif not same_lang and cross_language and left["answer_key"] == right["answer_key"]:
                if left["question_key"] == right["question_key"] or (
                    len(left["answer_key"]) >= 4 and len(tokens[i] & tokens[j]) >= 2
                ):
                    yield pair(left, right, "possible_translation", None)


def pair(left, right, relation, score):
    keys = ("id", "path", "position", "question", "answer", "language")
    return {"relation": relation, "score": score, "questions":
            [{key: row[key] for key in keys} for row in (left, right)]}


def overlap(db, minimum):
    sizes = dict(db.execute("SELECT path,count FROM packs"))
    answers = defaultdict(set)
    for path, answer in db.execute("SELECT path,answer_key FROM questions WHERE answer_key!=''"):
        answers[path].add(answer)
    paths = defaultdict(set)
    for row in db.execute("SELECT path,language,question_key FROM questions WHERE question_key!=''"):
        paths[(row["language"], row["question_key"])].add(row["path"])
    common = Counter(pair for members in paths.values() for pair in combinations(sorted(members), 2))
    results = []
    for a, b in combinations(sorted(sizes), 2):
        shared = common[a, b]
        aa, bb = answers[a], answers[b]
        answer_overlap = len(aa & bb)
        if max(shared, answer_overlap) < minimum:
            continue
        results.append({"packs": [a, b], "shared_questions": shared,
                        "coverage": [round(100 * shared / max(sizes[p], 1), 2) for p in (a, b)],
                        "shared_answers": answer_overlap,
                        "answer_similarity": round(answer_overlap / max(len(aa | bb), 1), 4),
                        "potential_duplicate_pack": shared >= minimum and
                        shared / max(max(sizes[a], sizes[b]), 1) >= 0.5})
    return sorted(results, key=lambda item: (-item["shared_questions"], -item["answer_similarity"],
                                             item["packs"]))

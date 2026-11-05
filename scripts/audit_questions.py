#!/usr/bin/env python3
"""Read-only structural audit of the bundled question packs."""
import argparse
import collections
import json
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / 'databases'

def normalized(value):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', value).strip()).casefold()

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', action='store_true', help='Output full machine-readable report')
    args = parser.parse_args()
    issues = collections.defaultdict(list)
    counts = collections.Counter()
    packs = {}
    def issue(kind, file, detail):
        issues[kind].append({'file': str(file.relative_to(ROOT)), 'detail': detail})
    for file in sorted(DB.rglob('*.json')):
        if file == DB / 'list.json':
            continue
        try:
            data = json.loads(file.read_text(encoding='utf-8'))
        except (ValueError, OSError) as e:
            issue('invalid_json', file, str(e)); continue
        if not isinstance(data, dict) or not isinstance(data.get('questions'), list):
            issue('invalid_pack', file, 'Brak tablicy questions'); continue
        questions = data['questions']
        packs[str(file.relative_to(ROOT))] = data
        counts['packs'] += 1
        counts['questions'] += len(questions)
        counts[f'pack_size_{len(questions)}'] += 1
        if 'question_count' not in data:
            issue('missing_question_count', file, f'Faktycznie: {len(questions)}')
        elif type(data['question_count']) is not int or data['question_count'] != len(questions):
            issue('question_count_mismatch', file, f"Deklaracja: {data['question_count']!r}, faktycznie: {len(questions)}")
        seen = {}
        for i, q in enumerate(questions, 1):
            pos = f'pytanie {i}'
            if not isinstance(q, dict):
                issue('invalid_question', file, pos); continue
            unexpected = set(q) - {'category', 'subcategory', 'question', 'options', 'answer', 'explanation_correct', 'explanation_incorrect', 'last_verified_at', 'verifying_model'}
            if unexpected:
                issue('unexpected_question_fields', file, f'{pos}: {sorted(unexpected)!r}')
            for field in ('question', 'subcategory', 'answer'):
                if not isinstance(q.get(field), str) or not q[field].strip():
                    issue('missing_field', file, f'{pos}: {field}')
            for field in ('explanation_correct', 'explanation_incorrect'):
                if not isinstance(q.get(field), str) or not q[field].strip():
                    issue('missing_explanation', file, f'{pos}: {field}')
            if isinstance(q.get('question'), str) and q['question'].strip():
                key = normalized(q['question'])
                if key in seen:
                    issue('duplicate_question_in_pack', file, f'{pos}, powtórzenie pytania {seen[key]}: {q["question"]}')
                else: seen[key] = i
            options = q.get('options')
            if not isinstance(options, list):
                issue('invalid_options', file, f'{pos}: options nie jest tablicą'); continue
            if len(options) != 4:
                issue('option_count', file, f'{pos}: {len(options)} opcji; {q.get("question", "")}')
            invalid = [j + 1 for j, option in enumerate(options) if not isinstance(option, str) or not option.strip()]
            if invalid:
                issue('empty_or_invalid_option', file, f'{pos}: pozycje {invalid}')
            valid = [normalized(o) for o in options if isinstance(o, str) and o.strip()]
            if len(valid) != len(set(valid)):
                issue('duplicate_options', file, f'{pos}: {options!r}')
            answer = q.get('answer')
            if isinstance(answer, str) and answer.strip():
                matches = sum(option == answer for option in options)
                if matches != 1:
                    issue('answer_match', file, f'{pos}: dokładnych dopasowań {matches}, odpowiedź {answer!r}, opcje {options!r}')
                elif sum(normalized(o) == normalized(answer) for o in options if isinstance(o, str)) != 1:
                    issue('ambiguous_normalized_answer', file, f'{pos}: odpowiedź {answer!r}')
    list_file = DB / 'list.json'
    try:
        entries = json.loads(list_file.read_text(encoding='utf-8'))
        if not isinstance(entries, list): raise ValueError('Indeks nie jest tablicą')
        paths = collections.Counter()
        ids = collections.Counter()
        for entry in entries:
            if not isinstance(entry, dict):
                issue('invalid_index_entry', list_file, repr(entry)); continue
            path = entry.get('path'); paths[path] += 1; ids[entry.get('id')] += 1
            if path not in packs:
                issue('index_missing_pack', list_file, repr(path)); continue
            data = packs[path]
            for field in ('id', 'name', 'language', 'description'):
                if field in data and entry.get(field) != data[field]:
                    issue('index_metadata_mismatch', list_file, f'{path}: {field}: {entry.get(field)!r} != {data[field]!r}')
            if entry.get('question_count') != len(data['questions']):
                issue('index_count_mismatch', list_file, f'{path}: {entry.get("question_count")!r} != {len(data["questions"])}')
        for path in packs:
            if not paths[path]: issue('pack_missing_from_index', list_file, path)
        for path, n in paths.items():
            if n > 1: issue('duplicate_index_path', list_file, f'{path!r}: {n}')
        for ident, n in ids.items():
            if n > 1: issue('duplicate_index_id', list_file, f'{ident!r}: {n}')
        counts['index_entries'] = len(entries)
    except (ValueError, OSError) as e:
        issue('invalid_index', list_file, str(e))
    result = {'counts': dict(counts), 'issues': dict(issues)}
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Paczki: {counts['packs']}, pytania: {counts['questions']}, wpisy indeksu: {counts['index_entries']}")
        print('Rozmiary paczek:', ', '.join(f'{k[10:]}: {v}' for k, v in sorted(counts.items(), key=lambda x: int(x[0][10:]) if x[0].startswith('pack_size_') else -1) if k.startswith('pack_size_')))
        if not issues: print('Nie wykryto problemów strukturalnych.')
        for kind, records in sorted(issues.items()):
            print(f'\n{kind}: {len(records)}')
            for record in records:
                print(f"  {record['file']}: {record['detail']}")
    return 1 if issues else 0

if __name__ == '__main__':
    sys.exit(main())

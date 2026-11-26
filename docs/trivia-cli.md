# CLI bazy pytań Trivia

Uruchamiaj polecenia z katalogu projektu. Wymagany jest Python 3.10+ z SQLite i FTS5. Na Windows użyj WSL. Pliki JSON w `databases/` są źródłem pytań. Repozytorium przechowuje w `audit-state/` wyniki przeglądów, zadania, poprawki, mapowania ID i podsumowania przebiegów. SQLite, pliki robocze, raporty i migawka ostrzeżeń reguł są w ignorowanym katalogu `.trivia/`. Po świeżym klonowaniu CLI oblicza ostrzeżenia lokalnie.

## Indeks, wyszukiwanie i diagnostyka

```sh
./trivia migrate-ids --dry-run
./trivia migrate-ids --apply
./trivia index --rebuild
./trivia stats
./trivia search 'teoria względności' --language pl --limit 10
./trivia search magnesium --field options
./trivia answer Einstein --partial --json
./trivia packs inspect nauka_pl --limit 3
./trivia question show QID --json
./trivia lint --pack nauka_pl
./trivia duplicates --exact --limit 20 --offset 0
./trivia duplicates --fuzzy --threshold .75
./trivia duplicates --by-answer
./trivia overlap --min-count 10
```

Migracja przypisuje losowe, trwałe ID i zachowuje wcześniej nadane identyfikatory. Po ręcznej zmianie paczki odśwież indeks przez `./trivia index`. Polecenie rozróżnia rekordy dodane, usunięte, zmienione oraz przesunięte. `--details` zwraca odpowiadające im ID. `--limit` i `--offset` ograniczają wyjście, a `--json` zwraca dane dla skryptów.

Dokładne duplikaty to znormalizowane treści w tym samym języku. Podobieństwo słów jest heurystyką. Wspólna odpowiedź, przypuszczalny odpowiednik językowy i ostrzeżenie o spoilerze wymagają oceny. Kontrola źródeł stanowi osobny wynik.

## Zadania audytu

```sh
./trivia lint --record --limit 10
./trivia findings list --type answer_in_question --limit 10
./trivia audit plan --type duplicate
./trivia audit next --type ambiguity --blind --limit 25 --output /tmp/trivia-task.json
./trivia audit next --task TASK_ID
./trivia audit next --type quality --follow-up --limit 25
./trivia audit submit results.jsonl --dry-run
./trivia audit submit results.jsonl
./trivia audit progress --json
./trivia audit report --markdown
./trivia audit release TASK_ID
```

`plan` podgląda przydział. `next` zapisuje ID i hashe. `next --task` odtwarza dane pytań dla nadal aktualnych rewizji i oznacza przestarzałe wpisy. `--output` zapisuje pełną kopię przydziału do pracy poza tym checkoutem. `release` zwalnia niedokończoną pracę do przydzielenia. Dla próbki użyj `audit sample --count 500 --seed 42 --type quality --save --output /tmp/trivia-sample.json`. Próbka jest warstwowana według paczki, języka i wykrytych ostrzeżeń. Ten sam seed, zestaw kwalifikujących się pytań i stan ryzyka dają tę samą próbkę.

Każdy wykonawca zapisuje własny JSONL. Pobierz wartości `task_id`, `question_id` i `expected_hash` z zadania. Skopiuj `expected_hash` do `content_hash` w wyniku.

```json
{"task_id":"TASK_ID","question_id":"QID","content_hash":"sha256:…","status":"uncertain","method":"llm_review","model":"NAZWA_MODELU","details":"Powód niepewności"}
```

Dla `issues_found` dodaj `findings` z polami `type`, `severity` i `details`. `passed` wymaga jawnej oceny. Ustaw `source_verified: true` wyłącznie dla faktycznie sprawdzonych źródeł i podaj ich adresy w `sources`. Ponowny import identycznego wyniku jest bezpieczny. Edycja pytania po przydziale powoduje konflikt przy imporcie. Ważność już zapisanej oceny zależy od pól używanych przez dany typ kontroli. W wyniku duplikatów uwzględniana jest także grupa powiązanych pytań.

## Poprawki

Każda linia wskazuje jedno pytanie, jego aktualny hash, uzasadnienie i zmieniane pola.

```json
{"question_id":"QID","expected_hash":"sha256:…","reason":"Doprecyzowanie zakresu","changes":{"question":"Treść pytania po poprawce"}}
```

```sh
./trivia patch validate patches.jsonl
./trivia patch apply patches.jsonl --dry-run
./trivia patch apply patches.jsonl
```

Polecenie sprawdza strukturę, odpowiedź, opcje i nowe dokładne duplikaty. Poprawka zachowuje ID. Integrator stosuje zatwierdzone poprawki do plików paczek. Zmienione rekordy i zależne wyniki można skontrolować osobno.

## Nowe paczki

```sh
./trivia packs topics --theme Astronomia
./trivia packs create --name 'Astronomia — paczka 3' --description 'Pytania o planety i gwiazdy' --language pl
./trivia packs validate-blueprints blueprints.json
./trivia packs validate candidate.json --blueprints blueprints.json
./trivia packs import candidate.json --blueprints blueprints.json --dry-run
./trivia packs import candidate.json --blueprints blueprints.json
./trivia packs publish astronomia_paczka_3_pl --reviews reviews.jsonl --dry-run
```

`packs create` zwraca ścieżki do blueprintów i kandydata. Polecenie `packs draft PACK_ID` pokazuje brakujące lub niezgodne pozycje. Uzupełnij `topics` o `subcategory`, `target_answer` i opcjonalny `target_fact`. Generuj kandydatów w kolejności blueprintów, dopisując kolejne partie do pliku roboczego. Import przydziela brakujące ID i zapisuje paczkę w `.trivia/staging/`. Przy aktualizacji istniejącej paczki użyj `packs update` na aktualnym eksporcie z ID.

Publikacja lokalna wymaga jawnych przeglądów `ambiguity`, `distractors`, `category_relevance` oraz `factuality` dla ID i hasha każdego kandydata ze stagingu. Hash możesz obliczyć przez `./trivia packs inspect-staged PACK_ID --json`. Format wyników to JSONL z `question_id`, `content_hash`, `type`, `status: "passed"` i `method`. Oceń też ostrzeżenia jakościowe i potencjalne parafrazy pokazywane przez walidator.

Po sprawdzeniu podglądu uruchom polecenie publikacji bez `--dry-run` i testy. Import, publikacja lokalna, commit i push są odrębnymi operacjami. CLI nie wywołuje API modeli ani Git. Generator przeglądarkowy zachowuje ID przy imporcie i eksporcie. Jego jawny wynik kontroli zawiera hash tej samej rewizji, dostępny do odczytu przez CLI.

## Testy

```sh
python3 -m unittest discover -s tests -p 'test_trivia_cli.py'
npm test
```

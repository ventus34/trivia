---
name: trivia-question-packs
description: Projektowy skill gry Trivia (ventus34/trivia). Dla listy kategorii przygotuj blueprinty subkategoria + odpowiedź, deleguj generowanie pytań według kategorii i publikuj paczki przez commit oraz push. Domyślnie 100 nowych pytań na kategorię.
---

# Paczki pytań Trivia

Skill należy do projektu zawierającego ten plik w `.agents/skills/trivia-question-packs/`. Przyjmij listę kategorii i doprowadź każdą paczkę do dostępności w grze. Utworzenie tego skilla lub rozmowa o jego konfiguracji nie jest poleceniem wygenerowania i opublikowania pytań.

## Ustalenia użytkownika

- Domyślnie jedna paczka **100 nowych pytań dla każdej kategorii**, język **polski**, mieszana trudność dla ogólnych odbiorców. Respektuj inne liczby, język i trudność z polecenia, także różne liczby dla poszczególnych kategorii. Nie zmniejszaj liczby ze względu na długość odpowiedzi; generuj w partiach i zapisz kompletny wynik w plikach.
- Istniejąca kategoria dostaje **osobną paczkę**, np. `Astronomia — paczka 2`; nie dopisuj do starej i nie zastępuj jej. Nowe pytania nie powinny powtarzać dotychczasowych.
- Docelowe repo: `https://github.com/ventus34/trivia.git`. Ustal katalog główny projektu względem lokalizacji tego skilla i przez `git rev-parse --show-toplevel`; nie uzależniaj procesu od ścieżki konkretnego komputera. Potwierdź remote, zamiast zakładać, że bieżący katalog jest właściwy. Nie stosuj tego procesu do innych projektów.
- Wywołanie tego procesu dla podanych kategorii obejmuje automatyczny commit i push tych paczek do tego repozytorium, bez dodatkowego pytania o zwykły push. Uszanuj polecenie typu „tylko lokalnie”, „bez publikacji” lub wskazaną inną gałąź. Uprawnienia środowiska nadal obowiązują.

## Repozytorium i publikowana gałąź

Przeczytaj obowiązujące `AGENTS.md`, sprawdź stan roboczy, staged diff, remote oraz aktualne źródło publikacji GitHub Pages. Ustal je z konfiguracji Pages albo istniejącego workflow publikacji i ostatniego udanego wdrożenia. Obecnie strona gry to `https://ventus34.github.io/trivia/`, a domyślna gałąź repo to `main`; przed publikacją potwierdź aktualne źródło. Nie publikuj przypadkiem na aktualnej gałęzi roboczej, która nie zasila strony.

Użyj dostępnego GitHub connectora do odczytów, konfiguracji Pages i statusów wdrożenia; do lokalnych zmian i pushu użyj Git. Gdy konektor nie udostępnia potrzebnego odczytu, skorzystaj z dostępnego uwierzytelnionego CLI/API. Jeśli nie da się ustalić gałęzi publikacji, przygotuj lokalne paczki i wyjaśnij brakującą informację; nie zgaduj ustawień hostingu ani ich nie zmieniaj.

Przed generowaniem pobierz aktualny stan gałęzi docelowej. Pracuj w odpowiedniej czystej kopii lub izolowanej kopii bazującej na zdalnej gałęzi publikacji. Nie stashuj, nie kasuj i nie commituj cudzych zmian. Jeśli lokalna gałąź zawiera inne niewypchnięte commity, nie wypychaj ich razem z paczkami. W izolowanej gałęzi użyj prefiksu `codex/`, a docelowy ref pushu wskaż jawnie, np. `HEAD:main`, dopiero po potwierdzeniu źródła publikacji.

## Dwa etapy generowania

Sprawdź aktualny format w `databases/categories/`, `databases/list.json` i `js/trivia/client-adapter.js`. Obsługiwane języki interfejsu to `pl` i `en`; nie obiecuj obsługi kolejnego bez sprawdzenia gry.

### 1. Blueprinty wszystkich kategorii

Zanim zaczniesz pisać pytania, przygotuj dla każdej kategorii pełną listę **par `subcategory` + `target_answer`**, po jednej na zamówione pytanie. Blueprint ustala konkretną odpowiedź i dziedzinę; nie wymaga jeszcze treści pytania ani dystraktorów. To osobny etap planowania, nie opis dopisany do gotowych pytań. Nazwa `target_answer` jest zgodna z istniejącymi promptami w `prompts.json`; przydatne są też `generate_blueprints` i `generate_question_from_blueprint`. Opcjonalny `modifier` może doprecyzować zamysł, ale nie jest wymagany dla każdej pary.

Przykład fragmentu blueprintów dla kategorii „Kuchnie świata”:

```json
{
  "pack_id": "kuchnie_swiata_pl",
  "language": "pl",
  "topics": [
    {"subcategory": "Owoce i warzywa", "target_answer": "mango"},
    {"subcategory": "Czerwone wina", "target_answer": "pinot noir"}
  ]
}
```

Zapisz osobny plik `blueprints/<pack_id>.json` w katalogu roboczym poza bazami gry. `topics` ma zawierać dokładnie zamówioną liczbę pozycji (domyślnie 100). Rozłóż odpowiedzi między sensowne podkategorie, aby pokryć temat, zamiast zapełniać listę jednym wąskim obszarem.

Przed delegowaniem przejrzyj i sprawdź programowo liczebność oraz unikalność odpowiedzi w obrębie paczki, niezależnie od podkategorii. Oprócz wielkości liter i odstępów uwzględnij semantycznie synonimy, aliasy oraz różne zapisy tego samego obiektu. Zmiana podkategorii nie czyni powtórzonej odpowiedzi nowym celem. Porównaj cele z odpowiedziami i tematami istniejących paczek tej kategorii; preferuj niewykorzystane obiekty i fakty. Sama wspólna odpowiedź w odległych kategoriach nie oznacza powtórzonego pytania, więc nie wykluczaj jej globalnie bez oceny kontekstu. Porównaj także blueprinty nowych kategorii o pokrywającym się zakresie i usuń powtórzenia tego samego faktu.

Sol koordynuje komplet blueprintów przed uruchomieniem drugiego etapu. Brakujące lub odrzucone pozycje uzupełnij na tym etapie; nie kompensuj ich przypadkowymi pytaniami dopisanymi później. Nie jest potrzebne osobne zatwierdzenie blueprintów przez użytkownika, chyba że o to poprosi.

### 2. Pytania delegowane według kategorii

Deleguj generowanie pełnych pytań do subagentów wykonawczych (Luna zgodnie z zasadami współpracy projektu): jeden przydział obejmuje jedną kategorię i jej ustalony komplet blueprintów. Kategorie mogą powstawać równolegle w granicach dostępnych slotów; nadmiar uruchamiaj kolejno. Jeśli delegowanie jest niedostępne albo użytkownik je wyłączył, wykonaj ten sam drugi etap samodzielnie, zachowując blueprinty.

Przekaż subagentowi plik blueprintów, nazwę i ID paczki, język, trudność, wymagany format pytań oraz wyłączną ścieżkę jego pliku wynikowego. Przekaż też istotne stare pytania lub wykluczenia dla tej kategorii. Subagent zapisuje kandydat poza bazami gry; nie edytuje indeksu, cache ani plików innych kategorii i nie wykonuje commita lub pushu. Sol odpowiada za wspólną integrację i publikację.

Wygeneruj **dokładnie jedno pytanie dla każdej pozycji `topics`, w tej samej kolejności**. Zachowaj `subcategory` oraz `answer` dokładnie równe `target_answer`; tę samą odpowiedź umieść wśród czterech opcji. Nie pozwalaj subagentom samodzielnie podmieniać odpowiedzi, pomijać trudnych pozycji ani rozszerzać listy. Gdy cel jest błędny, niejednoznaczny lub nieweryfikowalny, subagent zgłasza numer pozycji i przyczynę; Sol poprawia blueprint, ponownie sprawdza powtórzenia i zleca wygenerowanie brakującego pytania.

Pytania mają być różnorodne, samodzielne i jednoznaczne, z dokładnie jedną prawidłową odpowiedzią oraz trzema wiarygodnymi dystraktorami. Nie podpowiadaj odpowiedzi w pytaniu. Unikaj wariantów tego samego faktu i przewidywalnego położenia poprawnej opcji. Wyjaśnienia muszą zgadzać się z odpowiedziami.

Weryfikuj w wiarygodnych źródłach fakty niepewne, niszowe i zmienne, także twierdzenia w dystraktorach i wyjaśnieniach. Preferuj stabilną wiedzę. Dla stanu na konkretny dzień podaj datę w pytaniu. Nie kopiuj gotowych baz ani nie wymyślaj faktów, cytatów lub źródeł; niepewne pytanie zastąp sprawdzalnym. Sam walidator JSON nie sprawdza prawdziwości ani semantycznych powtórzeń — wykonaj również przegląd merytoryczny.

Sol sprawdza zgodność kompletnych wyników z blueprintami i powtórzenia między paczkami. Blueprinty są artefaktami roboczymi do wznowienia i kontroli, a do gry trafia dotychczasowy format paczek; nie dodawaj blueprintów do indeksu ani do commita publikującego pytania bez osobnego polecenia użytkownika.

## Format paczki

Zapisz każdy kandydat jako plik JSON UTF-8 poza docelowym katalogiem baz:

```json
{
  "id": "astronomia_pack_2_pl",
  "name": "Astronomia — paczka 2",
  "language": "pl",
  "description": "Planety, gwiazdy, obserwacje nieba i historia astronomii.",
  "questions": [
    {
      "subcategory": "Planety",
      "question": "Która planeta Układu Słonecznego jest największa?",
      "options": ["Wenus", "Jowisz", "Mars", "Neptun"],
      "answer": "Jowisz",
      "explanation_correct": "Jowisz ma największą średnicę i masę spośród planet Układu Słonecznego.",
      "explanation_incorrect": "Wenus, Mars i Neptun są mniejsze od Jowisza."
    }
  ]
}
```

Przykład pokazuje strukturę jednego pytania; docelowa tablica ma zawierać pełną zamówioną liczbę. `answer` jest dokładną treścią jednej opcji, nie literą ani indeksem. Używaj krótkich opisów do 100 znaków, które nie zaczynają się od automatycznych prefiksów skanera `Pytania z zakresu:` ani `Questions covering:`. ID ma być unikalnym slugiem ASCII zakończonym `_pl` lub `_en`; przepisuj polskie znaki, np. `ł` na `l`. Dla istniejącego tematu sprawdź ID, nazwy i treści, uwzględnij stare wadliwe slugi i wybierz następny wolny numer paczki. Zachowaj ten sam numer w ID i nazwie.

## Integracja i sprawdzenie

Użyj [scripts/prepare_packs.py](scripts/prepare_packs.py) z `--blueprints-dir` wskazującym ustalone blueprinty. Domyślnie wykonuje tylko kontrolę i pokazuje plan. `--write` dodaje nowe pliki, indeksuje je i zwiększa wersję cache w `sw.js`. Nie wykonuje żadnych operacji Git ani sieciowych.

```bash
python3 /ABSOLUTE/SKILL/DIR/scripts/prepare_packs.py --repo /PATH/TO/TRIVIA --blueprints-dir /TMP/blueprints --count 100 /TMP/pack-a.json /TMP/pack-b.json
python3 /ABSOLUTE/SKILL/DIR/scripts/prepare_packs.py --repo /PATH/TO/TRIVIA --blueprints-dir /TMP/blueprints --count 100 --write /TMP/pack-a.json /TMP/pack-b.json
```

Podstaw rzeczywiste ścieżki. Dla różnych liczebności uruchom osobno grupy o tej samej liczbie. Skrypt uzupełnia rzeczywiste `question_count`, `created_at` i `updated_at`; sprawdza strukturę, kolizje ID i nazw, duplikaty tekstów pytań w tym samym języku, także względem istniejących baz. Z `--blueprints-dir` sprawdza też liczebność i unikalność celów oraz zgodność każdej pary podkategoria–odpowiedź z pytaniem na tej samej pozycji. Nie wykrywa automatycznie aliasów ani duplikatów znaczeniowych — to część przeglądu Sola. Napraw błędy przed zapisem. Nie omijaj kontroli tylko po to, by uzyskać oczekiwaną liczbę.

Skrypt aktualizuje wyłącznie nowe wpisy indeksu, zachowując stare metadane. Repozytoryjne `npm run scan-db` może dodatkowo przepisać opisy i daty istniejących baz, więc do zwykłego dodawania paczek nie jest potrzebne. Jeśli format repozytorium zmienił się względem helpera, dostosuj integrację do aktualnego loadera i sprawdź cały diff.

**Cache jest częścią publikacji:** `databases/list.json` jest obecnie serwowane jako Cache First. Zmiana samego JSON nie wystarczy u użytkownika z zainstalowaną PWA. Zwiększenie `CACHE_NAME` uruchamia ponowną instalację service workera i pobranie indeksu. Nie dodawaj osobno każdego pliku do `PRECACHE_ASSETS`: worker czyta indeks. Jeśli strategia cache została zmieniona, zweryfikuj aktualny mechanizm odświeżenia.

Sprawdź diff, wczytanie każdego nowego wpisu indeksu i liczbę pytań oraz `node --check sw.js` i `npm test`. Sprawdź również, że pytania przechodzą przez aktualny adapter gry z czterema opcjami i poprawnym `answer`. Gra wymaga sześciu wybranych kategorii: mniej nowych kategorii uzupełnia się istniejącymi; nie generuj dodatkowych kategorii bez zamówienia.

## Commit, push i dostępność

Dodaj do commita tylko nowe pliki paczek, `databases/list.json` i wymaganą zmianę cache. Przejrzyj `git diff --cached` przed commitem; unikaj `git add .`. Wypchnij zwykłym pushem do potwierdzonej gałęzi publikacji. Nie zastępuj automatycznej publikacji samym otwarciem PR-a, jeśli repo pozwala na bezpośredni push.

Jeśli zdalna gałąź przesunęła się, dopuszczalna jest jedna próba ponownej integracji na nowej bazie. Sprawdź ponownie wolne ID/numerację, duplikaty, indeks i cache, potem powtórz kontrole. Bez force-pusha. Przy kolejnym konflikcie, odmowie uprawnień lub ochronie gałęzi zachowaj wynik lokalnie i podaj konkretną blokadę. Nie zmieniaj ochrony gałęzi, uprawnień ani ustawień wdrożenia. Przy niejednoznacznym wyniku pushu sprawdź zdalny SHA i pliki przed ponowieniem, aby nie wygenerować drugiej kopii paczek.

Potwierdź zdalny commit i odczytaj stan wdrożenia Pages dla tej rewizji. Sprawdzaj z rozsądnymi odstępami, maksymalnie przez 5 minut w bieżącym uruchomieniu. Po wdrożeniu pobierz **ze strony gry**, z ominięciem cache HTTP, `databases/list.json` i nowe paczki; porównaj ID, liczebności i treść z opublikowanym wynikiem. Potwierdź również nową wersję `sw.js`. Sukces pushu nie dowodzi gotowości gry. Jeżeli wdrożenie trwa lub odczyt jest niedostępny, podaj ten status zamiast deklarować gotowość; nie twórz automatyzacji bez polecenia.

Zakończ krótką odpowiedzią po polsku: kategorie i liczba nowych pytań, link do commita, stan publikacji oraz link do gry. Przy gotowym wdrożeniu dodaj, że w otwartej wcześniej PWA może być potrzebne zamknięcie i ponowne otwarcie gry, aby aktywować aktualizację.

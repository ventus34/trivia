# Trivia Board Game

The **Trivia** board game is an interactive, fully client-side (serverless) quiz game built with HTML, Tailwind CSS, and vanilla JavaScript. The game allows for offline gameplay using built-in question databases (JSON files) and offers the ability to upload or paste custom question decks.

---

## 🚀 Main Features

1. **Offline Gameplay (Question Database)**:
   - Convenient loading of built-in JSON question databases.
   - Ability to upload your own question database file (`.json`) or paste generated database text directly into the form.
   - Robust resilience to parsing errors (Json Healing).

2. **Category Selection**:
   - Convenient category selection screen allowing players to select exactly 6 categories for the game.
   - Random category choice option and filter by language (PL/EN).

3. **Save and Restore Game State**:
   - The game automatically saves state to `localStorage` after every move.
   - Download the current state as a `.json` file ("Download State") and upload it later ("Load Game") to continue playing on another device.

4. **Premium Design and Space Optimization**:
   - Clear top bar indicating the active player's turn and displaying scores alongside earned wedges in the form of horizontal capsules.
   - Floating 3D die in the bottom-right corner of the board, integrated with rolling mechanics and pawn movement animations.
   - Complete support for multiple themes (OLED, Dark, Light) with elegant background blur (`backdrop-filter`) and smooth transitions.

5. **AI Question Database Generator**:
   - An advanced built-in developer/admin tool (`generator.html` and `js/generator.js`) for direct question generation using LLM APIs (OpenRouter, OpenAI, LM Studio, Ollama).
   - Supports batch generation, custom difficulty levels, automatic spoiler checks (preventing questions containing their own answers), and ZIP exporting.

---

## 📁 Project Structure

- `/databases` – Directory containing question databases.
  - `general_pl.json` – Default Polish question database (Wiedza Ogólna).
  - `general_en.json` – Default English question database (General Knowledge).
  - `list.json` – Automatically generated index of available databases.
- `/js/trivia` – Main game modules:
  - `main.js` – Game entry point and initialization.
  - `state.js` – Dynamic game state.
  - `client-adapter.js` – Offline API database adapter.
  - `board.js` & `ui-board.js` – Grid layout generation, board, and pawn rendering logic.
  - `ui-events.js` – Event handlers and screen navigation.
  - `utils.js` – Helper functions, JSON parser.
  - `/services/persistence-service.js` – State saving, downloading, and restoring.
- `index.html` – Main game screen.
- `style.css` – Stylesheet (Vanilla CSS integrated with Tailwind Play CDN).
- `generator.html` – Independent database generator tool (with built-in API support).

---

## 🛠️ Development and Workflow

Install development dependencies (ESLint, Prettier, Vitest):
```bash
npm install
```

### Running Locally
The easiest way to run the game is using a local static server, for example, `http-server`:
```bash
npx http-server -p 8220
```
The game will be available at: `http://127.0.0.1:8220`.

### Automatic Database Scanning
After committing a new `.json` database file to the `/databases` folder, run the scan script to automatically update the `list.json` index:
```bash
npm run scan-db
```
The new database will immediately appear in the game setup screen!

### Running Tests
Run automated unit tests (board logic, JSON parsing, persistence):
```bash
npm run test
```

### Formatting and Linting
Format the code with Prettier:
```bash
npm run format
```

Lint the code for static errors with ESLint:
```bash
npm run lint
```

---

# Gra Planszowa Trivia

Gra planszowa **Trivia** to interaktywna, w pełni kliencka (bezserwerowa) gra quizowa oparta na HTML, Tailwind CSS i czystym JavaScripcie. Gra pozwala na rozgrywkę offline przy użyciu wbudowanych baz pytań (plików JSON) oraz daje możliwość wczytywania własnych talii pytań.

---

## 🚀 Główne Funkcje

1. **Rozgrywka Offline (Baza Pytań)**:
   - Wygodne wczytywanie wbudowanych baz pytań JSON.
   - Możliwość wgrania własnego pliku bazy pytań (`.json`) lub wklejenia wygenerowanego tekstu bazy bezpośrednio w formularzu.
   - Pełna odporność na błędy parsowania (Json Healing).

2. **Wybór Kategorii**:
   - Intuicyjny panel wyboru pozwalający graczom wybrać dokładnie 6 kategorii do rozgrywki.
   - Opcja losowego wyboru kategorii oraz filtrowanie po języku (PL/EN).

3. **Zapis i Odtwarzanie Stanu Gry (Save/Restore)**:
   - Gra automatycznie zapisuje stan po każdym ruchu w `localStorage`.
   - Możliwość pobrania aktualnego stanu jako plik `.json` („Pobierz zapis”) i późniejszego wgrania („Wczytaj grę”) w celu kontynuowania rozgrywki na innym urządzeniu.

4. **Premium Design i Optymalizacja Przestrzeni**:
   - Przejrzysta górna belka informująca o aktualnej turze gracza oraz wyświetlająca punktację wraz ze zdobytymi cząstkami (klinami) w formie poziomych kapsułek.
   - Pływająca kostka 3D w prawym dolnym rogu planszy, zintegrowana z systemem rzutów i animacji ruchu pionków.
   - Pełne dopasowanie do motywów (OLED, Dark, Light) z efektownym rozmyciem tła (`backdrop-filter`) i płynnymi animacjami.

5. **Generator Baz Pytań AI**:
   - Zaawansowane wbudowane narzędzie (`generator.html` i `js/generator.js`) do bezpośredniego generowania pytań za pomocą API modeli LLM (OpenRouter, OpenAI, LM Studio, Ollama).
   - Wspiera generowanie partiami (batch), dostosowanie poziomu trudności, automatyczne sprawdzanie spoilerów (wykrywanie pytań zawierających własne odpowiedzi) oraz eksport do plików JSON/ZIP.

---

## 📁 Struktura Projektu

- `/databases` – Katalog na bazy pytań.
  - `general_pl.json` – Domyślna polska baza pytań (Wiedza Ogólna).
  - `general_en.json` – Domyślna angielska baza pytań (General Knowledge).
  - `list.json` – Indeks dostępnych baz pytań generowany automatycznie.
- `/js/trivia` – Moduł główny gry:
  - `main.js` – Punkt wejścia i inicjalizacja gry.
  - `state.js` – Dynamiczny stan gry.
  - `client-adapter.js` – Offline'owy adapter API baz danych.
  - `board.js` & `ui-board.js` – Logika generowania siatki pól oraz rysowania planszy i pionków.
  - `ui-events.js` – Obsługa zdarzeń i nawigacja ekranów.
  - `utils.js` – Funkcje pomocnicze, parser JSON.
  - `/services/persistence-service.js` – Zapis, pobieranie oraz przywracanie stanu rozgrywki.
- `index.html` – Główny ekran gry.
- `style.css` – Arkusz stylów (arkusz stylów Vanila CSS zintegrowany z Tailwind Play CDN).
- `generator.html` – Niezależne narzędzie do bezpośredniej generacji baz pytań przez API LLM (z obsługą weryfikacji spoilerów, edycji CMS oraz eksportu ZIP).

---

## 🛠️ Praca z Projektem i Rozwój

Instalacja zależności deweloperskich (ESLint, Prettier, Vitest):
```bash
npm install
```

### Uruchomienie lokalne
Najprostszym sposobem na uruchomienie gry jest postawienie lokalnego serwera statycznego, np. `http-server`:
```bash
npx http-server -p 8220
```
Gra będzie dostępna pod adresem: `http://127.0.0.1:8220`.

### Automatyczne skanowanie baz pytań
Po zacommitowaniu nowego pliku `.json` z bazą pytań w katalogu `/databases`, uruchom skrypt skanujący w celu automatycznego zaktualizowania indeksu `list.json`:
```bash
npm run scan-db
```
Nowa baza pytań natychmiast pojawi się na liście wyboru w grze!

### Testy
Uruchomienie automatycznych testów jednostkowych (logika planszy, parsowanie JSON, persistence):
```bash
npm run test
```

### Formatowanie i Linting
Formatowanie kodu za pomocą Prettiera:
```bash
npm run format
```

Sprawdzanie błędów statycznych w kodzie (ESLint):
```bash
npm run lint
```


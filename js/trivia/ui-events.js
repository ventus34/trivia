import { UI } from './dom.js';
import { gameState, setState } from './state.js';
import { getApiAdapter } from './services/api-service.js';
import {
  setLanguage,
  updateDescriptions,
  updatePlayerNameInputs,
  closePopupAndContinue,
  setupGameMenu,
  updateCategoryInputs,
} from './ui.js';
import { hideHistoryModal } from './ui-history.js';
import { restartGame, downloadGameState, handleStateUpload } from './persistence.js';
import {
  initializeGame,
  askQuestion,
  rollDice,
  handleOpenAnswer,
  handleManualVerification,
} from './game-flow.js';
import { verifyIncorrectAnswer } from './game-api.js';
import { CATEGORY_PRESETS, translations } from './config.js';
import { notify } from './error-bus.js';
import { healAndParseJSON } from './utils.js';

/**
 * Compiles the AI Prompt based on current configurations.
 */
export function compileAIPrompt() {
  const lang = gameState.currentLanguage;
  const theme = UI.themeInput ? UI.themeInput.value.trim() : '';
  const difficultyVal = UI.knowledgeLevelSelect ? UI.knowledgeLevelSelect.value : 'intermediate';
  const gameModeVal = UI.gameModeSelect ? UI.gameModeSelect.value : 'mcq';
  const qPerCategory = UI.qPerCategoryInput ? parseInt(UI.qPerCategoryInput.value) || 20 : 20;
  const totalQuestions = qPerCategory * 6;
  const format = UI.promptFormatSelect ? UI.promptFormatSelect.value : 'tct';

  const categoryInputs = Array.from(
    document.querySelectorAll('#categories-container .category-input')
  ).map((input) => input.value.trim());
  const cats = categoryInputs.length === 6 ? categoryInputs : ['', '', '', '', '', ''];

  let difficultyText = difficultyVal;
  let gameModeText = gameModeVal;

  if (lang === 'pl') {
    difficultyText =
      difficultyVal === 'basic'
        ? 'Podstawowy'
        : difficultyVal === 'expert'
          ? 'Ekspercki'
          : 'Średniozaawansowany';
    gameModeText =
      gameModeVal === 'mcq' ? 'Jednokrotny wybór (4 opcje)' : 'Otwarte (krótka odpowiedź)';
  } else {
    difficultyText =
      difficultyVal === 'basic' ? 'Basic' : difficultyVal === 'expert' ? 'Expert' : 'Intermediate';
    gameModeText =
      gameModeVal === 'mcq' ? 'Multiple choice (4 options)' : 'Short answer (open question)';
  }

  const dbName = theme
    ? lang === 'pl'
      ? `Trivia - Temat: ${theme}`
      : `Trivia - Theme: ${theme}`
    : lang === 'pl'
      ? 'Trivia - Wiedza Ogólna'
      : 'Trivia - General Knowledge';

  if (format === 'tct') {
    if (lang === 'pl') {
      const gameModeFormatInfo =
        gameModeVal === 'mcq'
          ? 'O: Opcja A|Opcja B|Opcja C|Opcja D (cztery unikalne opcje wyboru rozdzielone pionową kreską |, z których jedna musi dokładnie pasować do poprawnej odpowiedzi)'
          : 'O: (pozostaw puste lub pomiń tę linię)';
      const gameModeExampleInfo =
        gameModeVal === 'mcq'
          ? 'O: Poprawna odpowiedź|Błędna odpowiedź 1|Błędna odpowiedź 2|Błędna odpowiedź 3'
          : 'O: ';

      return `Jesteś ekspertem od tworzenia gier typu Trivia. Wygeneruj bazę danych pytań w formacie tekstowym do gry planszowej.

DANE WEJŚCIOWE KONFIGURACJI:
- Język pytań: polski (pl)
- Temat przewodni (motyw): ${theme || 'Brak (wiedza ogólna)'}
- Poziom trudności: ${difficultyText}
- Tryb gry: ${gameModeText}
- Liczba pytań na kategorię: ${qPerCategory} (łącznie ${totalQuestions} pytań dla 6 kategorii)
- Kategorie (każde pytanie musi należeć do jednej z nich):
  1. ${cats[0]}
  2. ${cats[1]}
  3. ${cats[2]}
  4. ${cats[3]}
  5. ${cats[4]}
  6. ${cats[5]}

FORMAT WYJŚCIOWY:
Zwróć bazę danych w poniższym formacie. Zacznij od metadanych (Name, Lang, Categories) na samej górze. Każde pytanie musi być oddzielone od kolejnego separatorem "---" w nowej linii.

Metadane na samej górze:
Name: ${dbName}
Lang: pl
Categories: ${cats.join(', ')}

Format każdego pytania:
C: Kategoria (musi być dokładnie jedną z 6 podanych wyżej)
S: Podkategoria/temat szczegółowy
Q: Treść pytania
${gameModeFormatInfo}
A: Dokładna treść poprawnej odpowiedzi
EC: Krótkie wyjaśnienie dlaczego odpowiedź jest poprawna
EI: Krótkie wyjaśnienie dlaczego pozostałe opcje są błędne (lub co mogło zmylić gracza)

Przykład pytania:
C: ${cats[0]}
S: Astronomia starożytna
Q: Jaka była pierwsza znana nazwa planety Wenus?
${gameModeExampleInfo}
A: Jutrzenka
EC: Gwiazda Poranna lub Jutrzenka to tradycyjne nazwy Wenus obserwowanej o świcie.
EI: Inne planety nie miały takich nazw w języku polskim.

Zwróć WYŁĄCZNIE bazę danych w tym formacie. Nie dodawaj żadnych słów wstępu, kodu markdown ani podsumowań. Zacznij bezpośrednio od słowa "Name:".`;
    } else {
      const gameModeFormatInfo =
        gameModeVal === 'mcq'
          ? 'O: Option A|Option B|Option C|Option D (four unique options separated by a pipe symbol |, one of which must match the answer exactly)'
          : 'O: (leave empty or omit this line)';
      const gameModeExampleInfo =
        gameModeVal === 'mcq'
          ? 'O: Correct Answer|Incorrect Answer 1|Incorrect Answer 2|Incorrect Answer 3'
          : 'O: ';

      return `You are an expert trivia question creator. Generate a question database in a compact text format for a board game.

CONFIGURATION PARAMETERS:
- Language: English (en)
- Theme: ${theme || 'None (general knowledge)'}
- Difficulty Level: ${difficultyText}
- Game Mode: ${gameModeText}
- Questions per Category: ${qPerCategory} (total of ${totalQuestions} questions across 6 categories)
- Categories (each question must belong to one of these):
  1. ${cats[0]}
  2. ${cats[1]}
  3. ${cats[2]}
  4. ${cats[3]}
  5. ${cats[4]}
  6. ${cats[5]}

OUTPUT FORMAT:
Return the database in the following format. Start with metadata (Name, Lang, Categories) at the very top. Each question must be separated from the next by a separator "---" on a new line.

Metadata at the very top:
Name: ${dbName}
Lang: en
Categories: ${cats.join(', ')}

Format for each question:
C: Category name (must be one of the 6 listed above)
S: Subcategory/specific topic
Q: Question text
${gameModeFormatInfo}
A: Exact text of the correct answer
EC: Short explanation of why the answer is correct
EI: Short explanation of why other options are incorrect (or what could mislead the player)

Example question:
C: ${cats[0]}
S: Ancient Astronomy
Q: What was the first known name of the planet Venus?
${gameModeExampleInfo}
A: Morning Star
EC: Venus is traditionally known as the Morning Star when visible at dawn.
EI: Other planets do not share this dawn appearance name.

Return ONLY the database in this format. Do not add any introductory or concluding text, and do not wrap it in markdown code blocks. Start directly with "Name:".`;
    }
  } else {
    if (lang === 'pl') {
      const gameModeRules =
        gameModeVal === 'mcq'
          ? `- Każde pytanie musi mieć dokładnie 4 unikalne opcje wyboru w tablicy "options".
    - Pole "answer" musi zawierać DOKŁADNY tekst poprawnej odpowiedzi, identyczny z jedną z opcji z tablicy "options".
    - Pytania powinny być ciekawe, zróżnicowane i dostosowane do poziomu: ${difficultyText}.
    - Dla każdego pytania podaj krótkie wyjaśnienie poprawnej odpowiedzi w "explanation_correct" oraz dlaczego pozostałe opcje są błędne w "explanation_incorrect".`
          : `- Pole "options" powinno być pustą tablicą [].
    - Pole "answer" musi zawierać jasną, zwięzłą i poprawną odpowiedź tekstową (np. jedno słowo, nazwisko, data lub krótka fraza).
    - Pytania powinny być jednoznaczne, by gracz mógł na nie odpowiedzieć krótko.
    - Dla każdego pytania podaj wyjaśnienie w "explanation_correct" oraz opcjonalne wskazówki lub najczęstsze błędne skojarzenia w "explanation_incorrect".`;

      return `Jesteś ekspertem od tworzenia gier typu Trivia. Wygeneruj bazę danych pytań w formacie JSON do gry planszowej.

DANE WEJŚCIOWE KONFIGURACJI:
- Język pytań: polski (pl)
- Temat przewodni (motyw): ${theme || 'Brak (wiedza ogólna)'}
- Poziom trudności: ${difficultyText}
- Tryb gry: ${gameModeText}
- Liczba pytań na kategorię: ${qPerCategory} (łącznie ${totalQuestions} pytań dla 6 kategorii)
- Kategorie (musisz przypisać dokładnie taką samą nazwę do pola "category" każdego pytania):
  1. ${cats[0]}
  2. ${cats[1]}
  3. ${cats[2]}
  4. ${cats[3]}
  5. ${cats[4]}
  6. ${cats[5]}

WYMAGANIA DOTYCZĄCE FORMATU PYTAŃ:
${gameModeRules}

Zwróć WYŁĄCZNIE poprawny dokument JSON, bez żadnego dodatkowego tekstu wstępnego czy podsumowania, bez bloków kodu markdown (takich jak \`\`\`json). Całość musi być jednym obiektem JSON o następującej strukturze:

{
  "name": "${dbName}",
  "language": "pl",
  "categories": ["${cats[0]}", "${cats[1]}", "${cats[2]}", "${cats[3]}", "${cats[4]}", "${cats[5]}"],
  "questions": [
    {
      "category": "${cats[0]}",
      "subcategory": "Specyficzny podtemat",
      "question": "Treść pytania...",
      "options": ${gameModeVal === 'mcq' ? '["Poprawna odpowiedź", "Błędna odpowiedź 1", "Błędna odpowiedź 2", "Błędna odpowiedź 3"]' : '[]'},
      "answer": "Poprawna odpowiedź",
      "explanation_correct": "Dlaczego ta odpowiedź jest poprawna...",
      "explanation_incorrect": "Dlaczego inne opcje są błędne lub co mogło zmylić gracza..."
    }
  ]
}`;
    } else {
      const gameModeRules =
        gameModeVal === 'mcq'
          ? `- Each question must have exactly 4 unique options in the "options" array.
    - The "answer" field must contain the EXACT text of the correct answer, identical to one of the options in the "options" array.
    - Questions should be interesting, diverse, and suited to the level: ${difficultyText}.
    - For each question, provide a short explanation of the correct answer in "explanation_correct" and why the other options are wrong in "explanation_incorrect".`
          : `- The "options" field should be an empty array [].
    - The "answer" field must contain a clear, concise, and correct text answer (e.g., one word, name, date, or short phrase).
    - Questions should be unambiguous, so that players can give a short answer.
    - For each question, provide an explanation in "explanation_correct" and optional hints or common misconceptions in "explanation_incorrect".`;

      return `You are an expert trivia question creator. Generate a question database in JSON format for a board game.

CONFIGURATION PARAMETERS:
- Language: English (en)
- Theme: ${theme || 'None (general knowledge)'}
- Difficulty Level: ${difficultyText}
- Game Mode: ${gameModeText}
- Questions per Category: ${qPerCategory} (total of ${totalQuestions} questions across 6 categories)
- Categories (you must assign exactly these names to the "category" field of each question):
  1. ${cats[0]}
  2. ${cats[1]}
  3. ${cats[2]}
  4. ${cats[3]}
  5. ${cats[4]}
  6. ${cats[5]}

QUESTION FORMAT REQUIREMENTS:
${gameModeRules}

Return ONLY a valid JSON document. Do not wrap it in markdown code blocks like \`\`\`json. The response must be a single JSON object with the following structure:

{
  "name": "${dbName}",
  "language": "en",
  "categories": ["${cats[0]}", "${cats[1]}", "${cats[2]}", "${cats[3]}", "${cats[4]}", "${cats[5]}"],
  "questions": [
    {
      "category": "${cats[0]}",
      "subcategory": "Specific subtopic",
      "question": "Question text...",
      "options": ${gameModeVal === 'mcq' ? '["Correct answer", "Incorrect answer 1", "Incorrect answer 2", "Incorrect answer 3"]' : '[]'},
      "answer": "Correct answer",
      "explanation_correct": "Why this answer is correct...",
      "explanation_incorrect": "Why other options are wrong or what could mislead the player..."
    }
  ]
}`;
    }
  }
}

export function setupEventListeners() {
  // --- Database selectors ---
  if (UI.dbPresetSelect) {
    UI.dbPresetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        UI.customDbUploadContainer.classList.remove('hidden');
      } else {
        UI.customDbUploadContainer.classList.add('hidden');
        setState({ databaseUrl: val }, 'state:db-url-changed');
        const api = getApiAdapter();
        if (api) {
          api.saveSettings();
          api.loadDatabase(val);
        }
      }
    });
  }

  if (UI.dbFileUpload) {
    UI.dbFileUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          let data;
          const rawText = evt.target.result;
          data = healAndParseJSON(rawText);
          if (!data.name || !Array.isArray(data.categories) || !Array.isArray(data.questions)) {
            throw new Error('Invalid schema');
          }

          const customCats = data.categories.map((catName, index) => {
            const catId = `custom_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${index}`;
            const catQuestions = data.questions.filter(
              (q) => q.category.toLowerCase().trim() === catName.toLowerCase().trim()
            );
            return {
              id: catId,
              name: catName,
              language: data.language || 'pl',
              description: `Własna kategoria z wgranego pliku: ${data.name}`,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              question_count: catQuestions.length,
              questions: catQuestions,
              is_custom: true,
            };
          });

          if (!gameState.allCategories) gameState.allCategories = [];
          gameState.allCategories = gameState.allCategories.filter((c) => !c.is_custom);
          gameState.allCategories.push(...customCats);

          gameState.selectedCategoryIds = customCats.map((c) => c.id);
          localStorage.setItem(
            'trivia_selected_category_ids',
            JSON.stringify(gameState.selectedCategoryIds)
          );

          import('./ui.js').then((ui) => {
            ui.renderSelectedCategoriesPreview();
          });

          const api = getApiAdapter();
          if (api && api.setCustomDatabase) {
            api.setCustomDatabase(data);
            setState({ databaseUrl: 'custom' }, 'state:db-custom-changed');
            api.saveSettings();
            notify(
              {
                title: gameState.currentLanguage === 'pl' ? 'Baza wczytana!' : 'Database loaded!',
                body:
                  gameState.currentLanguage === 'pl'
                    ? `Pomyślnie wczytano bazę z pliku: ${data.name}`
                    : `Successfully loaded database from file: ${data.name}`,
              },
              'success'
            );
          }
        } catch (err) {
          console.error('Invalid database file format', err);
          notify(
            {
              title: translations.file_error_title[gameState.currentLanguage],
              body:
                gameState.currentLanguage === 'pl'
                  ? 'Niepoprawny format pliku bazy pytań. Upewnij się, że to właściwy plik JSON.'
                  : 'Invalid database file format. Make sure it is a valid JSON file.',
            },
            'error'
          );
        }
      };
      reader.readAsText(file);
    });
  }

  if (UI.dbTextPasteBtn) {
    UI.dbTextPasteBtn.addEventListener('click', () => {
      const rawText = UI.dbTextPaste.value.trim();
      if (!rawText) {
        notify(
          {
            title: gameState.currentLanguage === 'pl' ? 'Pusty tekst' : 'Empty text',
            body:
              gameState.currentLanguage === 'pl'
                ? 'Wklej najpierw tekst bazy pytań (JSON).'
                : 'Please paste the question database text (JSON) first.',
          },
          'error'
        );
        return;
      }
      try {
        let data = healAndParseJSON(rawText);
        if (!data.name || !Array.isArray(data.categories) || !Array.isArray(data.questions)) {
          throw new Error('Invalid schema');
        }

        const customCats = data.categories.map((catName, index) => {
          const catId = `custom_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${index}`;
          const catQuestions = data.questions.filter(
            (q) => q.category.toLowerCase().trim() === catName.toLowerCase().trim()
          );
          return {
            id: catId,
            name: catName,
            language: data.language || 'pl',
            description:
              gameState.currentLanguage === 'pl'
                ? `Wklejona kategoria: ${data.name}`
                : `Pasted category: ${data.name}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            question_count: catQuestions.length,
            questions: catQuestions,
            is_custom: true,
          };
        });

        if (!gameState.allCategories) gameState.allCategories = [];
        gameState.allCategories = gameState.allCategories.filter((c) => !c.is_custom);
        gameState.allCategories.push(...customCats);

        gameState.selectedCategoryIds = customCats.map((c) => c.id);
        localStorage.setItem(
          'trivia_selected_category_ids',
          JSON.stringify(gameState.selectedCategoryIds)
        );

        import('./ui.js').then((ui) => {
          ui.renderSelectedCategoriesPreview();
        });

        const api = getApiAdapter();
        if (api && api.setCustomDatabase) {
          api.setCustomDatabase(data);
          setState({ databaseUrl: 'custom' }, 'state:db-custom-changed');
          api.saveSettings();
          notify(
            {
              title: gameState.currentLanguage === 'pl' ? 'Baza wczytana!' : 'Database loaded!',
              body:
                gameState.currentLanguage === 'pl'
                  ? `Pomyślnie wczytano bazę: ${data.name}`
                  : `Successfully loaded database: ${data.name}`,
            },
            'success'
          );
          UI.dbTextPaste.value = '';
        }
      } catch (err) {
        console.error('Failed to parse pasted database:', err);
        notify(
          {
            title: gameState.currentLanguage === 'pl' ? 'Błąd wczytywania' : 'Loading error',
            body:
              err.message ||
              (gameState.currentLanguage === 'pl'
                ? 'Niepoprawny format. Sprawdź poprawność wklejonego tekstu.'
                : 'Invalid format. Please check the pasted text.'),
          },
          'error'
        );
      }
    });
  }

  // --- Prompt Creator Listener ---
  if (UI.copyPromptBtn) {
    UI.copyPromptBtn.addEventListener('click', () => {
      const categoryInputs = Array.from(
        document.querySelectorAll('#categories-container .category-input')
      ).map((input) => input.value.trim());
      if (categoryInputs.some((c) => c === '')) {
        notify(
          {
            title:
              gameState.currentLanguage === 'pl' ? 'Brakujące kategorie' : 'Missing Categories',
            body:
              gameState.currentLanguage === 'pl'
                ? 'Proszę uzupełnić wszystkie 6 kategorii po prawej stronie.'
                : 'Please fill in all 6 categories on the right side.',
          },
          'error'
        );
        return;
      }

      const promptText = compileAIPrompt();
      navigator.clipboard
        .writeText(promptText)
        .then(() => {
          notify(
            {
              title:
                gameState.currentLanguage === 'pl' ? 'Prompt skopiowany! 📋' : 'Prompt copied! 📋',
              body:
                gameState.currentLanguage === 'pl'
                  ? 'Wklej go do wybranego modelu AI (np. ChatGPT, Gemini).'
                  : 'Paste it into your chosen AI model (e.g. ChatGPT, Gemini).',
            },
            'success'
          );
        })
        .catch((err) => {
          console.error('Clipboard copy failed:', err);
          notify(
            {
              title: gameState.currentLanguage === 'pl' ? 'Błąd kopiowania' : 'Copy error',
              body:
                gameState.currentLanguage === 'pl'
                  ? 'Nie udało się skopiować automatycznie. Spróbuj zaznaczyć i skopiować ręcznie.'
                  : 'Failed to copy automatically. Please try manually copying.',
            },
            'error'
          );
        });
    });
  }

  // Listen to custom database-loaded event to update category textareas
  window.addEventListener('database-loaded', (e) => {
    const db = e.detail;
    if (db && db.categories) {
      updateCategoryInputs(db.categories);
    }
  });

  UI.langPlBtn.addEventListener('click', () => {
    setLanguage('pl');
    if (
      gameState.playMode === 'database' &&
      UI.dbPresetSelect.value === 'databases/general_en.json'
    ) {
      UI.dbPresetSelect.value = 'databases/general_pl.json';
      UI.dbPresetSelect.dispatchEvent(new Event('change'));
    }
  });
  UI.langEnBtn.addEventListener('click', () => {
    setLanguage('en');
    if (
      gameState.playMode === 'database' &&
      UI.dbPresetSelect.value === 'databases/general_pl.json'
    ) {
      UI.dbPresetSelect.value = 'databases/general_en.json';
      UI.dbPresetSelect.dispatchEvent(new Event('change'));
    }
  });

  UI.gameModeSelect.addEventListener('change', updateDescriptions);
  UI.knowledgeLevelSelect.addEventListener('change', updateDescriptions);

  // --- Clear Cache (In-Game Menu) ---
  if (UI.clearCacheBtn) {
    UI.clearCacheBtn.addEventListener('click', async () => {
      const originalHTML = UI.clearCacheBtn.innerHTML;
      UI.clearCacheBtn.disabled = true;
      UI.clearCacheBtn.textContent =
        gameState.currentLanguage === 'pl' ? 'Czyszczenie...' : 'Clearing...';
      try {
        setState({ askedQuestions: [] }, 'state:clear-cache');
        localStorage.removeItem('trivia_asked_questions');

        notify(
          {
            title: gameState.currentLanguage === 'pl' ? 'Cache wyczyszczony' : 'Cache cleared',
            body:
              gameState.currentLanguage === 'pl'
                ? 'Pomyślnie wyczyszczono historię zadanych pytań.'
                : 'Successfully cleared asked questions history.',
          },
          'success'
        );
      } catch (err) {
        console.error(err);
        notify(
          {
            title: translations.error_title[gameState.currentLanguage],
            body:
              gameState.currentLanguage === 'pl'
                ? 'Nie udało się wyczyścić cache.'
                : 'Failed to clear cache.',
          },
          'error'
        );
      } finally {
        UI.clearCacheBtn.disabled = false;
        UI.clearCacheBtn.innerHTML = originalHTML;
      }
    });
  }

  if (UI.includeThemeToggle) {
    UI.includeThemeToggle.addEventListener('change', () => {
      const api = getApiAdapter();
      if (api && api.saveSettings) api.saveSettings();
    });
  }
  if (UI.mutateCategoriesToggle) {
    UI.mutateCategoriesToggle.addEventListener('change', () => {
      const api = getApiAdapter();
      if (api && api.saveSettings) api.saveSettings();
    });
  }

  UI.regenerateQuestionBtn.addEventListener('click', () =>
    askQuestion(gameState.currentForcedCategoryIndex)
  );
  UI.popupRegenerateBtn.addEventListener('click', () => {
    UI.answerPopup.classList.add('opacity-0', 'scale-90');
    setTimeout(() => UI.answerPopup.classList.add('hidden'), 500);
    askQuestion(gameState.currentForcedCategoryIndex);
  });

  UI.playerCountInput.addEventListener('input', () => {
    updatePlayerNameInputs();
    if (UI.qPerCategoryInput) {
      const playerCount = parseInt(UI.playerCountInput.value) || 2;
      UI.qPerCategoryInput.value = playerCount * 20;
    }
  });

  const setFilterActive = (activeBtn) => {
    [UI.catFilterAll, UI.catFilterPl, UI.catFilterEn].forEach((btn) => {
      if (btn) btn.classList.remove('active', 'bg-gray-200', 'dark:bg-gray-800');
    });
    if (activeBtn) {
      activeBtn.classList.add('active', 'bg-gray-200', 'dark:bg-gray-800');
    }
  };

  // --- Category Selection Modal Events ---
  if (UI.openCategorySelectorBtn) {
    UI.openCategorySelectorBtn.addEventListener('click', () => {
      gameState.tempSelectedCategoryIds = [...(gameState.selectedCategoryIds || [])];
      if (UI.categorySearch) UI.categorySearch.value = '';

      const currentLang = gameState.currentLanguage || 'pl';
      const defaultFilterBtn = currentLang === 'pl' ? UI.catFilterPl : UI.catFilterEn;
      setFilterActive(defaultFilterBtn);

      import('./ui.js').then((ui) => {
        ui.renderCategorySelectionGrid('', currentLang);
        UI.categorySelectionModal.classList.remove('hidden');
      });
    });
  }

  if (UI.closeCategorySelectionBtn) {
    UI.closeCategorySelectionBtn.addEventListener('click', () => {
      UI.categorySelectionModal.classList.add('hidden');
    });
  }

  if (UI.btnCancelCategorySelection) {
    UI.btnCancelCategorySelection.addEventListener('click', () => {
      UI.categorySelectionModal.classList.add('hidden');
    });
  }

  if (UI.categorySearch) {
    UI.categorySearch.addEventListener('input', (e) => {
      const query = e.target.value;
      const activeTab = document.querySelector('#category-selection-modal button.active');
      const lang =
        activeTab && activeTab.id === 'cat-filter-pl'
          ? 'pl'
          : activeTab && activeTab.id === 'cat-filter-en'
            ? 'en'
            : 'all';
      import('./ui.js').then((ui) => {
        ui.renderCategorySelectionGrid(query, lang);
      });
    });
  }

  if (UI.catFilterAll) {
    UI.catFilterAll.addEventListener('click', () => {
      setFilterActive(UI.catFilterAll);
      const query = UI.categorySearch.value;
      import('./ui.js').then((ui) => {
        ui.renderCategorySelectionGrid(query, 'all');
      });
    });
  }

  if (UI.catFilterPl) {
    UI.catFilterPl.addEventListener('click', () => {
      setFilterActive(UI.catFilterPl);
      const query = UI.categorySearch.value;
      import('./ui.js').then((ui) => {
        ui.renderCategorySelectionGrid(query, 'pl');
      });
    });
  }

  if (UI.catFilterEn) {
    UI.catFilterEn.addEventListener('click', () => {
      setFilterActive(UI.catFilterEn);
      const query = UI.categorySearch.value;
      import('./ui.js').then((ui) => {
        ui.renderCategorySelectionGrid(query, 'en');
      });
    });
  }

  if (UI.btnRandomSelect6) {
    UI.btnRandomSelect6.addEventListener('click', () => {
      import('./ui.js').then((ui) => ui.applyRandomCategorySelection());
    });
  }

  if (UI.btnApplyCategorySelection) {
    UI.btnApplyCategorySelection.addEventListener('click', () => {
      gameState.selectedCategoryIds = [...(gameState.tempSelectedCategoryIds || [])];
      localStorage.setItem(
        'trivia_selected_category_ids',
        JSON.stringify(gameState.selectedCategoryIds)
      );
      UI.categorySelectionModal.classList.add('hidden');

      import('./ui.js').then((ui) => {
        ui.renderSelectedCategoriesPreview();
      });

      const api = getApiAdapter();
      if (api && gameState.playMode === 'database') {
        api.loadDatabase('categories');
      }
    });
  }

  UI.startGameBtn.addEventListener('click', initializeGame);
  UI.diceElement.addEventListener('click', rollDice);
  UI.submitAnswerBtn.addEventListener('click', handleOpenAnswer);
  UI.answerInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') handleOpenAnswer();
  });
  UI.acceptAnswerBtn.addEventListener('click', () => handleManualVerification(true));
  UI.rejectAnswerBtn.addEventListener('click', () => handleManualVerification(false));
  UI.verifyAnswerBtn.addEventListener('click', verifyIncorrectAnswer);
  UI.closePopupBtn.addEventListener('click', closePopupAndContinue);
  UI.closeHistoryBtn.addEventListener('click', hideHistoryModal);
  UI.restartGameBtn.addEventListener('click', restartGame);
  UI.downloadStateBtn.addEventListener('click', downloadGameState);
  UI.uploadStateInput.addEventListener('change', handleStateUpload);
  UI.closeSuggestionModalBtn.addEventListener('click', () => {
    UI.suggestionModal.classList.remove('visible');
  });

  UI.playAgainBtn.addEventListener('click', () => {
    UI.winnerScreen.classList.add('hidden');
    UI.setupScreen.classList.remove('hidden');
    if (UI.generatorLinkBtn) UI.generatorLinkBtn.classList.remove('hidden');
    const oldSvg = UI.boardWrapper.querySelector('.board-connections');
    if (oldSvg) oldSvg.remove();
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.emoji-panel.active').forEach((panel) => {
      if (!panel.parentElement.contains(e.target)) {
        panel.classList.remove('active');
      }
    });
  });

  setupGameMenu();
}

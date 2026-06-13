/**
 * @file ui-setup.js
 * Setup screen helpers (language, categories, players, presets).
 */

import { CONFIG, translations, CATEGORY_PRESETS } from './config.js';
import { gameState, setState } from './state.js';
import { UI } from './dom.js';
import { uiHandlers } from './ui-handlers.js';
import { notify } from './error-bus.js';

/**
 * Automatically adjusts the height of a textarea to fit its content.
 * Uses modern CSS field-sizing: content with JS fallback.
 * @param {HTMLTextAreaElement} textarea - The textarea element to resize.
 */
export function autoResizeTextarea(textarea) {
  if ('fieldSizingMode' in textarea.style) {
    textarea.style.fieldSizing = 'content';
    textarea.style.height = 'auto';
  } else {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}

/**
 * Dynamically scans the databases directory (or lists from list.json) and populates the database select selector.
 */
export async function populateDatabaseSelector() {
  const select = UI.dbPresetSelect;
  if (!select) return;

  const lang = gameState.currentLanguage || 'pl';
  let dbList = [];

  // 1. Try to fetch list.json
  try {
    const res = await fetch('databases/list.json');
    if (res.ok) {
      dbList = await res.json();
      console.log('ui-setup.js: Loaded database list from list.json:', dbList);
    }
  } catch (e) {
    console.warn('ui-setup.js: Could not load list.json, trying directory parse...', e);
  }

  // 2. If list.json failed or is empty, try parsing the directory listing of databases/
  if (dbList.length === 0) {
    try {
      const res = await fetch('databases/');
      if (res.ok) {
        const text = await res.text();
        // Parse links ending in .json
        const regex = /href="([^"?#]+\.json)"/g;
        let match;
        const files = new Set();
        while ((match = regex.exec(text)) !== null) {
          const parts = match[1].split('/');
          const filename = parts[parts.length - 1];
          if (filename && filename !== 'list.json') {
            files.add(filename);
          }
        }

        dbList = Array.from(files).map((file) => {
          let displayName = file.replace('.json', '');
          displayName = displayName.replace(/_/g, ' ');
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
          return {
            path: `databases/${file}`,
            name: displayName,
          };
        });
        console.log('ui-setup.js: Scanned databases from directory listing:', dbList);
      }
    } catch (e) {
      console.warn('ui-setup.js: Could not scan databases directory listing:', e);
    }
  }

  // 3. Fallback to hardcoded presets if both methods failed
  if (dbList.length === 0) {
    dbList = [
      {
        path: 'databases/general_pl.json',
        name: lang === 'pl' ? 'Wiedza Ogólna (PL) - Klasyk' : 'General Knowledge (PL) - Classic',
      },
      {
        path: 'databases/general_en.json',
        name: lang === 'pl' ? 'Wiedza Ogólna (EN) - Classic' : 'General Knowledge (EN) - Classic',
      },
    ];
    console.log('ui-setup.js: Using fallback hardcoded databases:', dbList);
  }

  // Populate selector dropdown
  select.innerHTML = '';
  dbList.forEach((db) => {
    const option = document.createElement('option');
    option.value = db.path;
    option.textContent = db.name;
    select.appendChild(option);
  });

  // Add custom uploader option
  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent =
    lang === 'pl' ? '-- Wczytaj własny plik .json --' : '-- Load custom .json file --';
  select.appendChild(customOption);

  // Set value to current database Url
  if (gameState.databaseUrl) {
    select.value = gameState.databaseUrl;
  }
}

/**
 * Sets the UI language and updates all translatable text elements.
 * @param {string} lang - The language code ('pl' or 'en').
 */
export function setLanguage(lang) {
  if (lang !== 'pl' && lang !== 'en') {
    lang = 'pl';
  }
  setState({ currentLanguage: lang }, 'language:update');
  document.documentElement.lang = lang;
  UI.langPlBtn.classList.toggle('active', lang === 'pl');
  UI.langEnBtn.classList.toggle('active', lang === 'en');

  document.querySelectorAll('[data-lang-key]').forEach((el) => {
    const key = el.dataset.langKey;
    if (translations[key] && translations[key][lang]) {
      const translation = translations[key][lang];
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder) el.placeholder = translation;
      } else if (el.title && !el.textContent.trim()) {
        el.title = translation;
      } else {
        el.innerHTML = translation;
      }
    }
  });

  document.querySelectorAll('[data-lang-key][title]').forEach((el) => {
    const key = el.dataset.langKey;
    if (translations[key] && translations[key][lang]) {
      el.title = translations[key][lang];
    }
  });

  document.querySelectorAll('[data-title-lang-key]').forEach((el) => {
    const key = el.dataset.titleLangKey;
    if (translations[key] && translations[key][lang]) {
      el.title = translations[key][lang];
    }
  });

  if (UI.suggestionModalTitle) {
    UI.suggestionModalTitle.textContent = translations.suggestion_modal_title[lang];
  }
  loadAllCategories();
  updatePlayerNameInputs();
  updateDescriptions();
  populateDatabaseSelector();
}

/**
 * Updates the descriptive text below the game mode and knowledge level selectors.
 */
export function updateDescriptions() {
  const lang = gameState.currentLanguage;
  UI.gameModeDescription.textContent =
    translations[`game_mode_desc_${UI.gameModeSelect.value}`][lang];
  UI.knowledgeLevelDescription.textContent =
    translations[`knowledge_desc_${UI.knowledgeLevelSelect.value}`][lang];
}

/**
 * Populates the category name input fields using auto-sizing textareas.
 * @param {string[]} cats - An array of category names.
 */
export function updateCategoryInputs(cats) {
  if (!UI.categoriesContainer) return;
  UI.categoriesContainer.innerHTML = '';
  const isDbMode = gameState.playMode === 'database';
  for (let i = 0; i < 6; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'relative';

    const textarea = document.createElement('textarea');
    textarea.className =
      'category-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm';
    textarea.value = cats[i] || '';
    textarea.style.borderLeft = `5px solid ${CONFIG.CATEGORY_COLORS[i]}`;
    textarea.rows = 1;
    if (isDbMode) {
      textarea.readOnly = true;
      textarea.style.pointerEvents = 'none';
      textarea.style.backgroundColor = 'rgba(243, 244, 246, 0.1)';
      textarea.style.opacity = '0.7';
    } else {
      textarea.addEventListener('input', () => autoResizeTextarea(textarea));
    }

    wrapper.appendChild(textarea);

    UI.categoriesContainer.appendChild(wrapper);

    autoResizeTextarea(textarea);
  }
}

/**
 * Generates the input fields for player names and emoji pickers based on the selected player count.
 */
export function updatePlayerNameInputs() {
  const count = parseInt(UI.playerCountInput.value);
  UI.playerNamesContainer.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.className = 'player-entry flex gap-2 items-center';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className =
      'player-name-input flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm';
    nameInput.placeholder = translations.player_name_placeholder[gameState.currentLanguage].replace(
      '{i}',
      i + 1
    );

    const emojiPickerDiv = document.createElement('div');
    emojiPickerDiv.className = 'emoji-picker';
    const emojiButton = document.createElement('button');
    emojiButton.className = 'emoji-button';
    emojiButton.textContent = CONFIG.EMOJI_OPTIONS[i % CONFIG.EMOJI_OPTIONS.length];
    const emojiPanel = document.createElement('div');
    emojiPanel.className = 'emoji-panel';

    CONFIG.EMOJI_OPTIONS.forEach((emoji) => {
      const option = document.createElement('span');
      option.className = 'emoji-option';
      option.textContent = emoji;
      option.onclick = () => {
        emojiButton.textContent = emoji;
        emojiPanel.classList.remove('active');
      };
      emojiPanel.appendChild(option);
    });

    emojiButton.onclick = (e) => {
      e.preventDefault();
      emojiPanel.classList.toggle('active');
    };

    emojiPickerDiv.appendChild(emojiButton);
    emojiPickerDiv.appendChild(emojiPanel);

    div.appendChild(nameInput);
    div.appendChild(emojiPickerDiv);
    UI.playerNamesContainer.appendChild(div);
  }
}

/**
 * Loads all category metadata from databases/list.json into state.
 */
export async function loadAllCategories() {
  try {
    const res = await fetch('databases/list.json');
    if (res.ok) {
      const data = await res.json();
      gameState.allCategories = data;

      // Try to load saved selection
      const saved = localStorage.getItem('trivia_selected_category_ids');
      if (saved) {
        gameState.selectedCategoryIds = JSON.parse(saved);
      }

      // Filter out any IDs that no longer exist
      if (gameState.selectedCategoryIds) {
        gameState.selectedCategoryIds = gameState.selectedCategoryIds.filter((id) =>
          gameState.allCategories.some((c) => c.id === id)
        );
      }

      if (!gameState.selectedCategoryIds) {
        gameState.selectedCategoryIds = [];
      }

      renderSelectedCategoriesPreview();
    }
  } catch (e) {
    console.error('Failed to load category metadata:', e);
  }
}

/**
 * Renders the chosen categories on the setup screen.
 */
export function renderSelectedCategoriesPreview() {
  if (!UI.selectedCategoriesPreview) return;
  UI.selectedCategoriesPreview.innerHTML = '';

  if (!gameState.selectedCategoryIds || gameState.selectedCategoryIds.length === 0) {
    const noSel = document.createElement('div');
    noSel.className = 'col-span-full text-center text-gray-500 py-2';
    noSel.textContent =
      gameState.currentLanguage === 'pl'
        ? 'Nie wybrano żadnej kategorii.'
        : 'No categories selected.';
    UI.selectedCategoriesPreview.appendChild(noSel);
    return;
  }

  gameState.selectedCategoryIds.forEach((id, index) => {
    const cat = gameState.allCategories?.find((c) => c.id === id);
    if (!cat) return;

    const badge = document.createElement('div');
    badge.className =
      'px-2.5 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 shadow-sm';
    badge.style.borderLeft = `4px solid ${CONFIG.CATEGORY_COLORS[index]}`;
    badge.style.borderColor = 'rgba(226, 232, 240, 0.8)';
    badge.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';

    if (
      document.documentElement.classList.contains('dark') ||
      document.documentElement.classList.contains('oled')
    ) {
      badge.style.borderColor = 'rgba(55, 65, 81, 0.8)';
      badge.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
    }

    const langFlag = cat.language === 'pl' ? '🇵🇱' : '🇬🇧';
    badge.innerHTML = `
            <span class="text-[10px]">${langFlag}</span>
            <span class="text-gray-800 dark:text-gray-200">${cat.name}</span>
        `;
    UI.selectedCategoriesPreview.appendChild(badge);
  });

  const selectedCats = gameState.selectedCategoryIds.map((id) => {
    const cat = gameState.allCategories?.find((c) => c.id === id);
    return cat ? cat.name : '';
  });
  updateCategoryInputs(selectedCats);
  validateStep3NextButton();
}

/**
 * Renders the category selection cards in the modal grid.
 */
export function renderCategorySelectionGrid(searchText = '', langFilter = 'all') {
  if (!UI.categorySelectionGrid || !gameState.allCategories) return;
  UI.categorySelectionGrid.innerHTML = '';

  const lang = gameState.currentLanguage || 'pl';
  const questionsText = translations.category_questions
    ? translations.category_questions[lang]
    : lang === 'pl'
      ? 'Pytania'
      : 'Questions';
  const selectedText = translations.category_selected
    ? translations.category_selected[lang]
    : lang === 'pl'
      ? 'Wybrana'
      : 'Selected';

  const query = searchText.toLowerCase().trim();
  const filtered = gameState.allCategories.filter((cat) => {
    const matchQuery =
      cat.name.toLowerCase().includes(query) ||
      (cat.description && cat.description.toLowerCase().includes(query));
    const matchLang = langFilter === 'all' || cat.language === langFilter;
    return matchQuery && matchLang;
  });

  if (filtered.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'col-span-full text-center text-gray-500 py-8';
    noResults.textContent =
      gameState.currentLanguage === 'pl'
        ? 'Brak kategorii pasujących do kryteriów.'
        : 'No categories match the criteria.';
    UI.categorySelectionGrid.appendChild(noResults);
    return;
  }

  filtered.forEach((cat) => {
    const isSelected = gameState.tempSelectedCategoryIds.includes(cat.id);
    const card = document.createElement('div');
    card.className = `category-card ${isSelected ? 'selected' : ''}`;
    card.setAttribute('data-id', cat.id);

    const langFlag = cat.language === 'pl' ? '🇵🇱 PL' : '🇬🇧 EN';
    const dateFormatted = cat.updated_at ? new Date(cat.updated_at).toLocaleDateString() : '';

    card.innerHTML = `
            <div class="check-badge">✓</div>
            <div>
                <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">${langFlag}</span>
                    <span class="text-[10px] text-gray-400">${dateFormatted}</span>
                </div>
                <h4 class="text-sm font-bold text-gray-900 dark:text-white mb-1">${cat.name}</h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">${cat.description || ''}</p>
            </div>
            <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-3 flex items-center justify-between">
                <span>${questionsText}: ${cat.question_count}</span>
                ${isSelected ? `<span>${selectedText}</span>` : ''}
            </div>
        `;

    card.addEventListener('click', () => {
      toggleCategorySelection(cat.id);
    });

    UI.categorySelectionGrid.appendChild(card);
  });

  updateSelectionCounter();
}

/**
 * Toggles the selected state of a category in the temporary array.
 */
export function toggleCategorySelection(catId) {
  if (!gameState.tempSelectedCategoryIds) {
    gameState.tempSelectedCategoryIds = [];
  }
  const idx = gameState.tempSelectedCategoryIds.indexOf(catId);
  if (idx > -1) {
    gameState.tempSelectedCategoryIds.splice(idx, 1);
  } else {
    if (gameState.tempSelectedCategoryIds.length >= 6) {
      notify(
        {
          title:
            gameState.currentLanguage === 'pl' ? 'Maksimum 6 kategorii' : 'Maximum 6 categories',
          body:
            gameState.currentLanguage === 'pl'
              ? 'Możesz wybrać maksymalnie 6 kategorii do gry.'
              : 'You can select a maximum of 6 categories for the game.',
        },
        'error'
      );
      return;
    }
    gameState.tempSelectedCategoryIds.push(catId);
  }

  const query = UI.categorySearch.value;
  const activeTab = document.querySelector('#category-selection-modal button.active');
  const lang =
    activeTab && activeTab.id === 'cat-filter-pl'
      ? 'pl'
      : activeTab && activeTab.id === 'cat-filter-en'
        ? 'en'
        : 'all';
  renderCategorySelectionGrid(query, lang);
}

/**
 * Updates the category selection count in the modal.
 */
export function updateSelectionCounter() {
  if (!gameState.tempSelectedCategoryIds) {
    gameState.tempSelectedCategoryIds = [];
  }
  const count = gameState.tempSelectedCategoryIds.length;
  if (UI.categorySelectionCounter) {
    UI.categorySelectionCounter.textContent =
      gameState.currentLanguage === 'pl' ? `Wybrano: ${count} / 6` : `Selected: ${count} / 6`;
  }
  if (UI.btnApplyCategorySelection) {
    UI.btnApplyCategorySelection.disabled = count !== 6;
    if (count === 6) {
      UI.btnApplyCategorySelection.classList.remove(
        'bg-indigo-600',
        'hover:bg-indigo-700',
        'active:bg-indigo-850'
      );
      UI.btnApplyCategorySelection.classList.add(
        'bg-green-600',
        'hover:bg-green-700',
        'active:bg-green-800'
      );
    } else {
      UI.btnApplyCategorySelection.classList.remove(
        'bg-green-600',
        'hover:bg-green-700',
        'active:bg-green-800'
      );
      UI.btnApplyCategorySelection.classList.add(
        'bg-indigo-600',
        'hover:bg-indigo-700',
        'active:bg-indigo-850'
      );
    }
  }
}

/**
 * Selects 6 categories corresponding to a preset database.
 */
export function applyCategorySelectionPreset(presetName) {
  let ids = [];
  if (presetName === 'classic_pl') {
    ids = [
      'historia_pl',
      'geografia_pl',
      'nauka_pl',
      'kultura_i_sztuka_pl',
      'sport_pl',
      'media_i_rozrywka_pl',
    ];
  } else if (presetName === 'pop_pl') {
    ids = [
      'gry_wideo_pl',
      'kino_i_tv_pl',
      'muzyka_pl',
      'internet_i_memy_pl',
      'ksiazki_i_komiksy_pl',
      'gry_planszowe_i_rpg_pl',
    ];
  } else if (presetName === 'classic_en') {
    ids = [
      'history_en',
      'geography_en',
      'science_en',
      'culture_art_en',
      'sports_en',
      'media_entertainment_en',
    ];
  }

  gameState.tempSelectedCategoryIds = ids.filter((id) =>
    gameState.allCategories.some((c) => c.id === id)
  );

  const query = UI.categorySearch.value;
  const activeTab = document.querySelector('#category-selection-modal button.active');
  const lang =
    activeTab && activeTab.id === 'cat-filter-pl'
      ? 'pl'
      : activeTab && activeTab.id === 'cat-filter-en'
        ? 'en'
        : 'all';
  renderCategorySelectionGrid(query, lang);

  notify(
    {
      title: gameState.currentLanguage === 'pl' ? 'Wczytano zestaw' : 'Preset loaded',
      body:
        gameState.currentLanguage === 'pl'
          ? 'Wybrano 6 kategorii z zestawu.'
          : 'Selected 6 categories from the preset.',
    },
    'success'
  );
}

/**
 * Randomly selects 6 categories matching the current filter.
 */
export function applyRandomCategorySelection() {
  const activeTab = document.querySelector('#category-selection-modal button.active');
  let lang = gameState.currentLanguage || 'pl';
  if (
    UI.categorySelectionModal &&
    !UI.categorySelectionModal.classList.contains('hidden') &&
    activeTab
  ) {
    lang =
      activeTab.id === 'cat-filter-pl' ? 'pl' : activeTab.id === 'cat-filter-en' ? 'en' : 'all';
  }

  const pool = gameState.allCategories.filter((c) => lang === 'all' || c.language === lang);
  if (pool.length < 6) {
    notify(
      {
        title: gameState.currentLanguage === 'pl' ? 'Za mało kategorii' : 'Not enough categories',
        body:
          gameState.currentLanguage === 'pl'
            ? 'Brak wystarczającej liczby kategorii w tym języku.'
            : 'Not enough categories available for this language.',
      },
      'error'
    );
    return;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selectedIds = shuffled.slice(0, 6).map((c) => c.id);

  if (UI.categorySelectionModal && !UI.categorySelectionModal.classList.contains('hidden')) {
    gameState.tempSelectedCategoryIds = selectedIds;
    const query = UI.categorySearch.value;
    renderCategorySelectionGrid(query, lang);
  } else {
    gameState.selectedCategoryIds = selectedIds;
    localStorage.setItem(
      'trivia_selected_category_ids',
      JSON.stringify(gameState.selectedCategoryIds)
    );
    renderSelectedCategoriesPreview();

    import('./services/api-service.js').then(({ getApiAdapter }) => {
      const apiAdapter = getApiAdapter();
      if (apiAdapter && gameState.playMode === 'database') {
        apiAdapter.loadDatabase('categories');
      }
    });
  }
}

export let currentWizardStep = 1;

/**
 * Navigates to a specific setup wizard step.
 * @param {number} step - The step index (1-4).
 */
export function goToWizardStep(step) {
  if (step < 1 || step > 4) return;
  currentWizardStep = step;

  // 1. Hide all step contents and show the active one
  document.querySelectorAll('.wizard-step-content').forEach((el, index) => {
    if (index + 1 === step) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  // 2. Update step indicators
  document.querySelectorAll('.step-indicator').forEach((el) => {
    const s = parseInt(el.dataset.step);
    const circle = el.querySelector('div');
    const label = el.querySelector('span');
    if (!circle || !label) return;

    if (s < step) {
      // Completed step
      circle.className =
        'w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm transition-colors duration-300 shadow-md';
      circle.innerHTML = '✓';
      label.className = 'text-xs font-semibold text-green-600 dark:text-green-400';
    } else if (s === step) {
      // Active step
      circle.className =
        'w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm transition-colors duration-300 shadow-md ring-2 ring-indigo-400 dark:ring-indigo-500 ring-offset-2 dark:ring-offset-gray-900';
      circle.innerHTML = s;
      label.className = 'text-xs font-bold text-indigo-600 dark:text-indigo-400';
    } else {
      // Future step
      circle.className =
        'w-8 h-8 rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center font-semibold text-sm transition-colors duration-300';
      circle.innerHTML = s;
      label.className = 'text-xs font-medium text-gray-500 dark:text-gray-400';
    }
  });

  // 3. Update progress fill bar
  const fillWidth = ((step - 1) / 3) * 100;
  const progressFill = document.getElementById('wizard-progress-fill');
  if (progressFill) {
    progressFill.style.width = `${fillWidth}%`;
  }

  // 4. Update navigation buttons
  const backBtn = document.getElementById('wizard-back-btn');
  const nextBtn = document.getElementById('wizard-next-btn');
  const startBtn = document.getElementById('start-game-btn');

  if (step === 1) {
    if (backBtn) backBtn.classList.add('invisible');
  } else {
    if (backBtn) backBtn.classList.remove('invisible');
  }

  if (step === 4) {
    if (nextBtn) nextBtn.classList.add('hidden');
    if (startBtn) startBtn.classList.remove('hidden');
  } else {
    if (nextBtn) nextBtn.classList.remove('hidden');
    if (startBtn) startBtn.classList.add('hidden');
  }

  // 5. Validation specific to step 3
  if (step === 3) {
    validateStep3NextButton();
  } else {
    if (nextBtn) {
      nextBtn.removeAttribute('disabled');
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }
}

/**
 * Validates step 3 (Categories) and disables/enables the next button.
 */
export function validateStep3NextButton() {
  const count = gameState.selectedCategoryIds ? gameState.selectedCategoryIds.length : 0;

  // Update step 3 count badge in real-time
  const countBadge = document.getElementById('wizard-category-count');
  if (countBadge) {
    countBadge.textContent = `${count} / 6`;
    if (count === 6) {
      countBadge.className =
        'text-xs font-bold text-green-600 dark:text-green-455 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-md';
    } else {
      countBadge.className =
        'text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md';
    }
  }

  const nextBtn = document.getElementById('wizard-next-btn');
  if (nextBtn) {
    if (count === 6) {
      nextBtn.removeAttribute('disabled');
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    } else {
      nextBtn.setAttribute('disabled', 'true');
      nextBtn.style.opacity = '0.5';
      nextBtn.style.cursor = 'not-allowed';
    }
  }
}

/**
 * Clears the temporary selection inside the categories modal.
 */
export function clearCategorySelection() {
  gameState.tempSelectedCategoryIds = [];
  const query = UI.categorySearch ? UI.categorySearch.value : '';
  const activeTab = document.querySelector('#category-selection-modal button.active');
  const lang =
    activeTab && activeTab.id === 'cat-filter-pl'
      ? 'pl'
      : activeTab && activeTab.id === 'cat-filter-en'
        ? 'en'
        : 'all';
  renderCategorySelectionGrid(query, lang);
}

/**
 * Clears the applied category selection and updates the wizard preview.
 */
export function clearAllCategories() {
  gameState.selectedCategoryIds = [];
  gameState.tempSelectedCategoryIds = [];
  localStorage.setItem(
    'trivia_selected_category_ids',
    JSON.stringify(gameState.selectedCategoryIds)
  );
  renderSelectedCategoriesPreview();

  import('./services/api-service.js').then(({ getApiAdapter }) => {
    const apiAdapter = getApiAdapter();
    if (apiAdapter && gameState.playMode === 'database') {
      apiAdapter.loadDatabase('categories');
    }
  });
}

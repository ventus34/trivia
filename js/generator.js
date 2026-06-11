/* global JSZip */
/**
 * @file generator.js
 * Posiada pełny system CMS: generowanie, importowanie z dołączaniem do kolekcji, edycję (Modal) i filtrowanie.
 */

import { healAndParseJSON } from './trivia/utils.js';
import { translations } from './trivia/config.js';

let promptsConfig = null;
let generatedQuestions = []; // Główny stan aplikacji (baza pytań w pamięci)
let abortGenController = null;
let isGenerating = false;
let currentEditId = null; // Przechowuje ID obecnie edytowanego pytania w Modalu
let activeSpoilers = []; // Obecnie wykryte spoilery
let currentLanguage = localStorage.getItem('trivia_lang') || 'pl';

function updateApiKeyUI(prov) {
  if (!UI.apiKey) return;
  const needsKey = PROVIDERS[prov].needsKey;
  UI.apiKey.disabled = !needsKey;
  if (!needsKey) {
    UI.apiKey.value = '';
    UI.apiKey.placeholder =
      currentLanguage === 'pl' ? 'Klucz nie jest wymagany' : 'API key not required';
    UI.apiKey.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    UI.apiKey.placeholder = 'sk-...';
    UI.apiKey.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

function setLanguage(lang) {
  if (lang !== 'pl' && lang !== 'en') {
    lang = 'pl';
  }
  currentLanguage = lang;
  localStorage.setItem('trivia_lang', lang);
  document.documentElement.lang = lang;

  const langPlBtn = document.getElementById('lang-pl');
  const langEnBtn = document.getElementById('lang-en');
  if (langPlBtn && langEnBtn) {
    if (lang === 'pl') {
      langPlBtn.classList.add('bg-slate-800', 'text-white');
      langPlBtn.classList.remove('bg-slate-850', 'text-gray-400');
      langEnBtn.classList.add('bg-slate-850', 'text-gray-400');
      langEnBtn.classList.remove('bg-slate-800', 'text-white');
    } else {
      langEnBtn.classList.add('bg-slate-800', 'text-white');
      langEnBtn.classList.remove('bg-slate-850', 'text-gray-400');
      langPlBtn.classList.add('bg-slate-850', 'text-gray-400');
      langPlBtn.classList.remove('bg-slate-800', 'text-white');
    }
  }

  if (UI.provider) {
    updateApiKeyUI(UI.provider.value);
  }

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
}

const PROVIDERS = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1',
    needsKey: true,
    defaultModel: 'google/gemini-2.5-flash',
  },
  openai: { url: 'https://api.openai.com/v1', needsKey: true, defaultModel: 'gpt-4o-mini' },
  lm_studio: { url: 'http://localhost:1234/v1', needsKey: false, defaultModel: '' },
  ollama: { url: 'http://localhost:11434/v1', needsKey: false, defaultModel: '' },
};

// --- DOM References ---
const UI = {
  provider: document.getElementById('gen-provider'),
  apiKey: document.getElementById('gen-api-key'),
  modelSelectBp: document.getElementById('gen-model-select-bp'),
  modelSelectQ: document.getElementById('gen-model-select-q'),
  fetchModelsBtn: document.getElementById('gen-fetch-models'),
  apiUrl: document.getElementById('gen-api-url'),
  dbLang: document.getElementById('db-lang'),
  qPerCategory: document.getElementById('questions-per-category'),
  difficulty: document.getElementById('gen-difficulty'),
  theme: document.getElementById('gen-theme'),
  openCatDirBtn: document.getElementById('open-cat-dir-btn'),
  catDirList: document.getElementById('cat-dir-list'),
  categoriesList: document.getElementById('categories-inputs-list'),
  addCatBtn: document.getElementById('add-cat-btn'),
  clearCatsBtn: document.getElementById('clear-cats-btn'),
  importCatBtn: document.getElementById('import-cat-btn'),
  importCatFile: document.getElementById('import-cat-file'),
  startBtn: document.getElementById('start-gen-btn'),
  stopBtn: document.getElementById('stop-gen-btn'),
  progressPanel: document.getElementById('progress-panel'),
  progressBar: document.getElementById('progress-bar'),
  progressPct: document.getElementById('progress-percentage'),
  progressCounts: document.getElementById('progress-counts'),
  taskStatus: document.getElementById('current-task-status'),
  logs: document.getElementById('gen-logs'),
  reviewPanel: document.getElementById('review-panel'),
  tableBody: document.getElementById('questions-table-body'),
  totalGenCount: document.getElementById('total-gen-count'),
  exportAllBtn: document.getElementById('export-all-btn'),
  saveAllDirBtn: document.getElementById('save-all-dir-btn'),
  categoryDownloadsGrid: document.getElementById('category-downloads-grid'),
  notification: document.getElementById('gen-notification'),
  notificationText: document.getElementById('gen-notification-text'),

  // Batch slider
  batchSize: document.getElementById('batch-size'),
  batchSizeValue: document.getElementById('batch-size-value'),

  // Toolbar
  searchInput: document.getElementById('search-q'),
  filterCat: document.getElementById('filter-cat'),
  filterLang: document.getElementById('filter-lang'),
  addManualQBtn: document.getElementById('add-manual-q-btn'),

  // Modal
  modalOverlay: document.getElementById('q-modal'),
  modalContent: document.getElementById('q-modal-content'),
  modalTitle: document.getElementById('q-modal-title'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  cancelModalBtn: document.getElementById('cancel-modal-btn'),
  saveModalBtn: document.getElementById('save-modal-btn'),

  mCat: document.getElementById('modal-cat'),
  mSubcat: document.getElementById('modal-subcat'),
  mLang: document.getElementById('modal-lang'),
  mQ: document.getElementById('modal-q'),
  mO1: document.getElementById('modal-opt-1'),
  mO2: document.getElementById('modal-opt-2'),
  mO3: document.getElementById('modal-opt-3'),
  mO4: document.getElementById('modal-opt-4'),
  mAns: document.getElementById('modal-ans'),
  mExpC: document.getElementById('modal-exp-c'),
  mExpI: document.getElementById('modal-exp-i'),

  // Spoiler check tool references
  checkSpoilersBtn: document.getElementById('check-spoilers-btn'),
  spoilerModal: document.getElementById('spoiler-modal'),
  spoilerModalContent: document.getElementById('spoiler-modal-content'),
  closeSpoilerModalBtn: document.getElementById('close-spoiler-modal-btn'),
  closeSpoilerModalBottomBtn: document.getElementById('close-spoiler-modal-bottom-btn'),
  autofixAllSpoilersBtn: document.getElementById('autofix-all-spoilers-btn'),
  spoilersTableBody: document.getElementById('spoilers-table-body'),
  spoilerCount: document.getElementById('spoiler-count'),
  spoilerStatusMsg: document.getElementById('spoiler-status-msg'),
  saveAllSpoilersBtn: document.getElementById('save-all-spoilers-btn'),
  spoilerLangFilter: document.getElementById('spoiler-lang-filter'),
};

// --- Directory browser for existing category JSONs ---
let openedDirHandle = null;

async function openCategoriesDirectory() {
  if (!window.showDirectoryPicker) {
    UI.importCatFile.click();
    return;
  }
  try {
    openedDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await renderDirCategoryList();

    const loadAll = confirm(translations.gen_load_confirm[currentLanguage]);
    if (loadAll) {
      await loadAllFromDirectory();
    }
  } catch (err) {
    if (err.name !== 'AbortError')
      showNotification(`${translations.error_title[currentLanguage]}: ${err.message}`, true);
  }
}

async function renderDirCategoryList() {
  if (!openedDirHandle || !UI.catDirList) return;
  UI.catDirList.innerHTML = '';
  const files = [];
  for await (const [name, handle] of openedDirHandle.entries()) {
    if (handle.kind === 'file' && name.endsWith('.json')) files.push({ name, handle });
  }
  files.sort((a, b) => a.name.localeCompare(b.name));

  if (files.length === 0) {
    UI.catDirList.innerHTML = `<p class="text-[11px] text-gray-500 italic text-center py-2">${currentLanguage === 'pl' ? 'Brak plików w katalogu.' : 'No files in folder.'}</p>`;
    UI.catDirList.classList.remove('hidden');
    return;
  }

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between text-[10px] text-gray-500 pb-1';
  header.innerHTML = `
        <span class="truncate">&#128193; <span class="text-gray-400 font-semibold">${openedDirHandle.name}</span></span>
        <div class="flex gap-1.5 ml-2 shrink-0">
            <button id="load-all-dir-btn" class="text-indigo-400 font-semibold">&#128229; ${currentLanguage === 'pl' ? 'Wczytaj wszystkie' : 'Load all'}</button>
            <button id="refresh-dir-btn" class="text-indigo-400 font-semibold">&#8635; ${currentLanguage === 'pl' ? 'Odśwież' : 'Refresh'}</button>
        </div>
    `;
  header.querySelector('#refresh-dir-btn').addEventListener('click', renderDirCategoryList);
  header.querySelector('#load-all-dir-btn').addEventListener('click', loadAllFromDirectory);
  UI.catDirList.appendChild(header);

  files.forEach(({ name, handle }) => {
    const item = document.createElement('div');
    item.className =
      'flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5';
    item.innerHTML = `
            <span class="text-xs text-gray-300 truncate font-mono">${name.replace('.json', '')}</span>
            <button class="load-dir-btn bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold px-2 py-1 rounded">${currentLanguage === 'pl' ? 'Dodaj do puli' : 'Add to pool'}</button>
        `;
    item.querySelector('.load-dir-btn').addEventListener('click', async () => {
      try {
        const file = await handle.getFile();
        await handleImportCategory(file, handle);
      } catch (err) {
        showNotification(`${translations.error_title[currentLanguage]}: ${err.message}`, true);
      }
    });
    UI.catDirList.appendChild(item);
  });
  UI.catDirList.classList.remove('hidden');
}

async function loadAllFromDirectory() {
  if (!openedDirHandle) return;
  let countLoaded = 0;
  let totalFiles = 0;
  try {
    for await (const [name, handle] of openedDirHandle.entries()) {
      if (handle.kind === 'file' && name.endsWith('.json')) {
        totalFiles++;
        const file = await handle.getFile();
        const text = await file.text();
        try {
          const data = JSON.parse(text);
          if (!data.name || !data.questions || !Array.isArray(data.questions)) {
            continue;
          }
          const imported = data.questions.map((q, index) => ({
            id: `imp-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
            language: data.language || UI.dbLang.value || 'pl',
            category: data.name,
            subcategory: q.subcategory || '',
            question: q.question,
            options: q.options ? q.options.slice(0, 4) : [],
            answer: q.answer,
            explanation_correct: q.explanation_correct || '',
            explanation_incorrect: q.explanation_incorrect || '',
          }));
          generatedQuestions.push(...imported);
          countLoaded++;
        } catch (e) {
          logConsole(
            `${currentLanguage === 'pl' ? 'Błąd parsowania pliku' : 'Error parsing file'} ${name}: ${e.message}`
          );
        }
      }
    }
    showNotification(
      translations.gen_load_success[currentLanguage]
        .replace('{count}', countLoaded)
        .replace('{total}', totalFiles)
    );
    updateTable();
  } catch (err) {
    showNotification(
      translations.gen_load_error[currentLanguage].replace('{error}', err.message),
      true
    );
  }
}

function addCategoryRow(name = '', description = '') {
  const row = document.createElement('div');
  row.className =
    'category-input-row flex flex-col md:flex-row gap-3 bg-slate-900 border border-slate-850 p-4 rounded-xl relative hover:border-slate-750';

  const nameLabel = translations.gen_category_name_label
    ? translations.gen_category_name_label[currentLanguage]
    : currentLanguage === 'pl'
      ? 'Nazwa Kategorii'
      : 'Category Name';
  const descLabel = translations.gen_category_desc_label
    ? translations.gen_category_desc_label[currentLanguage]
    : currentLanguage === 'pl'
      ? 'Opis (opcjonalnie)'
      : 'Description (optional)';

  row.innerHTML = `
        <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex flex-col">
                <label class="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider" data-lang-key="gen_category_name_label">${nameLabel}</label>
                <input type="text" class="category-name-input px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500" value="${name}">
            </div>
            <div class="flex flex-col">
                <label class="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider" data-lang-key="gen_category_desc_label">${descLabel}</label>
                <input type="text" class="category-desc-input px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500" value="${description}">
            </div>
        </div>
        <div class="flex items-end justify-end md:pb-1">
            <button type="button" class="remove-cat-btn bg-red-950/40 hover:bg-red-900 border border-red-750/30 hover:border-red-600 text-red-400 hover:text-white p-2 rounded-md transition-colors">❌</button>
        </div>
    `;
  row.querySelector('.remove-cat-btn').addEventListener('click', () => {
    row.remove();
    if (UI.categoriesList.querySelectorAll('.category-input-row').length === 0) addCategoryRow();
  });
  UI.categoriesList.appendChild(row);
}

function getActiveCategories() {
  const list = [];
  UI.categoriesList.querySelectorAll('.category-input-row').forEach((row) => {
    const nameInput = row.querySelector('.category-name-input');
    const descInput = row.querySelector('.category-desc-input');
    if (nameInput && nameInput.value.trim()) {
      list.push({
        name: nameInput.value.trim(),
        description: descInput ? descInput.value.trim() : '',
      });
    }
  });
  return list;
}

// Workspace: Import DOŁĄCZA do obecnej puli, zamiast czyścić
async function handleImportCategory(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.name || !data.questions || !Array.isArray(data.questions))
        throw new Error(
          currentLanguage === 'pl'
            ? 'Nieprawidłowy format pliku JSON.'
            : 'Invalid JSON file format.'
        );

      const imported = data.questions.map((q, index) => ({
        id: `imp-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
        language: data.language || UI.dbLang.value || 'pl',
        category: data.name,
        subcategory: q.subcategory || '',
        question: q.question,
        options: q.options ? q.options.slice(0, 4) : [],
        answer: q.answer,
        explanation_correct: q.explanation_correct || '',
        explanation_incorrect: q.explanation_incorrect || '',
      }));

      // Dołączamy, nie nadpisujemy
      generatedQuestions.push(...imported);
      showNotification(
        translations.gen_import_success[currentLanguage]
          .replace('{name}', data.name)
          .replace('{count}', imported.length)
      );
      updateTable();
    } catch (err) {
      showNotification(
        translations.gen_import_error[currentLanguage].replace('{error}', err.message),
        true
      );
    }
  };
  reader.readAsText(file);
}

// --- Init ---
async function initialize() {
  try {
    const res = await fetch('prompts.json');
    promptsConfig = await res.json();
  } catch (e) {
    logConsole('Błąd wczytywania prompts.json: ' + e.message);
  }

  UI.categoriesList.innerHTML = '';
  addCategoryRow();

  const savedProvider = localStorage.getItem('gen_provider') || 'openrouter';
  UI.provider.value = savedProvider;

  updateApiKeyUI(savedProvider);
  UI.apiUrl.value =
    localStorage.getItem(`trivia_url_${savedProvider}`) || PROVIDERS[savedProvider].url || '';

  UI.provider.addEventListener('change', (e) => {
    const prov = e.target.value;
    localStorage.setItem('gen_provider', prov);
    UI.apiKey.value = '';
    UI.apiUrl.value = localStorage.getItem(`trivia_url_${prov}`) || PROVIDERS[prov].url || '';
    updateApiKeyUI(prov);
    updateModelDropdown(prov);
  });

  UI.apiUrl.addEventListener('input', (e) => {
    localStorage.setItem(`trivia_url_${UI.provider.value}`, e.target.value.trim());
  });

  UI.addCatBtn.addEventListener('click', () => addCategoryRow());
  UI.clearCatsBtn.addEventListener('click', () => {
    UI.categoriesList.innerHTML = '';
    addCategoryRow();
  });

  // Batch slider live display
  UI.batchSize.addEventListener('input', () => {
    UI.batchSizeValue.textContent = UI.batchSize.value;
  });

  UI.openCatDirBtn.addEventListener('click', () => openCategoriesDirectory());
  UI.importCatBtn.addEventListener('click', () => UI.importCatFile.click());
  UI.importCatFile.addEventListener('change', (e) => {
    if (e.target.files[0]) {
      handleImportCategory(e.target.files[0]);
      UI.importCatFile.value = '';
    }
  });

  // Nasłuchiwacze na modele
  UI.modelSelectBp.addEventListener('change', (e) =>
    localStorage.setItem(`trivia_model_bp_${UI.provider.value}`, e.target.value)
  );
  UI.modelSelectQ.addEventListener('change', (e) =>
    localStorage.setItem(`trivia_model_q_${UI.provider.value}`, e.target.value)
  );
  UI.fetchModelsBtn.addEventListener('click', () => fetchModels());
  UI.startBtn.addEventListener('click', () => startGeneration());
  UI.stopBtn.addEventListener('click', () => stopGeneration());
  UI.exportAllBtn.addEventListener('click', () => exportAllCategories());
  UI.saveAllDirBtn.addEventListener('click', () => saveCategoriesToDirectory());

  // Toolbar Listeners
  UI.searchInput.addEventListener('input', updateTable);
  UI.filterCat.addEventListener('change', updateTable);
  UI.filterLang.addEventListener('change', updateTable);

  // Modal Listeners
  UI.addManualQBtn.addEventListener('click', () => openModal());
  UI.closeModalBtn.addEventListener('click', closeModal);
  UI.cancelModalBtn.addEventListener('click', closeModal);
  UI.saveModalBtn.addEventListener('click', saveModal);

  // Spoiler Check Listeners
  UI.checkSpoilersBtn.addEventListener('click', openSpoilerModal);
  UI.closeSpoilerModalBtn.addEventListener('click', closeSpoilerModal);
  UI.closeSpoilerModalBottomBtn.addEventListener('click', closeSpoilerModal);
  UI.autofixAllSpoilersBtn.addEventListener('click', rewriteAllSpoilers);
  UI.saveAllSpoilersBtn.addEventListener('click', saveAllSpoilersChanges);
  UI.spoilerLangFilter.addEventListener('change', renderSpoilersTable);

  updateModelDropdown(savedProvider);

  // Language switcher buttons
  const langPlBtn = document.getElementById('lang-pl');
  const langEnBtn = document.getElementById('lang-en');
  if (langPlBtn && langEnBtn) {
    langPlBtn.addEventListener('click', () => setLanguage('pl'));
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }

  setLanguage(currentLanguage);
}

function logConsole(msg) {
  const time = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.textContent = `[${time}] ${msg}`;
  UI.logs.appendChild(div);
  UI.logs.scrollTop = UI.logs.scrollHeight;
}

function showNotification(text, isError = false) {
  UI.notificationText.textContent = text;
  UI.notification.className = `fixed top-5 right-5 px-6 py-3 rounded-lg shadow-xl z-50 transform transition-all duration-300 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white translate-y-0 opacity-100`;
  setTimeout(() => {
    UI.notification.classList.replace('translate-y-0', 'translate-y-[-100px]');
    UI.notification.classList.replace('opacity-100', 'opacity-0');
  }, 4000);
}

async function fetchModels() {
  const provider = UI.provider.value;
  const config = PROVIDERS[provider];
  let baseUrl = UI.apiUrl.value.trim() || config.url;
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const key = UI.apiKey.value.trim();
  if (config.needsKey && !key) return showNotification('Wymagany jest klucz API!', true);

  UI.fetchModelsBtn.disabled = true;
  UI.fetchModelsBtn.textContent = '...';
  try {
    const headers = key ? { Authorization: `Bearer ${key}` } : {};
    const res = await fetch(`${baseUrl}/models`, { headers });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    UI.modelSelectBp.innerHTML = '';
    UI.modelSelectQ.innerHTML = '';

    if ((data.data || []).length === 0) {
      updateModelDropdown(provider);
    } else {
      // Pobierz zapisane preferencje dla danego dostawcy
      const savedBp = localStorage.getItem(`trivia_model_bp_${provider}`) || config.defaultModel;
      const savedQ = localStorage.getItem(`trivia_model_q_${provider}`) || config.defaultModel;

      data.data
        .sort((a, b) => a.id.localeCompare(b.id))
        .forEach((m) => {
          const optBp = document.createElement('option');
          optBp.value = optBp.textContent = m.id;
          if (m.id === savedBp) optBp.selected = true;
          UI.modelSelectBp.appendChild(optBp);

          const optQ = document.createElement('option');
          optQ.value = optQ.textContent = m.id;
          if (m.id === savedQ) optQ.selected = true;
          UI.modelSelectQ.appendChild(optQ);
        });
    }
    showNotification('Modele pobrane!');
  } catch (err) {
    showNotification('Błąd pobierania modeli.', true);
  } finally {
    UI.fetchModelsBtn.disabled = false;
    UI.fetchModelsBtn.textContent = 'Odśwież listę';
  }
}

function updateModelDropdown(provider) {
  const config = PROVIDERS[provider];
  const def = config.defaultModel || 'google/gemini-2.5-flash';
  UI.modelSelectBp.innerHTML = `<option value="${def}">${def}</option>`;
  UI.modelSelectQ.innerHTML = `<option value="${def}">${def}</option>`;
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function callLLM(provider, model, system, prompt, signal) {
  const config = PROVIDERS[provider];
  let baseUrl = UI.apiUrl.value.trim() || config.url;
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
  const key = UI.apiKey.value.trim();

  const headers = { 'Content-Type': 'application/json' };
  headers['Authorization'] = key ? `Bearer ${key}` : `Bearer none`;
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.href;
    headers['X-Title'] = 'Trivia Gen';
  }

  const payload = {
    model: model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  };
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) throw new Error(`API status ${res.status}`);
  const data = await res.json();
  return healAndParseJSON(data.choices[0].message.content.trim());
}

// --- Generator z systemem Chunking ---
async function startGeneration() {
  if (isGenerating) return;
  const provider = UI.provider.value;
  const modelBp = UI.modelSelectBp.value; // Model dla blueprintów
  const modelQ = UI.modelSelectQ.value; // Model dla pytań
  const key = UI.apiKey.value.trim();
  const config = PROVIDERS[provider];

  if (config.needsKey && !key)
    return showNotification(translations.gen_api_key_required[currentLanguage], true);

  const activeCategories = getActiveCategories();
  if (activeCategories.length === 0 || activeCategories.some((c) => !c.name))
    return showNotification(translations.gen_fill_categories[currentLanguage], true);

  const countPerCat = parseInt(UI.qPerCategory.value) || 5;
  const batchSize = Math.max(1, parseInt(UI.batchSize.value) || 1);
  const lang = UI.dbLang.value,
    diff = UI.difficulty.value,
    theme = UI.theme.value.trim();

  isGenerating = true;
  abortGenController = new AbortController();
  UI.startBtn.classList.add('hidden');
  UI.stopBtn.classList.remove('hidden');
  UI.stopBtn.disabled = false;
  UI.progressPanel.classList.remove('hidden');
  UI.logs.innerHTML = '';

  let totalGeneratedCount = 0;
  const totalQuestionsTarget = activeCategories.length * countPerCat;

  try {
    for (let c = 0; c < activeCategories.length; c++) {
      const category = activeCategories[c];
      if (abortGenController.signal.aborted) break;

      logConsole(
        `${currentLanguage === 'pl' ? 'Generowanie tematów (Chunking) dla:' : 'Generating blueprints (Chunking) for:'} "${category.name}"...`
      );
      UI.taskStatus.textContent = `${currentLanguage === 'pl' ? 'Analiza dla' : 'Analysis for'} "${category.name}"...`;

      let allBlueprints = [];
      let remaining = countPerCat;
      const MAX_CHUNK = 15;
      const usedTargets = [];
      const bpPromptData = promptsConfig.generate_blueprints[lang];

      while (remaining > 0 && !abortGenController.signal.aborted) {
        const chunk = Math.min(remaining, MAX_CHUNK);
        const bpSystem =
          bpPromptData.system +
          '\n' +
          bpPromptData.instruction.join('\n').replace(/{count}/g, chunk);
        const bpPrompt = bpPromptData.task_template
          .replace('{category}', category.name)
          .replace('{theme}', theme || 'brak')
          .replace('{count}', chunk)
          .replace('{used_targets}', usedTargets.join(', '));

        try {
          const res = await callLLM(
            provider,
            modelBp,
            bpSystem,
            bpPrompt,
            abortGenController.signal
          );
          if (!res.topics || res.topics.length === 0) break;
          allBlueprints.push(...res.topics);
          res.topics.forEach((t) => usedTargets.push(t.target_answer));
          remaining -= res.topics.length;
        } catch (err) {
          break;
        }
      }

      allBlueprints = allBlueprints.slice(0, countPerCat);

      // --- Batch vs single-question generation ---
      if (batchSize <= 1) {
        // Tryb single (oryginalny)
        const qPromptData = promptsConfig.generate_question_from_blueprint[lang];
        const qSystem = qPromptData.persona + '\n' + qPromptData.static_instructions.join('\n');

        for (let qIdx = 0; qIdx < allBlueprints.length; qIdx++) {
          if (abortGenController.signal.aborted) break;
          const blueprint = allBlueprints[qIdx];
          UI.taskStatus.textContent = `${currentLanguage === 'pl' ? 'Pytanie' : 'Question'} ${qIdx + 1}/${allBlueprints.length} ${currentLanguage === 'pl' ? 'dla' : 'for'} "${category.name}"`;

          const qPrompt = qPromptData.task_template
            .replace('{category}', category.name)
            .replace('{subcategory}', blueprint.subcategory || 'Ogólne')
            .replace('{modifier}', blueprint.modifier || 'Fakt')
            .replace('{target_answer}', blueprint.target_answer || 'ciekawostka')
            .replace('{knowledge_level}', diff);

          try {
            const qData = await callLLM(
              provider,
              modelQ,
              qSystem,
              qPrompt,
              abortGenController.signal
            );
            generatedQuestions.push({
              id: Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              language: lang,
              category: category.name,
              subcategory: blueprint.subcategory || '',
              question: qData.question,
              options: qData.options.slice(0, 4),
              answer: qData.answer,
              explanation_correct: qData.explanation_correct || '',
              explanation_incorrect: qData.explanation_incorrect || '',
            });
            totalGeneratedCount++;
          } catch (err) {
            logConsole(
              currentLanguage === 'pl'
                ? 'Pominięto 1 pytanie (błąd parsowania JSON z modelu).'
                : 'Skipped 1 question (model JSON parsing error).'
            );
          }

          const pct = Math.round((totalGeneratedCount / totalQuestionsTarget) * 100);
          UI.progressBar.style.width = `${pct}%`;
          UI.progressPct.textContent = `${pct}%`;
          UI.progressCounts.textContent = translations.gen_progress_counts[currentLanguage].replace(
            '{count}',
            totalGeneratedCount
          );
          updateTable();
          await delay(300);
        }
      } else {
        // Tryb BATCH — grupujemy blueprinty i generujemy N pytań w jednym prompcie
        const batchPromptData = promptsConfig.generate_questions_batch[lang];
        const batchSystem =
          batchPromptData.persona + '\n' + batchPromptData.static_instructions.join('\n');

        for (let bStart = 0; bStart < allBlueprints.length; bStart += batchSize) {
          if (abortGenController.signal.aborted) break;
          const chunk = allBlueprints.slice(bStart, bStart + batchSize);
          const batchNum = Math.floor(bStart / batchSize) + 1;
          const totalBatches = Math.ceil(allBlueprints.length / batchSize);
          UI.taskStatus.textContent = `Batch ${batchNum}/${totalBatches} (${chunk.length} ${currentLanguage === 'pl' ? 'pyt.' : 'qs'}) ${currentLanguage === 'pl' ? 'dla' : 'for'} "${category.name}"`;
          logConsole(
            `Batch ${batchNum}/${totalBatches}: ${currentLanguage === 'pl' ? 'generowanie' : 'generating'} ${chunk.length} ${currentLanguage === 'pl' ? 'pytań dla' : 'questions for'} "${category.name}"...`
          );

          const blueprintsJson = JSON.stringify(chunk, null, 2);
          const batchPrompt = batchPromptData.task_template
            .replace('{category}', category.name)
            .replace('{knowledge_level}', diff)
            .replace('{blueprints_json}', blueprintsJson);

          try {
            const batchResult = await callLLM(
              provider,
              modelQ,
              batchSystem,
              batchPrompt,
              abortGenController.signal
            );
            const questions = Array.isArray(batchResult?.questions) ? batchResult.questions : [];

            if (questions.length === 0) {
              logConsole(
                `Batch ${batchNum}: ${currentLanguage === 'pl' ? 'brak pytań w odpowiedzi — pomijam.' : 'no questions in response — skipping.'}`
              );
            }

            for (let qi = 0; qi < questions.length; qi++) {
              const qData = questions[qi];
              const blueprint = chunk[qi] || chunk[0];
              if (!qData?.question || !qData?.answer || !Array.isArray(qData?.options)) {
                logConsole(
                  `Batch ${batchNum}[${qi}]: ${currentLanguage === 'pl' ? 'nieprawidłowa struktura pytania — pomijam.' : 'invalid question structure — skipping.'}`
                );
                continue;
              }
              generatedQuestions.push({
                id: Date.now() + '-' + Math.random().toString(36).substring(2, 6),
                language: lang,
                category: category.name,
                subcategory: qData.subcategory || blueprint?.subcategory || '',
                question: qData.question,
                options: qData.options.slice(0, 4),
                answer: qData.answer,
                explanation_correct: qData.explanation_correct || '',
                explanation_incorrect: qData.explanation_incorrect || '',
              });
              totalGeneratedCount++;
            }
          } catch (err) {
            logConsole(
              `Batch ${batchNum}: ${currentLanguage === 'pl' ? 'błąd' : 'error'} (${err.message}) — ${currentLanguage === 'pl' ? 'pomijam cały batch.' : 'skipping whole batch.'}`
            );
          }

          const pct = Math.round((totalGeneratedCount / totalQuestionsTarget) * 100);
          UI.progressBar.style.width = `${pct}%`;
          UI.progressPct.textContent = `${pct}%`;
          UI.progressCounts.textContent = translations.gen_progress_counts[currentLanguage].replace(
            '{count}',
            totalGeneratedCount
          );
          updateTable();
          await delay(300);
        }
      }
    }
    showNotification(
      abortGenController.signal.aborted
        ? translations.gen_stopped[currentLanguage]
        : translations.gen_finished[currentLanguage]
    );
  } catch (err) {
    showNotification(translations.gen_error[currentLanguage], true);
  } finally {
    isGenerating = false;
    UI.startBtn.classList.remove('hidden');
    UI.stopBtn.classList.add('hidden');
  }
}

function stopGeneration() {
  if (abortGenController) {
    abortGenController.abort();
    UI.stopBtn.disabled = true;
  }
}

// --- CMS: Zarządzanie Tablicą, Wyszukiwaniem i Edycją ---
function updateTable() {
  if (generatedQuestions.length === 0) {
    UI.reviewPanel.classList.add('hidden');
    return;
  }
  UI.reviewPanel.classList.remove('hidden');

  // Aktualizuj listę kategorii w filtrze
  const uniqueCats = [...new Set(generatedQuestions.map((q) => q.category))].sort();
  const currentFilter = UI.filterCat.value;
  UI.filterCat.innerHTML = `<option value="ALL">${translations.gen_filter_all_cats[currentLanguage]}</option>`;
  uniqueCats.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    if (c === currentFilter) opt.selected = true;
    UI.filterCat.appendChild(opt);
  });

  // Filtrowanie
  const term = UI.searchInput.value.toLowerCase().trim();
  const activeFilter = UI.filterCat.value;
  const activeLang = UI.filterLang ? UI.filterLang.value : 'ALL';

  let filtered = generatedQuestions;
  if (activeFilter !== 'ALL') filtered = filtered.filter((q) => q.category === activeFilter);
  if (activeLang !== 'ALL') filtered = filtered.filter((q) => (q.language || 'pl') === activeLang);
  if (term) {
    filtered = filtered.filter(
      (q) =>
        q.question.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term) ||
        q.options.some((o) => o.toLowerCase().includes(term))
    );
  }

  UI.totalGenCount.textContent = `${filtered.length} (${currentLanguage === 'pl' ? 'Z puli' : 'From pool'}: ${generatedQuestions.length})`;
  UI.tableBody.innerHTML = '';

  filtered.forEach((q) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800 transition-colors group border-b border-slate-800';
    tr.innerHTML = `
            <td class="px-4 py-3 text-xs font-semibold text-indigo-400">
                ${q.category}<br>
                <span class="text-[10px] text-gray-500 font-normal">${q.subcategory}</span>
                <span class="ml-1 text-[9px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded font-mono uppercase">${q.language || 'pl'}</span>
            </td>
            <td class="px-4 py-3 text-sm text-white font-medium max-w-md">${q.question}</td>
            <td class="px-4 py-3 text-xs">
                <div class="text-green-400 font-bold mb-1">${q.answer}</div>
                <div class="text-[10px] text-gray-500 leading-tight">${currentLanguage === 'pl' ? 'Złe' : 'Incorrect'}: ${q.options.filter((o) => o !== q.answer).join(', ')}</div>
            </td>
            <td class="px-4 py-3 text-center whitespace-nowrap">
                <div class="flex gap-1 justify-center">
                    <button class="edit-btn bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs transition-colors" data-id="${q.id}">✏️ ${currentLanguage === 'pl' ? 'Edytuj' : 'Edit'}</button>
                    <button class="del-btn bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 px-2 py-1 rounded text-xs transition-colors" data-id="${q.id}">🗑️</button>
                </div>
            </td>
            <td class="px-2 py-3 text-center text-lg">${q.explanation_correct || q.explanation_incorrect ? '💡' : ''}</td>
        `;
    tr.querySelector('.edit-btn').addEventListener('click', () => openModal(q.id));
    tr.querySelector('.del-btn').addEventListener('click', () => {
      generatedQuestions = generatedQuestions.filter((x) => x.id !== q.id);
      updateTable();
    });
    UI.tableBody.appendChild(tr);
  });

  // Refresh Category Export Buttons
  if (UI.categoryDownloadsGrid) {
    UI.categoryDownloadsGrid.innerHTML = '';
    uniqueCats.forEach((catName) => {
      const catQuestions = generatedQuestions.filter((q) => q.category === catName);
      const filteredCatQs =
        activeLang === 'ALL'
          ? catQuestions
          : catQuestions.filter((q) => (q.language || 'pl') === activeLang);
      if (filteredCatQs.length === 0) return;

      const count = filteredCatQs.length;
      const card = document.createElement('div');
      card.className =
        'flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-xs gap-2';
      card.innerHTML = `
                <div class="flex-grow min-w-0">
                    <div class="font-bold text-white truncate">${catName}</div>
                    <div class="text-[10px] text-gray-400">${currentLanguage === 'pl' ? 'Pytań' : 'Questions'}: ${count}</div>
                </div>
                <div class="flex gap-1.5">
                    <button class="save-cat-btn bg-emerald-700 hover:bg-emerald-600 px-2 py-1 rounded text-white" data-cat="${catName}">💾</button>
                    <button class="export-cat-btn bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-white" data-cat="${catName}">📥</button>
                </div>
            `;
      card
        .querySelector('.save-cat-btn')
        .addEventListener('click', (e) => saveCategoryToDirectory(e.target.dataset.cat));
      card
        .querySelector('.export-cat-btn')
        .addEventListener('click', (e) => exportCategory(e.target.dataset.cat));
      UI.categoryDownloadsGrid.appendChild(card);
    });
  }
}

// --- CRUD Modal ---
function openModal(id = null) {
  currentEditId = id;
  if (id) {
    const q = generatedQuestions.find((x) => x.id === id);
    if (!q) return;
    UI.modalTitle.textContent = translations.gen_modal_edit_title[currentLanguage];
    UI.mCat.value = q.category;
    UI.mSubcat.value = q.subcategory || '';
    UI.mLang.value = q.language || 'pl';
    UI.mQ.value = q.question;

    // Bezpieczne wstawienie 4 opcji (uzupełnienie pustych, jeśli jest mniej)
    const opts = [...q.options];
    while (opts.length < 4) opts.push('');

    UI.mO1.value = opts[0];
    UI.mO2.value = opts[1];
    UI.mO3.value = opts[2];
    UI.mO4.value = opts[3];

    // Zaznacz prawidłową (szuka indexu)
    let correctIdx = opts.indexOf(q.answer);
    if (correctIdx === -1) correctIdx = 0; // fallback
    UI.mAns.value = (correctIdx + 1).toString();

    UI.mExpC.value = q.explanation_correct || '';
    UI.mExpI.value = q.explanation_incorrect || '';
  } else {
    UI.modalTitle.textContent = translations.gen_modal_new_title[currentLanguage];
    // Pre-fill categories from active filter or inputs
    UI.mCat.value = UI.filterCat.value !== 'ALL' ? UI.filterCat.value : '';
    UI.mSubcat.value = '';
    UI.mLang.value = UI.dbLang.value || 'pl';
    UI.mQ.value = '';
    UI.mO1.value = '';
    UI.mO2.value = '';
    UI.mO3.value = '';
    UI.mO4.value = '';
    UI.mAns.value = '1';
    UI.mExpC.value = '';
    UI.mExpI.value = '';
  }

  UI.modalOverlay.classList.remove('hidden');
  // Małe opóźnienie dla animacji w Tailwind
  setTimeout(() => {
    UI.modalOverlay.classList.remove('opacity-0');
    UI.modalContent.classList.remove('scale-95');
  }, 10);
}

function closeModal() {
  UI.modalOverlay.classList.add('opacity-0');
  UI.modalContent.classList.add('scale-95');
  setTimeout(() => UI.modalOverlay.classList.add('hidden'), 200);
}

function saveModal() {
  const cat = UI.mCat.value.trim();
  const qText = UI.mQ.value.trim();
  const o1 = UI.mO1.value.trim(),
    o2 = UI.mO2.value.trim(),
    o3 = UI.mO3.value.trim(),
    o4 = UI.mO4.value.trim();

  if (!cat || !qText || !o1 || !o2 || !o3 || !o4) {
    return showNotification(translations.gen_fill_required[currentLanguage], true);
  }

  const opts = [o1, o2, o3, o4];
  const ansIdx = parseInt(UI.mAns.value) - 1;
  const answer = opts[ansIdx];

  const newData = {
    category: cat,
    subcategory: UI.mSubcat.value.trim(),
    language: UI.mLang.value,
    question: qText,
    options: opts,
    answer: answer,
    explanation_correct: UI.mExpC.value.trim(),
    explanation_incorrect: UI.mExpI.value.trim(),
  };

  if (currentEditId) {
    const idx = generatedQuestions.findIndex((x) => x.id === currentEditId);
    if (idx !== -1) generatedQuestions[idx] = { ...generatedQuestions[idx], ...newData };
    showNotification(translations.gen_question_updated[currentLanguage]);
  } else {
    newData.id = `man-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    generatedQuestions.push(newData);
    showNotification(translations.gen_question_added[currentLanguage]);
  }

  updateTable();
  closeModal();
}

// --- CMS: Eksport & Zapis ---
function buildCategoryObj(catName, lang = null) {
  const activeLang = lang || (UI.filterLang ? UI.filterLang.value : 'ALL');
  let catQs = generatedQuestions.filter((q) => q.category === catName);
  if (activeLang !== 'ALL') {
    catQs = catQs.filter((q) => (q.language || 'pl') === activeLang);
  }
  if (catQs.length === 0) return null;

  const catLang = activeLang !== 'ALL' ? activeLang : catQs[0].language || UI.dbLang.value || 'pl';

  return {
    id: slugify(catName) + '_' + catLang,
    name: catName,
    language: catLang,
    description:
      currentLanguage === 'pl' ? 'Baza wyeksportowana z edytora' : 'Database exported from editor',
    created_at: new Date().toISOString(),
    question_count: catQs.length,
    questions: catQs.map((q) => ({
      subcategory: q.subcategory,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation_correct: q.explanation_correct,
      explanation_incorrect: q.explanation_incorrect,
    })),
  };
}

function slugify(t) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '_');
}

async function saveCategoryToDirectory(catName, dirHandle = null) {
  const activeLang = UI.filterLang ? UI.filterLang.value : 'ALL';
  const obj = buildCategoryObj(catName, activeLang);
  if (!obj) return null;
  const json = JSON.stringify(obj, null, 2);
  const fname = `${obj.id}.json`;
  const dir = dirHandle || openedDirHandle;
  try {
    if (dir) {
      const file = await dir.getFileHandle(fname, { create: true });
      const w = await file.createWritable();
      await w.write(json);
      await w.close();
    } else if (window.showSaveFilePicker) {
      const h = await window.showSaveFilePicker({
        suggestedName: fname,
        types: [{ accept: { 'application/json': ['.json'] } }],
      });
      const w = await h.createWritable();
      await w.write(json);
      await w.close();
    } else exportCategory(catName);
    showNotification(translations.gen_saved_file[currentLanguage].replace('{file}', fname));
    return true;
  } catch (err) {
    if (err.name !== 'AbortError')
      showNotification(translations.gen_save_error[currentLanguage], true);
    return false;
  }
}

async function saveCategoriesToDirectory() {
  let dir = openedDirHandle;
  if (!dir && window.showDirectoryPicker) {
    try {
      dir = openedDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    } catch (err) {
      return;
    }
  }
  const activeLang = UI.filterLang ? UI.filterLang.value : 'ALL';
  let filteredQuestions = generatedQuestions;
  if (activeLang !== 'ALL') {
    filteredQuestions = generatedQuestions.filter((q) => (q.language || 'pl') === activeLang);
  }
  const cats = [...new Set(filteredQuestions.map((q) => q.category))];
  for (const c of cats) await saveCategoryToDirectory(c, dir);
}

function exportCategory(catName) {
  const activeLang = UI.filterLang ? UI.filterLang.value : 'ALL';
  const obj = buildCategoryObj(catName, activeLang);
  if (!obj) return;
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${obj.id}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportAllCategories() {
  if (generatedQuestions.length === 0) {
    return showNotification(translations.gen_no_questions_export[currentLanguage], true);
  }

  const activeLang = UI.filterLang ? UI.filterLang.value : 'ALL';
  let filteredQuestions = generatedQuestions;
  if (activeLang !== 'ALL') {
    filteredQuestions = generatedQuestions.filter((q) => (q.language || 'pl') === activeLang);
  }

  const cats = [...new Set(filteredQuestions.map((q) => q.category))];
  if (cats.length === 0) {
    return showNotification(translations.gen_no_questions_lang[currentLanguage], true);
  }

  if (typeof JSZip === 'undefined') {
    logConsole(
      currentLanguage === 'pl'
        ? 'Brak biblioteki JSZip (CDN). Pobieranie sekwencyjne...'
        : 'JSZip library missing (CDN). Downloading sequentially...'
    );
    for (let i = 0; i < cats.length; i++) {
      exportCategory(cats[i]);
      await delay(300);
    }
    return;
  }

  try {
    const zip = new JSZip();
    cats.forEach((catName) => {
      const obj = buildCategoryObj(catName, activeLang);
      if (obj) {
        const json = JSON.stringify(obj, null, 2);
        const fname = `${obj.id}.json`;
        zip.file(fname, json);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    const langSuffix = activeLang !== 'ALL' ? activeLang : UI.dbLang.value;
    link.download = `trivia_database_${langSuffix}_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification(translations.gen_zip_success[currentLanguage]);
  } catch (err) {
    showNotification(
      translations.gen_zip_error[currentLanguage].replace('{error}', err.message),
      true
    );
  }
}

// --- Algorytmy weryfikacji spoilerów (Levenshtein & Prefix) ---
function cleanTextForLevenshtein(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // usuwanie polskich znaków diakrytycznych
    .replace(/[.,#!$%^&*;:{}=\-_`~()?"']/g, '')
    .replace(/\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLevenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    const charA = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = charA === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function longestCommonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return i;
}

function findSpoilerInQuestion(question, answer, options = []) {
  const cleanQ = cleanTextForLevenshtein(question);
  const cleanA = cleanTextForLevenshtein(answer);
  if (!cleanA || !cleanQ)
    return { hasSpoiler: false, minDistance: Infinity, matchWord: '', method: '' };

  const wordsQ = cleanQ.split(' ');
  const wordsA = cleanA.split(' ');
  const n = wordsA.length;

  let minDistance = Infinity;
  let matchWord = '';
  let method = '';

  // 1. Sprawdź n-gramy o długości słów odpowiedzi
  for (let i = 0; i <= wordsQ.length - n; i++) {
    const subPhrase = wordsQ.slice(i, i + n).join(' ');
    const dist = getLevenshteinDistance(cleanA, subPhrase);
    if (dist < minDistance) {
      minDistance = dist;
      matchWord = subPhrase;
      method = 'levenshtein';
    }
  }

  let isSpoiler = false;
  const len = cleanA.length;

  if (minDistance === 0) {
    isSpoiler = true;
  } else if (len >= 4 && len <= 6 && minDistance <= 1) {
    isSpoiler = true;
  } else if (len > 6 && minDistance <= 2) {
    isSpoiler = true;
  }

  // 2. Jeśli odpowiedź jest wielowyrazowa, sprawdź pojedyncze słowa
  const blacklist = new Set([
    'styl',
    'style',
    'wiek',
    'wieku',
    'roku',
    'rok',
    'lata',
    'lat',
    'dzielo',
    'dziela',
    'autor',
    'autora',
    'miasto',
    'miasta',
    'panstwo',
    'panstwa',
    'rzeka',
    'rzeki',
    'morze',
    'morza',
    'gora',
    'gory',
    'kraj',
    'kraju',
    'jezyk',
    'jezyka',
    'imie',
    'imienia',
    'nazwisko',
    'nazwiska',
    'teoria',
    'teorii',
    'prawo',
    'prawa',
    'zasada',
    'zasady',
    'wojna',
    'wojny',
    'bitwa',
    'bitwy',
    'krol',
    'krola',
    'cesarz',
    'cesarza',
    'prezydent',
    'prezydenta',
    'year',
    'years',
    'century',
    'centuries',
    'king',
    'queen',
    'president',
    'author',
    'book',
    'river',
    'mountain',
    'country',
    'state',
    'city',
    'town',
    'lake',
    'sea',
    'ocean',
    'theory',
    'law',
    'rule',
    'war',
    'battle',
    'name',
  ]);

  if (!isSpoiler && wordsA.length > 1) {
    for (const wordA of wordsA) {
      if (wordA.length <= 3 || blacklist.has(wordA)) continue;
      for (const wordQ of wordsQ) {
        const dist = getLevenshteinDistance(wordA, wordQ);
        if (dist <= (wordA.length > 6 ? 2 : 1)) {
          isSpoiler = true;
          minDistance = dist;
          matchWord = wordQ;
          method = 'levenshtein_multi';
          break;
        }
      }
      if (isSpoiler) break;
    }
  }

  // 3. Prefiksy / LCP (przydatne przy odmianie np. Polska -> polskiego)
  if (!isSpoiler) {
    for (const wordQ of wordsQ) {
      if (!blacklist.has(cleanA)) {
        const lcpLen = longestCommonPrefixLength(cleanA, wordQ);
        if (lcpLen >= 4 && lcpLen >= cleanA.length - 2) {
          isSpoiler = true;
          minDistance = getLevenshteinDistance(cleanA, wordQ);
          matchWord = wordQ;
          method = 'prefix';
          break;
        }
      }
      if (wordsA.length > 1) {
        for (const wordA of wordsA) {
          if (wordA.length <= 3 || blacklist.has(wordA)) continue;
          const partLcpLen = longestCommonPrefixLength(wordA, wordQ);
          if (partLcpLen >= 4 && partLcpLen >= wordA.length - 2) {
            isSpoiler = true;
            minDistance = getLevenshteinDistance(wordA, wordQ);
            matchWord = wordQ;
            method = 'prefix_multi';
            break;
          }
        }
        if (isSpoiler) break;
      }
    }
  }

  if (isSpoiler && options && options.length > 0) {
    const distractors = options.filter((opt) => opt !== answer);
    let matchInDistractors = false;
    for (const distractor of distractors) {
      const cleanD = cleanTextForLevenshtein(distractor);
      if (!cleanD) continue;

      const lenD = cleanD.length;
      const distD = getLevenshteinDistance(cleanD, matchWord);
      if (distD === 0 || (lenD >= 4 && lenD <= 6 && distD <= 1) || (lenD > 6 && distD <= 2)) {
        matchInDistractors = true;
        break;
      }

      const wordsD = cleanD.split(' ');
      if (wordsD.length > 1) {
        for (const wordD of wordsD) {
          if (wordD.length <= 3 || blacklist.has(wordD)) continue;
          const distW = getLevenshteinDistance(wordD, matchWord);
          if (distW <= (wordD.length > 6 ? 2 : 1)) {
            matchInDistractors = true;
            break;
          }
        }
        if (matchInDistractors) break;
      }

      if (!blacklist.has(cleanD)) {
        const lcpLen = longestCommonPrefixLength(cleanD, matchWord);
        if (lcpLen >= 4 && lcpLen >= cleanD.length - 2) {
          matchInDistractors = true;
          break;
        }
      }

      if (wordsD.length > 1) {
        for (const wordD of wordsD) {
          if (wordD.length <= 3 || blacklist.has(wordD)) continue;
          const partLcpLen = longestCommonPrefixLength(wordD, matchWord);
          if (partLcpLen >= 4 && partLcpLen >= wordD.length - 2) {
            matchInDistractors = true;
            break;
          }
        }
        if (matchInDistractors) break;
      }
    }
    if (matchInDistractors) {
      isSpoiler = false;
    }
  }

  return {
    hasSpoiler: isSpoiler,
    minDistance,
    matchWord,
    method,
  };
}

// --- Kontroler Modalu Spoilerów ---
function openSpoilerModal() {
  activeSpoilers = [];

  generatedQuestions.forEach((q) => {
    const check = findSpoilerInQuestion(q.question, q.answer, q.options);
    if (check.hasSpoiler) {
      activeSpoilers.push({
        questionObj: q,
        matchInfo: check,
        status: 'pending',
        newQuestionText: q.question,
        newAnswerText: q.answer,
        newOptions: [...q.options],
        explanationCorrect: q.explanation_correct || '',
        explanationIncorrect: q.explanation_incorrect || '',
      });
    }
  });

  renderSpoilersTable();

  UI.spoilerModal.classList.remove('hidden');
  setTimeout(() => {
    UI.spoilerModal.classList.remove('opacity-0');
    UI.spoilerModalContent.classList.remove('scale-95');
  }, 10);
}

function closeSpoilerModal() {
  UI.spoilerModal.classList.add('opacity-0');
  UI.spoilerModalContent.classList.add('scale-95');
  setTimeout(() => UI.spoilerModal.classList.add('hidden'), 200);
}

function renderSpoilersTable() {
  const selectedLang = UI.spoilerLangFilter ? UI.spoilerLangFilter.value : 'ALL';
  const displayedSpoilers =
    selectedLang === 'ALL'
      ? activeSpoilers
      : activeSpoilers.filter((item) => (item.questionObj.language || 'pl') === selectedLang);

  UI.spoilerCount.textContent = displayedSpoilers.length;
  UI.spoilersTableBody.innerHTML = '';

  if (displayedSpoilers.length === 0) {
    UI.spoilersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-gray-500 italic">
                    ${translations.gen_spoiler_none[currentLanguage]}
                </td>
            </tr>
        `;
    UI.autofixAllSpoilersBtn.disabled = true;
    UI.autofixAllSpoilersBtn.classList.add('opacity-50', 'cursor-not-allowed');
    UI.saveAllSpoilersBtn.classList.add('hidden');
    return;
  }

  UI.autofixAllSpoilersBtn.disabled = false;
  UI.autofixAllSpoilersBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  UI.saveAllSpoilersBtn.classList.remove('hidden');

  displayedSpoilers.forEach((item) => {
    const index = activeSpoilers.indexOf(item);
    if (index === -1) return;

    const q = item.questionObj;
    const check = item.matchInfo;
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-800 transition-colors border-b border-slate-800 text-xs';

    let matchLabel = '';
    if (check.method.startsWith('levenshtein')) {
      matchLabel = `<span class="bg-amber-900/40 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">Levenshtein (${check.minDistance})</span><br><span class="text-[10px] text-gray-500 font-mono">${currentLanguage === 'pl' ? 'wzór' : 'pattern'}: "${check.matchWord}"</span>`;
    } else if (check.method.startsWith('prefix')) {
      matchLabel = `<span class="bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40">Prefiks LCP</span><br><span class="text-[10px] text-gray-500 font-mono">${currentLanguage === 'pl' ? 'wzór' : 'pattern'}: "${check.matchWord}"</span>`;
    }

    let actionHtml = '';
    let newQuestionInputHtml = '';

    if (item.status === 'loading') {
      actionHtml = `<div class="text-center font-bold text-indigo-400">🤖 ${currentLanguage === 'pl' ? 'Generowanie...' : 'Generating...'}</div>`;
      newQuestionInputHtml = `
                <div class="space-y-2 py-1">
                    <textarea class="w-full px-2 py-1 bg-slate-950 border border-slate-800 text-gray-500 rounded outline-none text-xs" rows="2" readonly disabled>${item.newQuestionText}</textarea>
                    <input type="text" class="w-full px-2 py-1 bg-slate-950 border border-slate-800 text-gray-500 rounded outline-none text-xs" readonly disabled value="${item.newAnswerText}">
                    <textarea class="w-full px-2 py-1 bg-slate-950 border border-slate-800 text-gray-500 rounded outline-none text-xs" rows="2" readonly disabled>${item.explanationCorrect || ''}</textarea>
                    <textarea class="w-full px-2 py-1 bg-slate-950 border border-slate-800 text-gray-500 rounded outline-none text-xs" rows="2" readonly disabled>${item.explanationIncorrect || ''}</textarea>
                </div>
            `;
    } else {
      actionHtml = `
                <div class="flex gap-1 justify-center">
                    <button class="ai-fix-btn bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-[10px] font-semibold transition-colors flex items-center gap-0.5" data-index="${index}">🤖 AI</button>
                    <button class="save-fix-btn bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-semibold transition-colors" data-index="${index}">💾 ${currentLanguage === 'pl' ? 'Zapisz' : 'Save'}</button>
                    <button class="ignore-fix-btn bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white px-2 py-1 rounded text-[10px] transition-colors" data-index="${index}">🗑️</button>
                </div>
            `;
      newQuestionInputHtml = `
                <div class="space-y-2 py-1">
                    <div>
                        <label class="block text-[9px] text-gray-500 font-semibold mb-0.5">${currentLanguage === 'pl' ? 'Nowe Pytanie' : 'New Question'}:</label>
                        <textarea class="new-q-textarea w-full px-2 py-1 bg-slate-850 border border-slate-700 rounded text-white focus:border-indigo-500 outline-none text-xs" rows="2" data-index="${index}">${item.newQuestionText}</textarea>
                    </div>
                    <div>
                        <label class="block text-[9px] text-gray-500 font-semibold mb-0.5">${currentLanguage === 'pl' ? 'Nowa Odpowiedź' : 'New Answer'}:</label>
                        <input type="text" class="new-ans-input w-full px-2 py-1 bg-slate-850 border border-slate-700 rounded text-white focus:border-indigo-500 outline-none text-xs" data-index="${index}" value="${item.newAnswerText}">
                    </div>
                    <div>
                        <label class="block text-[9px] text-gray-500 font-semibold mb-0.5">${translations.gen_modal_explanation_correct[currentLanguage]}:</label>
                        <textarea class="new-exp-c-textarea w-full px-2 py-1 bg-slate-850 border border-slate-700 rounded text-white focus:border-indigo-500 outline-none text-xs" rows="2" data-index="${index}">${item.explanationCorrect || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-[9px] text-gray-500 font-semibold mb-0.5">${translations.gen_modal_explanation_incorrect[currentLanguage]}:</label>
                        <textarea class="new-exp-i-textarea w-full px-2 py-1 bg-slate-850 border border-slate-700 rounded text-white focus:border-indigo-500 outline-none text-xs" rows="2" data-index="${index}">${item.explanationIncorrect || ''}</textarea>
                    </div>
                </div>
            `;
    }

    tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-gray-300 max-w-xs">${q.question} <br><span class="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">[${currentLanguage === 'pl' ? 'Język' : 'Language'}: ${q.language || 'pl'}]</span></td>
            <td class="px-4 py-3 font-bold text-red-400">${q.answer}</td>
            <td class="px-4 py-3">${matchLabel}</td>
            <td class="px-4 py-3">${newQuestionInputHtml}</td>
            <td class="px-4 py-3 text-center">${actionHtml}</td>
        `;

    const txt = tr.querySelector('.new-q-textarea');
    if (txt) {
      txt.addEventListener('input', (e) => {
        item.newQuestionText = e.target.value;
      });
    }

    const ansTxt = tr.querySelector('.new-ans-input');
    if (ansTxt) {
      ansTxt.addEventListener('input', (e) => {
        const oldVal = item.newAnswerText;
        const newVal = e.target.value.trim();
        item.newAnswerText = newVal;

        // Sync correct answer with the options array
        const idx = item.newOptions.indexOf(oldVal);
        if (idx !== -1) {
          item.newOptions[idx] = newVal;
        } else if (!item.newOptions.includes(newVal)) {
          item.newOptions[0] = newVal;
        }
      });
    }

    const expCTxt = tr.querySelector('.new-exp-c-textarea');
    if (expCTxt) {
      expCTxt.addEventListener('input', (e) => {
        item.explanationCorrect = e.target.value;
      });
    }

    const expITxt = tr.querySelector('.new-exp-i-textarea');
    if (expITxt) {
      expITxt.addEventListener('input', (e) => {
        item.explanationIncorrect = e.target.value;
      });
    }

    const aiBtn = tr.querySelector('.ai-fix-btn');
    if (aiBtn) aiBtn.addEventListener('click', () => rewriteSpoilerSingle(index));

    const saveBtn = tr.querySelector('.save-fix-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const mainIdx = generatedQuestions.findIndex((x) => x.id === q.id);
        if (mainIdx !== -1) {
          generatedQuestions[mainIdx].question = item.newQuestionText;
          generatedQuestions[mainIdx].answer = item.newAnswerText;
          generatedQuestions[mainIdx].options = [...item.newOptions];
          generatedQuestions[mainIdx].explanation_correct = item.explanationCorrect || '';
          generatedQuestions[mainIdx].explanation_incorrect = item.explanationIncorrect || '';
        }
        activeSpoilers.splice(index, 1);
        showNotification(translations.gen_spoilers_saved_single[currentLanguage]);
        renderSpoilersTable();
        updateTable();
      });
    }

    const ignoreBtn = tr.querySelector('.ignore-fix-btn');
    if (ignoreBtn) {
      ignoreBtn.addEventListener('click', () => {
        activeSpoilers.splice(index, 1);
        renderSpoilersTable();
      });
    }

    UI.spoilersTableBody.appendChild(tr);
  });
}

async function rewriteSpoilerSingle(index, skipRender = false) {
  const item = activeSpoilers[index];
  if (!item) return;

  const provider = UI.provider.value;
  const model = UI.modelSelectQ.value;
  const config = PROVIDERS[provider];
  const key = UI.apiKey.value.trim();
  if (config.needsKey && !key)
    return showNotification(translations.gen_api_key_required[currentLanguage], true);

  item.status = 'loading';
  if (!skipRender) renderSpoilersTable();

  try {
    const lang = item.questionObj.language || 'pl';
    const languageName = lang === 'pl' ? 'Polski / Polish' : 'Angielski / English';
    const promptData = promptsConfig.rewrite_question_with_spoiler[lang];
    const system = (promptData.persona + '\n' + promptData.static_instructions.join('\n')).replace(
      /{language}/g,
      languageName
    );
    const prompt = promptData.task_template
      .replace(/{language}/g, languageName)
      .replace('{category}', item.questionObj.category || '')
      .replace('{subcategory}', item.questionObj.subcategory || '')
      .replace('{question}', item.questionObj.question)
      .replace('{answer}', item.questionObj.answer)
      .replace('{options}', JSON.stringify(item.questionObj.options))
      .replace('{explanation_correct}', item.questionObj.explanation_correct || '')
      .replace('{explanation_incorrect}', item.questionObj.explanation_incorrect || '');

    const res = await callLLM(provider, model, system, prompt);
    if (res && res.question) {
      item.newQuestionText = res.question;
      if (res.answer) item.newAnswerText = res.answer;
      if (res.options && Array.isArray(res.options)) item.newOptions = res.options;
      if (res.explanation_correct) item.explanationCorrect = res.explanation_correct;
      if (res.explanation_incorrect) item.explanationIncorrect = res.explanation_incorrect;
      item.status = 'done';
      if (!skipRender) showNotification(translations.gen_spoilers_autofixed[currentLanguage]);
    } else {
      item.status = 'error';
      if (!skipRender)
        showNotification(translations.gen_spoilers_autofix_error[currentLanguage], true);
    }
  } catch (err) {
    item.status = 'error';
    if (!skipRender)
      showNotification(
        translations.gen_spoilers_rewrite_error[currentLanguage].replace('{error}', err.message),
        true
      );
  } finally {
    if (!skipRender) renderSpoilersTable();
  }
}

async function rewriteAllSpoilers() {
  const selectedLang = UI.spoilerLangFilter ? UI.spoilerLangFilter.value : 'ALL';
  const displayedSpoilers =
    selectedLang === 'ALL'
      ? activeSpoilers
      : activeSpoilers.filter((item) => (item.questionObj.language || 'pl') === selectedLang);

  const pendingIndexes = [];
  displayedSpoilers.forEach((item) => {
    const idx = activeSpoilers.indexOf(item);
    if (item.status !== 'done' && idx !== -1) pendingIndexes.push(idx);
  });

  if (pendingIndexes.length === 0) return;

  const provider = UI.provider.value;
  const model = UI.modelSelectQ.value;
  const config = PROVIDERS[provider];
  const key = UI.apiKey.value.trim();
  if (config.needsKey && !key)
    return showNotification(translations.gen_api_key_required[currentLanguage], true);

  UI.autofixAllSpoilersBtn.disabled = true;
  UI.autofixAllSpoilersBtn.textContent =
    currentLanguage === 'pl' ? '⌛ Poprawianie...' : '⌛ Correcting...';

  const BATCH_SIZE = 25;

  // Grupuj według języków
  const pendingByLang = {};
  pendingIndexes.forEach((idx) => {
    const item = activeSpoilers[idx];
    const lang = item.questionObj.language || 'pl';
    if (!pendingByLang[lang]) pendingByLang[lang] = [];
    pendingByLang[lang].push(idx);
  });

  try {
    for (const [groupLang, indexes] of Object.entries(pendingByLang)) {
      const total = indexes.length;
      const languageName = groupLang === 'pl' ? 'Polski / Polish' : 'Angielski / English';
      const promptData = promptsConfig.rewrite_questions_batch[groupLang];
      const system = (
        promptData.persona +
        '\n' +
        promptData.static_instructions.join('\n')
      ).replace(/{language}/g, languageName);

      for (let i = 0; i < indexes.length; i += BATCH_SIZE) {
        const batch = indexes.slice(i, i + BATCH_SIZE);
        const partNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalParts = Math.ceil(total / BATCH_SIZE);

        UI.spoilerStatusMsg.innerHTML = `${currentLanguage === 'pl' ? 'Przepisywanie AI' : 'AI Rewriting'} (${groupLang.toUpperCase()}): ${currentLanguage === 'pl' ? 'partia' : 'batch'} <span class="font-bold text-indigo-400">${partNum} / ${totalParts}</span> (${batch.length} ${currentLanguage === 'pl' ? 'pyt.' : 'qs'})...`;

        // Ustaw status loading dla całej partii
        batch.forEach((idx) => {
          activeSpoilers[idx].status = 'loading';
        });
        renderSpoilersTable();

        // Przygotuj JSON z partią pytań
        const questionsJsonData = batch.map((idx) => {
          const qObj = activeSpoilers[idx].questionObj;
          return {
            id: qObj.id,
            category: qObj.category,
            subcategory: qObj.subcategory || 'Ogólne',
            question: qObj.question,
            answer: qObj.answer,
            options: qObj.options,
            explanation_correct: qObj.explanation_correct || '',
            explanation_incorrect: qObj.explanation_incorrect || '',
          };
        });

        const firstQ = activeSpoilers[batch[0]].questionObj;
        const prompt = promptData.task_template
          .replace(/{language}/g, languageName)
          .replace('{category}', firstQ.category || 'Różne')
          .replace('{questions_json}', JSON.stringify(questionsJsonData, null, 2));

        try {
          const res = await callLLM(provider, model, system, prompt);
          const responseQuestions = Array.isArray(res?.questions) ? res.questions : [];

          // Przypisz wyniki z powrotem do pytań w partii
          batch.forEach((idx) => {
            const item = activeSpoilers[idx];
            const qObj = item.questionObj;
            const match = responseQuestions.find((r) => r.id === qObj.id);

            if (match && match.question) {
              item.newQuestionText = match.question;
              if (match.answer) item.newAnswerText = match.answer;
              if (match.options && Array.isArray(match.options)) item.newOptions = match.options;
              if (match.explanation_correct) item.explanationCorrect = match.explanation_correct;
              if (match.explanation_incorrect)
                item.explanationIncorrect = match.explanation_incorrect;
              item.status = 'done';
            } else {
              item.status = 'error';
            }
          });
        } catch (err) {
          logConsole(`Błąd partii ${partNum} (${groupLang}): ${err.message}`);
          batch.forEach((idx) => {
            activeSpoilers[idx].status = 'error';
          });
        }

        renderSpoilersTable();

        if (i + BATCH_SIZE < indexes.length) {
          await delay(500); // krótka przerwa między partiami
        }
      }
    }
    UI.spoilerStatusMsg.innerHTML =
      currentLanguage === 'pl'
        ? `Ukończono masowe poprawianie. Zweryfikuj i kliknij <span class="font-bold text-emerald-400">Zapisz wszystkie</span> poniżej lub zapisuj pojedynczo.`
        : `Bulk correcting completed. Verify and click <span class="font-bold text-emerald-400">Save all</span> below or save individually.`;
  } catch (err) {
    showNotification(translations.gen_spoilers_autofix_bulk_error[currentLanguage], true);
  } finally {
    UI.autofixAllSpoilersBtn.disabled = false;
    UI.autofixAllSpoilersBtn.textContent = translations.gen_spoiler_autofix_btn[currentLanguage];
  }
}

function saveAllSpoilersChanges() {
  if (activeSpoilers.length === 0) return;

  let countSaved = 0;
  activeSpoilers.forEach((item) => {
    const q = item.questionObj;
    const mainIdx = generatedQuestions.findIndex((x) => x.id === q.id);
    if (mainIdx !== -1) {
      generatedQuestions[mainIdx].question = item.newQuestionText;
      generatedQuestions[mainIdx].answer = item.newAnswerText;
      generatedQuestions[mainIdx].options = [...item.newOptions];
      generatedQuestions[mainIdx].explanation_correct = item.explanationCorrect || '';
      generatedQuestions[mainIdx].explanation_incorrect = item.explanationIncorrect || '';
      countSaved++;
    }
  });

  activeSpoilers = [];
  showNotification(
    translations.gen_spoilers_saved_all[currentLanguage].replace('{count}', countSaved)
  );
  renderSpoilersTable();
  updateTable();
  closeSpoilerModal();
}

window.addEventListener('DOMContentLoaded', initialize);

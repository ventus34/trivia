/**
 * @file client-adapter.js
 * Client-side API adapter that replaces the FastAPI backend.
 * Dedicated to Offline Database play (JSON files).
 */

import { initializeApp } from './main.js';
import { gameState, setState } from './state.js';
import { translations } from './config.js';
import { notify } from './error-bus.js';

const clientAdapter = {
  isConfigured() {
    return gameState.loadedDatabase !== null;
  },

  loadSettings() {
    const savedPlayMode = 'database';
    const savedDbUrl = localStorage.getItem('trivia_db_url') || 'categories';

    setState(
      {
        playMode: savedPlayMode,
        databaseUrl: savedDbUrl,
        askedQuestions: JSON.parse(localStorage.getItem('trivia_asked_questions') || '[]'),
      },
      'state:load-playmode'
    );

    if (savedPlayMode === 'database') {
      this.loadDatabase(savedDbUrl);
    }
  },

  saveSettings() {
    if (gameState.playMode) {
      localStorage.setItem('trivia_play_mode', gameState.playMode);
    }
    if (gameState.databaseUrl) {
      localStorage.setItem('trivia_db_url', gameState.databaseUrl);
    }
    if (gameState.askedQuestions) {
      localStorage.setItem('trivia_asked_questions', JSON.stringify(gameState.askedQuestions));
    }
  },

  async loadDatabase(dbUrl) {
    if (dbUrl === 'custom') {
      return;
    }

    if (!gameState.selectedCategoryIds || gameState.selectedCategoryIds.length === 0) {
      const saved = localStorage.getItem('trivia_selected_category_ids');
      if (saved) {
        gameState.selectedCategoryIds = JSON.parse(saved);
      }
    }

    if (!gameState.selectedCategoryIds || gameState.selectedCategoryIds.length !== 6) {
      console.warn('Need exactly 6 categories selected to load database.');
      return;
    }

    try {
      console.log('client-adapter.js: Loading categories:', gameState.selectedCategoryIds);

      if (!gameState.allCategories || gameState.allCategories.length === 0) {
        const listRes = await fetch('databases/list.json');
        if (listRes.ok) {
          gameState.allCategories = await listRes.json();
        }
      }

      const fetchPromises = gameState.selectedCategoryIds.map(async (id) => {
        const cat = gameState.allCategories?.find((c) => c.id === id);
        if (!cat) {
          console.warn(`Category not found in index: ${id}`);
          return null;
        }

        if (cat.is_custom) {
          return cat;
        }

        const catRes = await fetch(cat.path);
        if (!catRes.ok) throw new Error(`HTTP ${catRes.status} for ${cat.path}`);
        return await catRes.json();
      });

      const results = await Promise.all(fetchPromises);
      const loadedCats = results.filter(Boolean);

      if (gameState.gameId) {
        console.log('client-adapter.js: Game already in progress, skipping merge database fetch.');
        return;
      }

      const mergedQuestions = [];
      const categoryNames = [];

      loadedCats.forEach((cat) => {
        categoryNames.push(cat.name);
        const questions = (cat.questions || []).map((q) => ({
          ...q,
          category: cat.name,
        }));
        mergedQuestions.push(...questions);
      });

      const data = {
        name: gameState.currentLanguage === 'pl' ? 'Wybrane kategorie' : 'Selected categories',
        language: gameState.currentLanguage || 'pl',
        categories: categoryNames,
        questions: mergedQuestions,
      };

      setState(
        {
          loadedDatabase: data,
          categories: categoryNames,
        },
        'state:database-loaded'
      );

      console.log(
        `client-adapter.js: Merged database loaded successfully with ${mergedQuestions.length} questions.`
      );

      const event = new CustomEvent('database-loaded', { detail: data });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('client-adapter.js: Failed to load category JSONs', err);
      notify(
        {
          title: gameState.currentLanguage === 'pl' ? 'Błąd bazy danych' : 'Database Error',
          body:
            gameState.currentLanguage === 'pl'
              ? 'Nie udało się wczytać pytań dla wybranych kategorii.'
              : 'Failed to load questions for selected categories.',
        },
        'error'
      );
    }
  },

  setCustomDatabase(data) {
    setState(
      {
        loadedDatabase: data,
        categories: data.categories || [],
      },
      'state:database-loaded'
    );
    console.log(`client-adapter.js: Custom database set: ${data.name}`);
    const event = new CustomEvent('database-loaded', { detail: data });
    window.dispatchEvent(event);
  },

  async preloadQuestions() {
    // No-op
  },

  async generateCategories(theme) {
    if (gameState.loadedDatabase) {
      return gameState.loadedDatabase.categories.slice(0, 6);
    }
    return translations.default_categories[gameState.currentLanguage].split(', ');
  },

  async generateQuestion(category) {
    if (!gameState.loadedDatabase) throw new Error('No database loaded.');
    const allQs = gameState.loadedDatabase.questions.filter(
      (q) => q.category.toLowerCase().trim() === category.toLowerCase().trim()
    );
    if (allQs.length === 0) {
      throw new Error(
        gameState.currentLanguage === 'pl'
          ? `Brak pytań dla kategorii "${category}" w tej bazie danych.`
          : `No questions for category "${category}" in this database.`
      );
    }

    const asked = gameState.askedQuestions || [];
    let available = allQs.filter((q) => !asked.includes(q.question));

    if (available.length === 0) {
      console.log(
        `client-adapter: All questions in "${category}" have been asked. Resetting history for this category.`
      );
      const newAsked = asked.filter((qText) => !allQs.map((q) => q.question).includes(qText));
      setState({ askedQuestions: newAsked }, 'state:reset-asked');
      localStorage.setItem('trivia_asked_questions', JSON.stringify(newAsked));
      available = allQs;
    }

    const q = available[Math.floor(Math.random() * available.length)];

    const updatedAsked = [...(gameState.askedQuestions || []), q.question];
    setState({ askedQuestions: updatedAsked }, 'state:add-asked');
    localStorage.setItem('trivia_asked_questions', JSON.stringify(updatedAsked));

    return {
      question: q.question,
      options: q.options ? q.options.slice(0, 4) : [],
      answer: q.answer,
      subcategory: q.subcategory || '',
      explanation_correct: q.explanation_correct || '',
      explanation_incorrect: q.explanation_incorrect || '',
    };
  },

  async getIncorrectAnswerExplanation() {
    return {
      explanation:
        (gameState.currentQuestionData && gameState.currentQuestionData.explanation_incorrect) ||
        (gameState.currentLanguage === 'pl'
          ? 'Odpowiedź jest niepoprawna.'
          : 'The answer is incorrect.'),
    };
  },

  async getCategoryMutationChoices(oldCategory, existingCategories = []) {
    return [];
  },
};

setState({ api: clientAdapter });
window.clientAdapter = clientAdapter;

export { clientAdapter };
initializeApp(clientAdapter);

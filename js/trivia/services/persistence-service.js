/**
 * @file persistence-service.js
 * Handles saving, loading, and restarting the game state.
 */

import { gameState, setState } from '../state.js';
import { CONFIG, translations } from '../config.js';
import { UI } from '../dom.js';
import { createBoardLayout } from '../board.js';
import { setLanguage } from '../ui.js';
import { renderBoard } from '../ui-board.js';
import { emit } from '../store.js';
import { notify } from '../error-bus.js';

function isRestorableGameState(state) {
  return Boolean(
    state &&
    typeof state === 'object' &&
    !Array.isArray(state) &&
    Array.isArray(state.categories) &&
    state.categories.length === 6 &&
    state.categories.every((category) => typeof category === 'string' && category.trim()) &&
    Array.isArray(state.players) &&
    state.players.length >= 1 &&
    state.players.length <= CONFIG.PLAYER_COLORS.length &&
    state.players.every(
      (player) =>
        player &&
        typeof player === 'object' &&
        Number.isInteger(player.position) &&
        player.position >= 0 &&
        player.position <= 72
    )
  );
}

function normalizeRestorableGameState(state) {
  const categoryTopicHistory = state.categoryTopicHistory;
  return {
    ...state,
    categories: state.categories.map((category) => category.trim()),
    players: state.players.map((player, index) => ({
      ...player,
      name:
        typeof player.name === 'string' && player.name.trim()
          ? player.name.trim()
          : `Player ${index + 1}`,
      emoji: typeof player.emoji === 'string' && player.emoji ? player.emoji : '🎲',
      color: typeof player.color === 'string' ? player.color : CONFIG.PLAYER_COLORS[index],
      wedges: Array.isArray(player.wedges)
        ? [
            ...new Set(
              player.wedges.filter((wedge) => Number.isInteger(wedge) && wedge >= 0 && wedge < 6)
            ),
          ]
        : [],
    })),
    currentPlayerIndex:
      Number.isInteger(state.currentPlayerIndex) &&
      state.currentPlayerIndex >= 0 &&
      state.currentPlayerIndex < state.players.length
        ? state.currentPlayerIndex
        : 0,
    currentLanguage: state.currentLanguage === 'en' ? 'en' : 'pl',
    categoryTopicHistory:
      categoryTopicHistory &&
      typeof categoryTopicHistory === 'object' &&
      !Array.isArray(categoryTopicHistory)
        ? categoryTopicHistory
        : {},
  };
}

/**
 * Creates a "clean" version of the game state for saving.
 * @returns {object} The cleaned game state object.
 */
function getCleanedState() {
  try {
    const stateToSave = JSON.parse(JSON.stringify(gameState));

    const excludeKeys = [
      'api',
      'promptHistory',
      'possiblePaths',
      'currentQuestionData',
      'currentForcedCategoryIndex',
      'currentPlayerAnswer',
      'isAwaitingMove',
      'lastAnswerWasCorrect',
      'board',
      'isMutationPending',
    ];
    excludeKeys.forEach((key) => delete stateToSave[key]);

    if (stateToSave.categoryTopicHistory && stateToSave.categories) {
      const currentCategories = new Set(stateToSave.categories);
      const cleanedHistory = {};
      for (const categoryName in stateToSave.categoryTopicHistory) {
        if (currentCategories.has(categoryName)) {
          cleanedHistory[categoryName] = stateToSave.categoryTopicHistory[categoryName];
        }
      }
      stateToSave.categoryTopicHistory = cleanedHistory;
    }

    return stateToSave;
  } catch (e) {
    console.error('Error in getCleanedState:', e);
    throw e;
  }
}

/**
 * Saves the essential game state to localStorage.
 */
export function saveGameState() {
  try {
    const stateToSave = getCleanedState();
    localStorage.setItem('savedQuizGame', JSON.stringify(stateToSave));
    console.log('Game state saved (optimized).', new Date().toLocaleTimeString(), stateToSave);
  } catch (e) {
    console.error('saveGameState failed:', e);
  }
}

/**
 * Loads the game state from localStorage.
 * @returns {object|null} The loaded game state object, or null if not found.
 */
export function loadGameState() {
  try {
    const savedState = localStorage.getItem('savedQuizGame');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      if (isRestorableGameState(parsedState)) {
        return parsedState;
      }
      console.warn('Ignoring invalid saved game state in localStorage.');
    }
  } catch (e) {
    console.error('loadGameState failed:', e);
  }
  return null;
}

/**
 * Restarts the game by clearing saved state and reloading the page.
 */
export function restartGame() {
  if (confirm(translations.restart_game_confirm[gameState.currentLanguage])) {
    localStorage.removeItem('savedQuizGame');
    window.location.reload();
  }
}

/**
 * Triggers a download of the current game state as a JSON file.
 */
export function downloadGameState() {
  const stateToSave = getCleanedState();
  const jsonString = JSON.stringify(stateToSave, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
  link.download = `trivia_save_${timestamp}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Handles the user uploading a game state file.
 * @param {Event} event - The file input change event.
 */
export function handleStateUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const loadedState = JSON.parse(e.target.result);
      if (isRestorableGameState(loadedState)) {
        if (!restoreGameState(loadedState)) return;
        notify(
          {
            title: translations.success_title[gameState.currentLanguage],
            body: translations.game_loaded_success[gameState.currentLanguage],
          },
          'success'
        );
      } else {
        throw new Error(translations.invalid_save_format[gameState.currentLanguage]);
      }
    } catch (error) {
      console.error('Failed to load or parse game state:', error);
      notify(
        {
          title: translations.error_title[gameState.currentLanguage],
          body: translations.game_loaded_error[gameState.currentLanguage],
        },
        'error'
      );
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file, 'UTF-8');
}

/**
 * Restores the game from a loaded state object.
 * @param {object} stateToRestore - The game state object to load.
 */
export function restoreGameState(stateToRestore) {
  if (!isRestorableGameState(stateToRestore)) {
    notify(
      {
        title: translations.error_title[gameState.currentLanguage || 'pl'],
        body: translations.invalid_save_format[gameState.currentLanguage || 'pl'],
      },
      'error'
    );
    return false;
  }

  try {
    console.log('Restoring game state...', stateToRestore);
    setState(normalizeRestorableGameState(stateToRestore), 'state:restore');

    if (!gameState.gameId) {
      console.warn('Loaded game state is missing a gameId. Generating a new one.');
      setState(
        { gameId: 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9) },
        'state:restore'
      );
    }

    setState({ isAwaitingMove: false, lastAnswerWasCorrect: false }, 'state:restore');

    if (UI.modelSelect && gameState.selectedQuestionModel) {
      UI.modelSelect.value = gameState.selectedQuestionModel;
    }
    if (UI.explanationModelSelect && gameState.selectedExplanationModel) {
      UI.explanationModelSelect.value = gameState.selectedExplanationModel;
    }
    if (UI.categoryModelSelect && gameState.selectedCategoryModel) {
      UI.categoryModelSelect.value = gameState.selectedCategoryModel;
    }

    createBoardLayout();

    const lang = gameState.currentLanguage || 'pl';
    setLanguage(lang);

    UI.setupScreen.classList.add('hidden');
    UI.gameScreen.classList.remove('hidden');
    if (UI.generatorLinkBtn) UI.generatorLinkBtn.classList.add('hidden');

    const oldSvg = UI.boardWrapper.querySelector('.board-connections');
    if (oldSvg) oldSvg.remove();

    renderBoard();
    emit('categories:update');
    emit('state:update');

    UI.diceElement.disabled = false;
    UI.diceResultDiv.querySelector('span').textContent = translations.roll_to_start[lang];
    UI.gameMessageDiv.textContent = '';
    console.log('Game state successfully restored.');
    return true;
  } catch (error) {
    console.error('restoreGameState failed:', error);
    notify(
      {
        title: translations.error_title[gameState.currentLanguage || 'pl'],
        body:
          gameState.currentLanguage === 'en'
            ? 'Failed to restore game state.'
            : 'Nie udało się wczytać stanu gry.',
      },
      'error'
    );
    return false;
  }
}

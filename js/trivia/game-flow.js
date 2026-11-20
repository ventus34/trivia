/**
 * @file game-flow.js
 * Core game flow, state updates, and UI orchestration.
 */

import { CONFIG, translations } from './config.js';
import { gameState, setState, notifyState } from './state.js';
import { UI } from './dom.js';
import { createBoardLayout, findPossibleMoves } from './board.js';
import { promptCategoryChoice, hideModal, showVerificationPopup, showModal } from './ui.js';
import {
  renderBoard,
  animateDiceRoll,
  animatePawnMovement,
  renderAvailableMoves,
} from './ui-board.js';
import { recordQuestionHistory } from './ui-history.js';
import {
  clearQuestionReadingCards,
  refreshQuestionReadingCards,
  setQuestionReadingItems,
} from './reading-cards.js';
import { saveGameState, loadGameState, restoreGameState } from './persistence.js';
import { notify } from './error-bus.js';
import { getApiAdapter } from './services/api-service.js';
import { getChoiceVerdict, shuffleAnswerOptions } from './answer-options.js';

let questionRequest = 0;
let answerSubmitted = false;

function generateGameId() {
  return 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

function readCategoryTopicHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('globalQuizHistory') || '{}');
    return history && typeof history === 'object' && !Array.isArray(history) ? history : {};
  } catch (error) {
    console.warn('Ignoring invalid saved topic history.', error);
    return {};
  }
}

function makeReadingSectionLabel(key) {
  const label = document.createElement('p');
  label.className = 'reading-section-label';
  label.dataset.langKey = key;
  label.textContent = translations[key]?.[gameState.currentLanguage] || '';
  return label;
}

export function validateGameSetup(playerCount, categories) {
  if (
    !Number.isInteger(playerCount) ||
    playerCount < 1 ||
    playerCount > CONFIG.PLAYER_COLORS.length
  ) {
    return 'player-count';
  }

  if (
    !Array.isArray(categories) ||
    categories.length !== 6 ||
    categories.some((category) => typeof category !== 'string' || !category.trim())
  ) {
    return 'categories';
  }

  return null;
}

/**
 * Makes the 'Wczytaj ostatnią grę' button visible and ensures its click handler
 * always loads the latest saved state. Safe to call multiple times.
 */
function showLoadGameButton() {
  if (!UI.loadGameBtn) return;
  UI.loadGameBtn.classList.remove('hidden');
  // Replace existing listener with a fresh one that reads the latest save
  const freshBtn = UI.loadGameBtn.cloneNode(true);
  UI.loadGameBtn.parentNode.replaceChild(freshBtn, UI.loadGameBtn);
  // Update UI reference to point to the new node
  UI.loadGameBtn = freshBtn;
  UI.loadGameBtn.addEventListener('click', () => {
    const savedGame = loadGameState();
    if (savedGame) {
      restoreGameState(savedGame);
    } else {
      notify(
        {
          title: translations.no_save_title[gameState.currentLanguage],
          body: translations.no_save_body[gameState.currentLanguage],
        },
        'error'
      );
    }
  });
}

/**
 * Initializes the game state based on setup screen settings and transitions to the game screen.
 */
export function initializeGame() {
  if (gameState.playMode !== 'database') {
    notify(
      {
        title:
          gameState.currentLanguage === 'pl' ? 'Wybierz bazę pytań' : 'Select question database',
        body:
          gameState.currentLanguage === 'pl'
            ? "Aby rozpocząć grę, musisz wybrać wbudowaną bazę pytań lub wgrać własny plik w zakładce 'Wybierz Bazę Pytań'."
            : "To start the game, you must select a built-in database or upload your own file under the 'Select Question Database' tab.",
      },
      'error'
    );
    return;
  }
  if (!gameState.loadedDatabase) {
    notify(
      {
        title: gameState.currentLanguage === 'pl' ? 'Brak wczytanej bazy' : 'No database loaded',
        body:
          gameState.currentLanguage === 'pl'
            ? "Proszę wybrać lub wgrać bazę pytań w zakładce 'Wybierz Bazę Pytań'."
            : "Please select or upload a question database under the 'Select Question Database' tab.",
      },
      'error'
    );
    return;
  }

  const playerCount = Number(UI.playerCountInput.value);
  const playerInputs = document.querySelectorAll('#player-names-container > .player-entry');
  const playerNames = Array.from(playerInputs).map((div) => {
    const input = div.querySelector('.player-name-input');
    return input?.value?.trim() || input?.placeholder || '';
  });
  const playerEmojis = Array.from(playerInputs).map(
    (div) => div.querySelector('.emoji-button')?.textContent || ''
  );
  const categories = Array.from(
    document.querySelectorAll('#categories-container .category-input')
  ).map((input) => input.value.trim());

  const setupError = validateGameSetup(playerCount, categories);
  if (setupError === 'player-count') {
    notify(
      {
        title: translations.setup_error_title[gameState.currentLanguage],
        body:
          gameState.currentLanguage === 'pl'
            ? `Liczba graczy musi wynosić od 1 do ${CONFIG.PLAYER_COLORS.length}.`
            : `Player count must be between 1 and ${CONFIG.PLAYER_COLORS.length}.`,
      },
      'error'
    );
    return;
  }

  if (setupError === 'categories') {
    notify(
      {
        title: translations.setup_error_title[gameState.currentLanguage],
        body: translations.min_categories_alert[gameState.currentLanguage],
      },
      'error'
    );
    return;
  }

  setState(
    {
      gameId: generateGameId(),
      players: [],
      categories: categories,
      board: [],
      theme: UI.themeInput.value.trim(),
      includeCategoryTheme: UI.includeThemeToggle.checked,
      mutateCategories: UI.mutateCategoriesToggle.checked,
      currentPlayerIndex: 0,
      isAwaitingMove: false,
      lastAnswerWasCorrect: false,
      isMutationPending: false,
      gameMode: UI.gameModeSelect.value,
      knowledgeLevel: UI.knowledgeLevelSelect.value,
      currentQuestionData: null,
      categoryTopicHistory: readCategoryTopicHistory(),
      possiblePaths: {},
    },
    'state:init'
  );

  const categoryTopicHistory = { ...gameState.categoryTopicHistory };
  gameState.categories.forEach((cat) => {
    if (!categoryTopicHistory[cat]) {
      categoryTopicHistory[cat] = { subcategories: [], entities: [] };
    }
  });

  const players = [];
  for (let i = 0; i < playerCount; i++) {
    players.push({
      name:
        playerNames[i] ||
        (gameState.currentLanguage === 'en' ? `Player ${i + 1}` : `Gracz ${i + 1}`),
      emoji: playerEmojis[i] || CONFIG.EMOJI_OPTIONS[i % CONFIG.EMOJI_OPTIONS.length],
      position: 0,
      color: CONFIG.PLAYER_COLORS[i],
      wedges: [],
    });
  }
  setState({ categoryTopicHistory, players }, 'state:init');

  createBoardLayout();
  renderBoard();
  // createBoardLayout emits while the board DOM is still empty. Notify again
  // after rendering so subscribers create tokens on their initial positions.
  notifyState('state:init-complete');
  UI.rollDiceLabel.textContent = translations.roll_dice_title[gameState.currentLanguage];
  UI.diceElement.disabled = false;
  UI.setupScreen.classList.add('hidden');
  UI.gameScreen.classList.remove('hidden');
  if (UI.generatorLinkBtn) UI.generatorLinkBtn.classList.add('hidden');

  // Save the fresh game state immediately so 'Wczytaj ostatnią grę' works right away
  saveGameState();
  showLoadGameButton();
}

/**
 * Fetches a question from the API and displays it in the question modal.
 * @param {number|null} [forcedCategoryIndex=null] - The index of a category to use.
 */
export async function askQuestion(forcedCategoryIndex = null) {
  const request = ++questionRequest;
  const board = gameState.board;
  answerSubmitted = false;
  setState(
    { currentForcedCategoryIndex: forcedCategoryIndex, currentQuestionData: null },
    'state:question'
  );
  const player = gameState.players[gameState.currentPlayerIndex];
  const square = player && gameState.board.find((s) => s.id === player.position);
  const categoryIndex = forcedCategoryIndex !== null ? forcedCategoryIndex : square?.categoryIndex;
  if (UI.answerInput) UI.answerInput.value = '';

  if (
    !square ||
    !Number.isInteger(categoryIndex) ||
    categoryIndex < 0 ||
    categoryIndex >= gameState.categories.length
  ) {
    console.error('Invalid category index on the current square:', square);
    nextTurn();
    return;
  }

  const category = gameState.categories[categoryIndex];
  const categoryColor = CONFIG.CATEGORY_COLORS[categoryIndex];

  UI.questionCategoryH3.textContent = category;
  UI.modalContent.style.borderTopColor = categoryColor;
  const questionPlayer = UI.modalContent.querySelector('#question-player');
  if (questionPlayer) {
    questionPlayer.textContent = translations.answering_player[gameState.currentLanguage]
      .replace('{player}', `${player.emoji} ${player.name}`);
  }

  showModal(true);
  UI.llmLoader.classList.remove('hidden');
  UI.questionContent.classList.add('hidden');
  // Restore any answer buttons moved into the previous reading deck before
  // clearing their source container.
  clearQuestionReadingCards();
  UI.mcqOptionsContainer.innerHTML = '';

  try {
    const api = getApiAdapter();
    const data = await api.generateQuestion(category);
    if (request !== questionRequest || board !== gameState.board) return;
    if (!data || typeof data.question !== 'string' || !data.question.trim()) {
      throw new Error(translations.question_generation_error[gameState.currentLanguage]);
    }
    if (typeof data.answer !== 'string' || !data.answer.trim()) {
      throw new Error(translations.question_generation_error[gameState.currentLanguage]);
    }
    const options = data.options ?? [];
    const multipleChoiceMode = gameState.gameMode === 'mcq';
    if (multipleChoiceMode && (!Array.isArray(options) || options.length === 1)) {
      throw new Error(translations.question_generation_error[gameState.currentLanguage]);
    }
    const useMultipleChoice = multipleChoiceMode && options.length > 0;

    setState({ currentQuestionData: data }, 'state:question');
    recordQuestionHistory(data, category);
    UI.questionTextP.textContent = data.question;

    const readingItems = [
      {
        kind: 'text',
        node: UI.questionTextP,
        template: UI.questionTextP,
        text: data.question,
        labelNode: undefined,
        sectionKey: 'reading_question_label',
      },
    ];

    if (useMultipleChoice) {
      UI.answerSection.classList.add('hidden');
      UI.mcqOptionsContainer.classList.remove('hidden');
      shuffleAnswerOptions(options).forEach((option, index) => {
        const button = document.createElement('button');
        button.className =
          'w-full p-3 text-center bg-gray-100 hover:bg-indigo-100 rounded-lg transition-colors flex justify-center items-center';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => handleMcqAnswer(option);
        UI.mcqOptionsContainer.appendChild(button);
        readingItems.push({
          kind: 'action',
          node: button,
          text: `${String.fromCharCode(65 + index)}. ${option}`,
          optionLabel: String.fromCharCode(65 + index),
          labelNode: undefined,
          sectionKey: 'reading_choices_label',
        });
      });
    } else {
      UI.answerSection.classList.remove('hidden');
      UI.mcqOptionsContainer.classList.add('hidden');
      readingItems.push({
        kind: 'node',
        node: UI.answerSection,
        template: UI.answerSection,
        text: UI.answerSection.textContent,
        split: false,
        labelNode: makeReadingSectionLabel('reading_answer_label'),
        sectionKey: 'reading_answer_label',
      });
    }
    setQuestionReadingItems(readingItems);
    UI.questionContent.classList.remove('hidden');
    UI.llmLoader.classList.add('hidden');
    await refreshQuestionReadingCards();
    if (request !== questionRequest || board !== gameState.board) return;
    if (!useMultipleChoice) {
      UI.answerInput.focus?.({ preventScroll: true });
    }

    if (api && api.preloadQuestions) {
      console.log('Triggering question preload while player is thinking...');
      api.preloadQuestions();
    }
  } catch (error) {
    if (request !== questionRequest || board !== gameState.board) return;
    console.error('Question generation error:', error);
    const errorMessage =
      error.message || translations.question_generation_error[gameState.currentLanguage];
    notify(
      { title: translations.api_error[gameState.currentLanguage], body: errorMessage },
      'error'
    );

    setState({ currentQuestionData: null }, 'state:question');
    UI.llmLoader.classList.add('hidden');
    UI.questionContent.classList.add('hidden');
    hideModal();
    UI.diceElement.disabled = false;
    UI.rollDiceLabel.textContent = translations.roll_again[gameState.currentLanguage];
    UI.gameMessageDiv.textContent = translations.roll_error_message[gameState.currentLanguage];
  }
}

/**
 * Rolls once and exposes the same destinations on the board and in the turn panel.
 */
export async function rollDice() {
  if (UI.diceElement.disabled || gameState.isAwaitingMove) return;
  const board = gameState.board;
  if (!gameState.players?.length || !board?.length) return;

  UI.diceElement.disabled = true;
  UI.gameMessageDiv.textContent = '';
  const roll = Math.floor(Math.random() * 6) + 1;
  await animateDiceRoll(roll);
  if (board !== gameState.board) return;

  const lang = gameState.currentLanguage;
  const result = translations.dice_roll_result[lang].replace('{roll}', roll);
  const player = gameState.players[gameState.currentPlayerIndex];
  const possiblePaths = findPossibleMoves(player.position, roll);
  const destinationIds = Object.keys(possiblePaths);
  if (!destinationIds.length) {
    nextTurn();
    return;
  }

  UI.rollDiceLabel.textContent = result;
  UI.gameMessageDiv.textContent = translations.choose_move[lang];
  setState({ possiblePaths, isAwaitingMove: true }, 'state:move');
  renderAvailableMoves(destinationIds);
}

/**
 * Handles a player's click on a board square to move their token.
 * @param {number} squareId - The ID of the clicked square.
 */
export async function handleSquareClick(squareId) {
  if (!gameState.isAwaitingMove) return;

  const path = gameState.possiblePaths[squareId];
  if (!path) return;

  const board = gameState.board;
  setState({ isAwaitingMove: false, possiblePaths: {} }, 'state:move');
  renderAvailableMoves();
  UI.gameMessageDiv.textContent = '';

  await animatePawnMovement(path.slice(1));
  if (board !== gameState.board) return;

  const players = [...gameState.players];
  const currentPlayer = players[gameState.currentPlayerIndex];
  players[gameState.currentPlayerIndex] = { ...currentPlayer, position: squareId };
  setState({ players });

  // Auto-save position update immediately so restore always reflects current position
  saveGameState();

  const landedSquare = gameState.board.find((s) => s.id === squareId);
  if (landedSquare.type === CONFIG.SQUARE_TYPES.ROLL_AGAIN) {
    UI.rollDiceLabel.textContent =
      translations.roll_again[gameState.currentLanguage];
    UI.diceElement.disabled = false;
    UI.diceElement.focus({ preventScroll: true });
  } else if (landedSquare.type === CONFIG.SQUARE_TYPES.HUB) {
    promptCategoryChoice();
  } else {
    askQuestion();
  }
}

/**
 * Proceeds to the next player's turn.
 */
export function nextTurn() {
  if (!gameState.players?.length) return;
  const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  setState({ currentPlayerIndex: nextIndex });

  UI.rollDiceLabel.textContent = translations.roll_dice_title[gameState.currentLanguage];
  UI.diceElement.disabled = false;
  saveGameState();
}

/**
 * Checks if a player has met the win condition (collected all 6 wedges).
 */
export function checkWinCondition() {
  const winner = gameState.players.find(
    (p) => new Set(p.wedges).size === gameState.categories.length
  );
  if (!winner) return;
  UI.gameScreen.classList.add('hidden');
  UI.winnerScreen.classList.remove('hidden');
  UI.winnerNameSpan.textContent = winner.name;
  UI.winnerScores.textContent = '';
  const lang = gameState.currentLanguage;
  for (const player of gameState.players) {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = `${player.emoji} ${player.name}`;
    const progress = document.createElement('strong');
    const count = new Set(player.wedges).size;
    progress.textContent = `${count}/${gameState.categories.length}`;
    progress.setAttribute('aria-label', translations.wedge_progress[lang]
      .replace('{count}', count).replace('{total}', gameState.categories.length));
    row.append(name, progress);
    UI.winnerScores.appendChild(row);
  }
  UI.playAgainBtn.focus({ preventScroll: true });
}

function reviewSubmittedAnswer(playerAnswer, initialVerdict = null) {
  const question = gameState.currentQuestionData;
  if (!question || answerSubmitted) return;
  answerSubmitted = true;
  hideModal();
  setTimeout(() => {
    if (gameState.currentQuestionData === question) {
      showVerificationPopup(playerAnswer, question.answer, initialVerdict);
    }
  }, 300);
}

/**
 * Handles an answer submission in Multiple Choice Question (MCQ) mode.
 */
export function handleMcqAnswer(selectedOption) {
  const question = gameState.currentQuestionData;
  if (question) reviewSubmittedAnswer(selectedOption, getChoiceVerdict(question, selectedOption));
}

/**
 * Handles an answer submission in open-ended answer mode.
 */
export function handleOpenAnswer() {
  const userAnswer = UI.answerInput.value.trim();
  if (!userAnswer) {
    notify(
      {
        title: translations.input_error_title[gameState.currentLanguage],
        body: translations.empty_answer_error[gameState.currentLanguage],
      },
      'error'
    );
    return;
  }
  reviewSubmittedAnswer(userAnswer);
}

function getAnswerContext() {
  const player = gameState.players[gameState.currentPlayerIndex];
  const square = gameState.board.find((s) => s.id === player.position);
  const categoryIndex =
    gameState.currentForcedCategoryIndex !== null
      ? gameState.currentForcedCategoryIndex
      : square.categoryIndex;
  const isHqSquare = square.type === CONFIG.SQUARE_TYPES.HQ;
  const availableWedge = isHqSquare && !player.wedges.includes(categoryIndex) ? categoryIndex : null;
  return { player, categoryIndex, isHqSquare, availableWedge };
}

export function previewAnswerOutcome(isCorrect) {
  const { player, availableWedge } = getAnswerContext();
  const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  const earnedWedge = isCorrect && availableWedge !== null;
  return {
    player: isCorrect ? player.name : gameState.players[nextIndex].name,
    category: earnedWedge ? gameState.categories[availableWedge] : null,
    wins: earnedWedge && new Set(player.wedges).size + 1 === gameState.categories.length,
  };
}

/** Commits the final verdict after the player confirms it. */
export function commitAnswerVerdict(isCorrect) {
  const { player, categoryIndex, isHqSquare, availableWedge } = getAnswerContext();
  const players = [...gameState.players];
  if (isCorrect && availableWedge !== null) {
    players[gameState.currentPlayerIndex] = { ...player, wedges: [...player.wedges, availableWedge] };
  }
  setState({
    players,
    lastAnswerWasCorrect: isCorrect,
    isMutationPending: isCorrect && isHqSquare && gameState.mutateCategories,
  }, 'state:verification');

  if (categoryIndex !== null && gameState.currentQuestionData.subcategory) {
    const oldCategory = gameState.categories[categoryIndex];
    const categoryTopicHistory = { ...gameState.categoryTopicHistory };
    if (!categoryTopicHistory[oldCategory] || Array.isArray(categoryTopicHistory[oldCategory])) {
      categoryTopicHistory[oldCategory] = { subcategories: [], entities: [] };
    }

    const history = categoryTopicHistory[oldCategory];
    const newSubcategory = gameState.currentQuestionData.subcategory;
    if (!history.subcategories.includes(newSubcategory)) {
      history.subcategories.push(newSubcategory);
    }
    if (Array.isArray(gameState.currentQuestionData.key_entities)) {
      gameState.currentQuestionData.key_entities.forEach((entity) => {
        if (!history.entities.includes(entity)) {
          history.entities.push(entity);
        }
      });
    }

    if (history.subcategories.length > CONFIG.MAX_SUBCATEGORY_HISTORY_ITEMS) {
      history.subcategories = history.subcategories.slice(-CONFIG.MAX_SUBCATEGORY_HISTORY_ITEMS);
    }
    if (history.entities.length > CONFIG.MAX_ENTITY_HISTORY_ITEMS) {
      history.entities = history.entities.slice(-CONFIG.MAX_ENTITY_HISTORY_ITEMS);
    }

    setState({ categoryTopicHistory }, 'state:history');
    try {
      localStorage.setItem('globalQuizHistory', JSON.stringify(categoryTopicHistory));
    } catch (error) {
      console.warn('Could not save topic history.', error);
    }
  }
}

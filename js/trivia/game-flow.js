/**
 * @file game-flow.js
 * Core game flow, state updates, and UI orchestration.
 */

import { CONFIG, translations } from './config.js';
import { gameState, setState } from './state.js';
import { UI } from './dom.js';
import { createBoardLayout, findPossibleMoves } from './board.js';
import { promptCategoryChoice, hideModal, showVerificationPopup, showModal } from './ui.js';
import { renderBoard, animateDiceRoll, animatePawnMovement } from './ui-board.js';
import { renderExplanation } from './explanations.js';
import { saveGameState, loadGameState, restoreGameState } from './persistence.js';
import { notify } from './error-bus.js';
import { getApiAdapter } from './services/api-service.js';

function generateGameId() {
  return 'game-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
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

  const playerCount = parseInt(UI.playerCountInput.value);
  const playerInputs = document.querySelectorAll('#player-names-container > .player-entry');
  const playerNames = Array.from(playerInputs).map(
    (div) =>
      div.querySelector('.player-name-input').value ||
      div.querySelector('.player-name-input').placeholder
  );
  const playerEmojis = Array.from(playerInputs).map(
    (div) => div.querySelector('.emoji-button').textContent
  );
  const categories = Array.from(
    document.querySelectorAll('#categories-container .category-input')
  ).map((input) => input.value.trim());

  if (categories.some((c) => c === '')) {
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
      categoryTopicHistory: JSON.parse(localStorage.getItem('globalQuizHistory')) || {},
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
      name: playerNames[i],
      emoji: playerEmojis[i],
      position: 0,
      color: CONFIG.PLAYER_COLORS[i],
      wedges: [],
    });
  }
  setState({ categoryTopicHistory, players }, 'state:init');

  createBoardLayout();
  renderBoard();
  UI.diceResultDiv.classList.add('hint-pulsate');
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
  setState({ currentForcedCategoryIndex: forcedCategoryIndex }, 'state:question');
  const player = gameState.players[gameState.currentPlayerIndex];
  const square = gameState.board.find((s) => s.id === player.position);
  const categoryIndex = forcedCategoryIndex !== null ? forcedCategoryIndex : square.categoryIndex;

  if (categoryIndex === null || categoryIndex === undefined) {
    console.error('Invalid category index on the current square:', square);
    nextTurn();
    return;
  }

  const category = gameState.categories[categoryIndex];
  const categoryColor = CONFIG.CATEGORY_COLORS[categoryIndex];

  UI.questionCategoryH3.textContent = translations.category_title[
    gameState.currentLanguage
  ].replace('{category}', category);
  UI.questionCategoryH3.style.color = categoryColor;
  UI.modalContent.style.borderTopColor = categoryColor;

  showModal(true);
  UI.llmLoader.classList.remove('hidden');
  UI.questionContent.classList.add('hidden');
  UI.mcqOptionsContainer.innerHTML = '';

  try {
    const api = getApiAdapter();
    const data = await api.generateQuestion(category);
    setState({ currentQuestionData: data }, 'state:question');
    UI.questionTextP.textContent = data.question;

    if (gameState.gameMode === 'mcq') {
      UI.answerSection.classList.add('hidden');
      UI.mcqOptionsContainer.classList.remove('hidden');
      data.options.forEach((option) => {
        const button = document.createElement('button');
        button.className =
          'w-full p-3 text-center bg-gray-100 hover:bg-indigo-100 rounded-lg transition-colors flex justify-center items-center';
        button.innerHTML = `<span>${option}</span>`;
        button.onclick = () => handleMcqAnswer(option);
        UI.mcqOptionsContainer.appendChild(button);
      });
    } else {
      UI.answerSection.classList.remove('hidden');
      UI.mcqOptionsContainer.classList.add('hidden');
      UI.answerInput.focus();
    }
    UI.questionContent.classList.remove('hidden');
    UI.llmLoader.classList.add('hidden');

    if (api && api.preloadQuestions) {
      console.log('Triggering question preload while player is thinking...');
      api.preloadQuestions();
    }
  } catch (error) {
    console.error('Question generation error:', error);
    const errorMessage =
      error.message || translations.question_generation_error[gameState.currentLanguage];
    notify(
      { title: translations.api_error[gameState.currentLanguage], body: errorMessage },
      'error'
    );

    UI.llmLoader.classList.add('hidden');
    UI.questionTextP.textContent =
      translations.question_generation_error[gameState.currentLanguage];
    UI.questionContent.classList.remove('hidden');
    setTimeout(() => {
      hideModal();
      UI.diceElement.disabled = false;
      UI.gameMessageDiv.textContent = translations.roll_error_message[gameState.currentLanguage];
    }, 10000);
  }
}

/**
 * Handles the dice roll action, calculates possible moves, and highlights them.
 */
export async function rollDice() {
  UI.diceResultDiv.classList.remove('hint-pulsate');
  if (UI.diceElement.disabled || gameState.isAwaitingMove) return;

  UI.diceElement.disabled = true;
  UI.gameMessageDiv.textContent = '';
  const roll = Math.floor(Math.random() * 6) + 1;

  await animateDiceRoll(roll);

  UI.diceResultDiv.querySelector('span').textContent = translations.dice_roll_result[
    gameState.currentLanguage
  ].replace('{roll}', roll);

  const player = gameState.players[gameState.currentPlayerIndex];
  const possiblePaths = findPossibleMoves(player.position, roll);
  setState({ possiblePaths }, 'state:move');

  const destinationIds = Object.keys(possiblePaths);

  if (destinationIds.length > 0) {
    setState({ isAwaitingMove: true }, 'state:move');
    UI.gameMessageDiv.textContent = translations.choose_move[gameState.currentLanguage];

    // Clear any orphaned labels first
    document.querySelectorAll('.move-category-label').forEach((label) => label.remove());

    destinationIds.forEach((id) => {
      const el = document.getElementById(`square-${id}`);
      if (el) {
        el.classList.add('highlighted-move');

        const square = gameState.board.find((s) => s.id === parseInt(id));
        if (square) {
          let categoryName = '';
          if (square.type === CONFIG.SQUARE_TYPES.HUB) {
            categoryName =
              gameState.currentLanguage === 'pl' ? 'Wybierz kategorię' : 'Choose category';
          } else if (square.type === CONFIG.SQUARE_TYPES.ROLL_AGAIN) {
            categoryName = translations.roll_again[gameState.currentLanguage];
          } else if (square.categoryIndex !== null && square.categoryIndex !== undefined) {
            categoryName = gameState.categories[square.categoryIndex];
          }

          if (categoryName) {
            const label = document.createElement('span');
            label.className = 'move-category-label';
            label.textContent = categoryName;

            const dx = square.pos.x - 50;
            const dy = square.pos.y - 50;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let labelX = square.pos.x;
            let labelY = square.pos.y;

            if (dist > 0) {
              const ux = dx / dist;
              const uy = dy / dist;
              labelX += ux * 6.5;
              labelY += uy * 6.5;
            } else {
              labelY += 6.5;
            }

            label.style.left = `${labelX}%`;
            label.style.top = `${labelY}%`;
            UI.boardElement.appendChild(label);
          }
        }
      }
    });
  } else {
    nextTurn();
  }
}

/**
 * Handles a player's click on a board square to move their token.
 * @param {number} squareId - The ID of the clicked square.
 */
export async function handleSquareClick(squareId) {
  if (!gameState.isAwaitingMove) return;

  const path = gameState.possiblePaths[squareId];
  if (!path) return;

  document
    .querySelectorAll('.highlighted-move')
    .forEach((el) => el.classList.remove('highlighted-move'));
  document.querySelectorAll('.move-category-label').forEach((label) => label.remove());
  setState({ isAwaitingMove: false }, 'state:move');
  UI.gameMessageDiv.textContent = '';

  await animatePawnMovement(path.slice(1));

  const players = [...gameState.players];
  const currentPlayer = players[gameState.currentPlayerIndex];
  players[gameState.currentPlayerIndex] = { ...currentPlayer, position: squareId };
  setState({ players });

  // Auto-save position update immediately so restore always reflects current position
  saveGameState();

  const landedSquare = gameState.board.find((s) => s.id === squareId);
  if (landedSquare.type === CONFIG.SQUARE_TYPES.ROLL_AGAIN) {
    UI.diceResultDiv.querySelector('span').textContent =
      translations.roll_again[gameState.currentLanguage];
    UI.diceElement.disabled = false;
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
  const nextIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  setState({ currentPlayerIndex: nextIndex });

  UI.diceResultDiv.querySelector('span').textContent =
    translations.roll_to_start[gameState.currentLanguage];
  UI.diceElement.disabled = false;
  saveGameState();
  UI.diceResultDiv.classList.add('hint-pulsate');
}

/**
 * Checks if a player has met the win condition (collected all 6 wedges).
 */
export function checkWinCondition() {
  const winner = gameState.players.find(
    (p) => new Set(p.wedges).size === gameState.categories.length
  );
  if (winner) {
    UI.gameScreen.classList.add('hidden');
    UI.winnerScreen.classList.remove('hidden');
    UI.winnerNameSpan.textContent = winner.name;
  }
}

/**
 * Handles an answer submission in Multiple Choice Question (MCQ) mode.
 * @param {string} selectedOption - The text of the selected answer option.
 */
export function handleMcqAnswer(selectedOption) {
  hideModal();
  setTimeout(
    () => showVerificationPopup(selectedOption, gameState.currentQuestionData.answer),
    300
  );
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
  hideModal();
  setTimeout(() => showVerificationPopup(userAnswer, gameState.currentQuestionData.answer), 300);
}

/**
 * Processes the result of a manual answer verification (correct/incorrect).
 * @param {boolean} isCorrect - Whether the player's answer was deemed correct.
 */
export async function handleManualVerification(isCorrect) {
  setState({ lastAnswerWasCorrect: isCorrect }, 'state:verification');

  const player = gameState.players[gameState.currentPlayerIndex];
  const square = gameState.board.find((s) => s.id === player.position);
  const categoryIndex =
    gameState.currentForcedCategoryIndex !== null
      ? gameState.currentForcedCategoryIndex
      : square.categoryIndex;
  const isHqSquare = square.type === CONFIG.SQUARE_TYPES.HQ;

  if (isCorrect && isHqSquare && !player.wedges.includes(categoryIndex)) {
    const players = [...gameState.players];
    const updatedPlayer = { ...player, wedges: [...player.wedges, categoryIndex] };
    players[gameState.currentPlayerIndex] = updatedPlayer;
    setState({ players }, 'state:verification');
  }

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
    localStorage.setItem('globalQuizHistory', JSON.stringify(categoryTopicHistory));
  }

  setState(
    { isMutationPending: isCorrect && isHqSquare && gameState.mutateCategories },
    'state:verification'
  );

  UI.verificationButtons.classList.add('hidden');
  UI.postVerificationButtons.classList.remove('hidden');

  if (isCorrect) {
    UI.closePopupBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700', 'active:bg-gray-850');
    UI.closePopupBtn.classList.add('bg-green-600', 'hover:bg-green-700', 'active:bg-green-800');
  } else {
    UI.closePopupBtn.classList.remove('bg-green-600', 'hover:bg-green-700', 'active:bg-green-800');
    UI.closePopupBtn.classList.add('bg-gray-600', 'hover:bg-gray-700', 'active:bg-gray-800');
  }

  renderExplanation({
    questionData: gameState.currentQuestionData,
    lang: gameState.currentLanguage,
    containerEl: UI.explanationContainer,
    textEl: UI.explanationText,
    isCorrect,
  });
}

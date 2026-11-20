/**
 * @file ui-modals.js
 * Modal and popup rendering for trivia UI.
 */

import { CONFIG, translations } from './config.js';
import { gameState, setState } from './state.js';
import { UI } from './dom.js';
import { renderExplanation } from './explanations.js';
import { clearAnswerReadingCards, refreshAnswerReadingCards } from './reading-cards.js';
import { uiHandlers } from './ui-handlers.js';
import { saveGameState } from './persistence.js';
import { notify } from './error-bus.js';
import { getApiAdapter } from './services/api-service.js';
import { emit } from './store.js';

// undefined means the review is closed; null means an open review needs a ruling.
let pendingVerdict;

/**
 * Displays the modal for choosing a category (used when on the HUB square).
 */
export function promptCategoryChoice() {
  UI.categoryChoiceButtons.innerHTML = '';
  gameState.categories.forEach((cat, index) => {
    const button = document.createElement('button');
    button.textContent = cat;
    button.className =
      'w-full p-3 text-white font-semibold rounded-lg transition-transform hover:scale-105';
    button.style.backgroundColor = CONFIG.CATEGORY_COLORS[index];
    button.onclick = () => {
      UI.categoryChoiceModal.classList.remove('visible');
      if (typeof uiHandlers.askQuestion === 'function') {
        uiHandlers.askQuestion(index);
      }
    };
    UI.categoryChoiceButtons.appendChild(button);
  });
  UI.categoryChoiceModal.classList.add('visible');
}

/**
 * Displays the popup for answer verification.
 * @param {string} playerAnswer - The player's submitted answer.
 * @param {string} correctAnswer - The correct answer from the question data.
 */
export function showVerificationPopup(playerAnswer, correctAnswer, initialVerdict = null) {
  clearAnswerReadingCards();
  UI.playerAnswerText.textContent = playerAnswer;
  UI.correctAnswerText.textContent = correctAnswer;
  setState({ currentPlayerAnswer: playerAnswer }, 'state:verification');

  UI.explanationContainer.classList.add('hidden');
  UI.incorrectExplanationContainer.classList.add('hidden');
  UI.verifyAnswerBtn.classList.add('hidden');
  UI.incorrectExplanationText.innerHTML = '';
  if (UI.llmEvaluationContainer) {
    UI.llmEvaluationContainer.classList.add('hidden');
    UI.llmEvaluationText.innerHTML = '';
  }

  UI.explanationText.innerHTML = '';

  const answersMatch = playerAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

  // A textual mismatch does not determine the outcome of manual assessment.
  UI.playerAnswerText.classList.remove('bg-red-100', 'bg-green-100');
  UI.playerAnswerText.classList.add('bg-gray-100');
  UI.correctAnswerText.classList.remove('bg-gray-100', 'bg-red-100');
  UI.correctAnswerText.classList.add('bg-green-100');
  if (!answersMatch) {
    UI.incorrectExplanationContainer.classList.remove('hidden');
    const api = getApiAdapter();
    const canVerify = api && typeof api.getIncorrectAnswerExplanation === 'function';
    UI.verifyAnswerBtn.classList.toggle('hidden', !canVerify);
  }

  pendingVerdict = initialVerdict;
  updateAnswerReview();
  showAnswerPopup();
}

function updateAnswerReview() {
  const lang = gameState.currentLanguage;
  const hasVerdict = typeof pendingVerdict === 'boolean';
  const title = hasVerdict
    ? (pendingVerdict ? 'answer_correct_result' : 'answer_incorrect_result')
    : 'answer_evaluation';
  UI.answerPopupTitle.textContent = translations[title][lang];
  UI.verificationButtons.classList.toggle('hidden', hasVerdict);
  UI.postVerificationButtons.classList.toggle('hidden', !hasVerdict);
  UI.changeVerdictBtn.classList.toggle('hidden', !hasVerdict);

  const outcome = hasVerdict ? uiHandlers.previewAnswerOutcome(pendingVerdict) : null;
  const messages = [];
  if (outcome) {
    if (outcome.category) messages.push(translations.wedge_awarded[lang].replace('{category}', outcome.category));
    const nextAction = outcome.wins ? 'wins_game' : 'rolls_next';
    messages.push(translations[nextAction][lang].replace('{player}', outcome.player));
  }
  UI.answerOutcome.textContent = messages.join(' • ');
  UI.answerOutcome.classList.toggle('hidden', !outcome);

  renderExplanation({
    questionData: gameState.currentQuestionData,
    lang,
    containerEl: UI.explanationContainer,
    textEl: UI.explanationText,
    isCorrect: pendingVerdict,
  });
}

export function setAnswerVerdict(verdict) {
  if (pendingVerdict === undefined) return;
  pendingVerdict = verdict;
  updateAnswerReview();
  const focusTarget = verdict === null ? UI.answerPopupTitle : UI.closePopupBtn;
  focusTarget.focus({ preventScroll: true });
}

function showAnswerPopup() {
  UI.answerPopup.classList.remove('hidden');
  const focusTarget = typeof pendingVerdict === 'boolean' ? UI.closePopupBtn : UI.answerPopupTitle;
  focusTarget.focus({ preventScroll: true });
  // The deck is hidden until this point, so measure only after the popup is
  // visible and its responsive dimensions have settled.
  refreshAnswerReadingCards();
  setTimeout(() => {
    UI.answerPopup.classList.remove('opacity-0', 'scale-90');
  }, 10);
}

/**
 * A helper function to handle the UI transition to the mutation screen.
 */
async function showMutationScreen() {
  UI.standardPopupContent.classList.add('hidden');
  UI.mutationContent.classList.remove('hidden');
  UI.mutationLoader.classList.remove('hidden');
  UI.mutationButtons.classList.add('hidden');
  UI.postVerificationButtons.classList.add('hidden');
  UI.mutationContent.querySelector('h3').textContent =
    translations.choose_mutation_title[gameState.currentLanguage];

  const player = gameState.players[gameState.currentPlayerIndex];
  const square = gameState.board.find((s) => s.id === player.position);
  const categoryIndex =
    gameState.currentForcedCategoryIndex !== null
      ? gameState.currentForcedCategoryIndex
      : square.categoryIndex;

  try {
    const oldCategory = gameState.categories[categoryIndex];
    const otherCategories = gameState.categories.filter((c, i) => i !== categoryIndex);
    const api = getApiAdapter();
    const choices = await api.getCategoryMutationChoices(oldCategory, otherCategories);
    if (!choices.length) {
      finishAnswerReview();
      return;
    }

    UI.mutationLoader.classList.add('hidden');
    UI.mutationButtons.classList.remove('hidden');
    UI.mutationButtons.innerHTML = '';

    choices.forEach((choice) => {
      const button = document.createElement('button');
      button.className =
        'w-full p-4 text-white rounded-lg transition-transform hover:scale-105 text-left themed-button';
      button.style.backgroundColor = CONFIG.CATEGORY_COLORS[categoryIndex];
      button.innerHTML = `<span class="block font-bold text-lg">${choice.name || ''}</span><p class="text-sm font-normal opacity-90 mt-1">${choice.description || ''}</p>`;

      button.onclick = () => {
        if (UI.mutationContent.classList.contains('hidden')) return;
        const newCategoryName = choice.name;
        gameState.categories[categoryIndex] = newCategoryName;

        delete gameState.categoryTopicHistory[oldCategory];
        if (!gameState.categoryTopicHistory[newCategoryName]) {
          gameState.categoryTopicHistory[newCategoryName] = { subcategories: [], entities: [] };
        }
        notify(
          {
            title: translations.category_mutated[gameState.currentLanguage],
            body: translations.new_category_msg[gameState.currentLanguage]
              .replace('{old_cat}', oldCategory)
              .replace('{new_cat}', newCategoryName),
          },
          'info'
        );

        finishAnswerReview();
      };
      UI.mutationButtons.appendChild(button);
    });
  } catch (error) {
    console.error('Category mutation failed:', error);
    notify(
      {
        title: translations.api_error[gameState.currentLanguage],
        body: translations.mutation_failed[gameState.currentLanguage],
      },
      'error'
    );
    finishAnswerReview();
  }
}

/**
 * Closes the answer verification popup and continues the game.
 */
export function closePopupAndContinue() {
  if (typeof pendingVerdict !== 'boolean') return;
  const verdict = pendingVerdict;
  pendingVerdict = undefined;
  uiHandlers.commitAnswerVerdict(verdict);
  if (gameState.isMutationPending) {
    setState({ isMutationPending: false }, 'state:verification');
    showMutationScreen();
    return;
  }
  finishAnswerReview();
}

function finishAnswerReview() {
  UI.answerPopup.classList.add('hidden', 'opacity-0');
  UI.standardPopupContent.classList.remove('hidden');
  UI.mutationContent.classList.add('hidden');
  UI.postVerificationButtons.classList.add('hidden');

  if (gameState.lastAnswerWasCorrect) {
    UI.rollDiceLabel.textContent = translations.roll_again[gameState.currentLanguage];
    UI.diceElement.disabled = false;
  } else {
    uiHandlers.nextTurn();
  }
  emit('state:update');
  uiHandlers.checkWinCondition();
  saveGameState();
  if (!UI.gameScreen.classList.contains('hidden')) UI.diceElement.focus({ preventScroll: true });
}

/**
 * Shows or hides the main question modal.
 * @param {boolean} show - True to show, false to hide.
 */
export function showModal(show) {
  UI.modalContent.inert = !show;
  if (show) {
    UI.questionModal.classList.add('visible');
    setTimeout(() => UI.modalContent.classList.remove('scale-95', 'opacity-0'), 10);
  } else {
    UI.modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => UI.questionModal.classList.remove('visible'), 300);
  }
}

/**
 * A convenience function to hide the question modal with proper cleanup.
 */
export function hideModal() {
  showModal(false);
  setTimeout(() => {
    if (UI.modalContent) UI.modalContent.style.borderTopColor = 'transparent';
  }, 300);
}

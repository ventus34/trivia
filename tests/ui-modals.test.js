import { describe, expect, it, vi } from 'vitest';

const { UI, gameState } = vi.hoisted(() => {
  const makeClassList = (classes = []) => {
    const values = new Set(classes);
    return {
      add: (...names) => names.forEach((name) => values.add(name)),
      remove: (...names) => names.forEach((name) => values.delete(name)),
      toggle: (name, force) => {
        if (force ?? !values.has(name)) values.add(name);
        else values.delete(name);
      },
      contains: (name) => values.has(name),
    };
  };
  const element = (classes = []) => ({
    classList: makeClassList(classes),
    textContent: '',
    innerHTML: '',
  });

  return {
    gameState: { currentLanguage: 'en', currentQuestionData: { explanation: 'Why.' } },
    UI: {
      playerAnswerText: element(['bg-gray-100']),
      correctAnswerText: element(['bg-green-100']),
      explanationContainer: element(['hidden']),
      explanationText: element(['bg-yellow-100']),
      incorrectExplanationContainer: element(['hidden']),
      incorrectExplanationText: element(),
      verifyAnswerBtn: element(),
      llmEvaluationContainer: element(['hidden']),
      llmEvaluationText: element(),
      verificationButtons: element(['hidden']),
      postVerificationButtons: element(),
      closePopupBtn: { ...element(), focus: vi.fn() },
      changeVerdictBtn: element(['hidden']),
      answerOutcome: element(['hidden']),
      answerPopupTitle: { ...element(), focus: vi.fn() },
      answerPopup: element(['hidden']),
      standardPopupContent: element(),
      mutationContent: element(['hidden']),
      gameScreen: element(),
      diceElement: { ...element(), focus: vi.fn() },
      rollDiceLabel: element(),
    },
  };
});

vi.mock('../js/trivia/config.js', () => ({
  CONFIG: {},
  translations: {
    answer_evaluation: { en: 'Answer evaluation' },
    answer_correct_result: { en: 'Correct answer' },
    answer_incorrect_result: { en: 'Incorrect answer' },
    wedge_awarded: { en: 'Wedge earned · {category}' },
    rolls_next: { en: '{player} rolls next' },
  },
}));
vi.mock('../js/trivia/state.js', () => ({ gameState, setState: vi.fn() }));
vi.mock('../js/trivia/dom.js', () => ({ UI }));
vi.mock('../js/trivia/explanations.js', () => ({ renderExplanation: vi.fn() }));
vi.mock('../js/trivia/reading-cards.js', () => ({
  clearAnswerReadingCards: vi.fn(),
  refreshAnswerReadingCards: vi.fn(),
}));
vi.mock('../js/trivia/ui-handlers.js', () => ({
  uiHandlers: {
    previewAnswerOutcome: (verdict) => ({ player: verdict ? 'Alice' : 'Bob', category: verdict ? 'Science' : null }),
    commitAnswerVerdict: vi.fn(),
    nextTurn: vi.fn(),
    checkWinCondition: vi.fn(),
  },
}));
vi.mock('../js/trivia/persistence.js', () => ({ saveGameState: vi.fn() }));
vi.mock('../js/trivia/error-bus.js', () => ({ notify: vi.fn() }));
vi.mock('../js/trivia/services/api-service.js', () => ({ getApiAdapter: () => null }));
vi.mock('../js/trivia/store.js', () => ({ emit: vi.fn() }));

import { closePopupAndContinue, setAnswerVerdict, showVerificationPopup } from '../js/trivia/ui-modals.js';
import { uiHandlers } from '../js/trivia/ui-handlers.js';

describe('answer verification colors', () => {
  it('keeps the canonical answer green and the player answer neutral before manual review', () => {
    showVerificationPopup('player response', 'canonical answer');

    expect(UI.playerAnswerText.classList.contains('bg-gray-100')).toBe(true);
    expect(UI.correctAnswerText.classList.contains('bg-green-100')).toBe(true);
    expect(UI.correctAnswerText.classList.contains('bg-red-100')).toBe(false);
    expect(UI.answerPopupTitle.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('shows an automatic ruling, lets the host override it, and commits once on continue', () => {
    showVerificationPopup('answer', 'answer', true);
    expect(UI.answerOutcome.textContent).toBe('Wedge earned · Science • Alice rolls next');
    expect(uiHandlers.commitAnswerVerdict).not.toHaveBeenCalled();

    setAnswerVerdict(null);
    closePopupAndContinue();
    expect(uiHandlers.commitAnswerVerdict).not.toHaveBeenCalled();

    setAnswerVerdict(false);
    expect(UI.answerOutcome.textContent).toBe('Bob rolls next');
    closePopupAndContinue();
    closePopupAndContinue();
    expect(uiHandlers.commitAnswerVerdict.mock.calls).toEqual([[false]]);
    expect(uiHandlers.nextTurn).toHaveBeenCalledOnce();
  });
});

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
      closePopupBtn: element(['bg-green-600', 'hover:bg-green-700', 'active:bg-green-800']),
      answerPopupTitle: element(),
      answerPopup: element(['hidden']),
    },
  };
});

vi.mock('../js/trivia/config.js', () => ({
  CONFIG: {},
  translations: { answer_evaluation: { en: 'Answer evaluation' } },
}));
vi.mock('../js/trivia/state.js', () => ({ gameState, setState: vi.fn() }));
vi.mock('../js/trivia/dom.js', () => ({ UI }));
vi.mock('../js/trivia/explanations.js', () => ({ renderExplanation: vi.fn() }));
vi.mock('../js/trivia/reading-cards.js', () => ({
  clearAnswerReadingCards: vi.fn(),
  refreshAnswerReadingCards: vi.fn(),
}));
vi.mock('../js/trivia/ui-handlers.js', () => ({ uiHandlers: {} }));
vi.mock('../js/trivia/persistence.js', () => ({ saveGameState: vi.fn() }));
vi.mock('../js/trivia/error-bus.js', () => ({ notify: vi.fn() }));
vi.mock('../js/trivia/services/api-service.js', () => ({ getApiAdapter: () => null }));
vi.mock('../js/trivia/store.js', () => ({ emit: vi.fn() }));

import { showVerificationPopup } from '../js/trivia/ui-modals.js';

describe('answer verification colors', () => {
  it('keeps the canonical answer green when the player answer is wrong', () => {
    showVerificationPopup('player response', 'canonical answer');

    expect(UI.playerAnswerText.classList.contains('bg-red-100')).toBe(true);
    expect(UI.correctAnswerText.classList.contains('bg-green-100')).toBe(true);
    expect(UI.correctAnswerText.classList.contains('bg-red-100')).toBe(false);
  });
});

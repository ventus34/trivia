import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const makeClassList = (initial = []) => {
    const values = new Set(initial);
    return {
      add: (...names) => names.forEach((name) => values.add(name)),
      remove: (...names) => names.forEach((name) => values.delete(name)),
      contains: (name) => values.has(name),
    };
  };

  return {
    UI: {
      playerAnswerText: { textContent: 'Player answer stays intact.' },
      correctAnswerText: { textContent: 'Canonical correct answer stays intact.' },
      explanationContainer: { classList: makeClassList() },
      explanationText: {
        textContent: '',
        style: {},
        classList: makeClassList(),
      },
    },
    setAnswerReadingItems: vi.fn(),
    refreshAnswerReadingCards: vi.fn(() => Promise.resolve()),
  };
});

vi.mock('../js/trivia/dom.js', () => ({ UI: mocks.UI }));
vi.mock('../js/trivia/reading-cards.js', () => ({
  setAnswerReadingItems: mocks.setAnswerReadingItems,
  refreshAnswerReadingCards: mocks.refreshAnswerReadingCards,
}));

import { renderExplanation } from '../js/trivia/explanations.js';

describe('explanation reading-card integration', () => {
  it('rebuilds page source from the latest explanation and preserves answer text', () => {
    const render = (explanation) =>
      renderExplanation({
        questionData: { explanation },
        lang: 'en',
        containerEl: mocks.UI.explanationContainer,
        textEl: mocks.UI.explanationText,
        isCorrect: true,
      });

    render('Initial explanation from the first response.');
    render(
      'Updated asynchronous explanation with a second paragraph and its complete source text.'
    );

    expect(mocks.UI.explanationText.textContent).toContain(
      'Updated asynchronous explanation with a second paragraph and its complete source text.'
    );
    const latestItems = mocks.setAnswerReadingItems.mock.lastCall[0];
    expect(latestItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sectionKey: 'player_answer_was',
          text: 'Player answer stays intact.',
        }),
        expect.objectContaining({
          sectionKey: 'correct_answer_is',
          text: 'Canonical correct answer stays intact.',
        }),
        expect.objectContaining({
          sectionKey: 'explanation',
          text: mocks.UI.explanationText.textContent,
        }),
      ])
    );
    expect(mocks.setAnswerReadingItems).toHaveBeenCalledTimes(2);
  });
});

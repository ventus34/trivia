import { describe, expect, it } from 'vitest';
import { getChoiceVerdict, shuffleAnswerOptions } from '../js/trivia/answer-options.js';

describe('shuffleAnswerOptions', () => {
  it('shuffles a copy while retaining every answer', () => {
    const options = ['correct', 'second', 'third', 'fourth'];
    const shuffled = shuffleAnswerOptions(options, () => 0);

    expect(shuffled).toEqual(['second', 'third', 'fourth', 'correct']);
    expect(options).toEqual(['correct', 'second', 'third', 'fourth']);
    expect([...shuffled].sort()).toEqual([...options].sort());
  });

  it('can leave the order unchanged when each element selects itself', () => {
    expect(shuffleAnswerOptions(['a', 'b', 'c'], () => 0.999)).toEqual(['a', 'b', 'c']);
  });
});

describe('getChoiceVerdict', () => {
  it('rules on selections only when the answer key matches one choice', () => {
    const question = { answer: ' Żubr ', options: ['z\u0307ubr', 'Łoś', 'Jeleń', 'Daniel'] };
    expect(getChoiceVerdict(question, 'z\u0307ubr')).toBe(true);
    expect(getChoiceVerdict(question, 'Łoś')).toBe(false);
    expect(getChoiceVerdict(question, 'Niedźwiedź')).toBeNull();
    expect(getChoiceVerdict({ ...question, answer: 'Bizon' }, 'Łoś')).toBeNull();
    expect(getChoiceVerdict({ ...question, options: ['Żubr', 'żubr', 'Łoś'] }, 'Łoś')).toBeNull();
  });
});

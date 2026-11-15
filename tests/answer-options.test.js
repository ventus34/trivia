import { describe, expect, it } from 'vitest';
import { shuffleAnswerOptions } from '../js/trivia/answer-options.js';

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

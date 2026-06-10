import { describe, it, expect } from 'vitest';
import { createBoardLayout, findPossibleMoves } from '../js/trivia/board.js';
import { gameState } from '../js/trivia/state.js';

describe('board layout', () => {
  it('creates 73 squares (0-72)', () => {
    createBoardLayout();
    expect(gameState.board.length).toBe(73);
  });

  it('finds moves for a simple roll', () => {
    createBoardLayout();
    const moves = findPossibleMoves(0, 1);
    expect(Object.keys(moves).length).toBeGreaterThan(0);
  });
});

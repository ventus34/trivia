import { describe, it, expect, vi } from 'vitest';

const { UI, gameState } = vi.hoisted(() => ({
  UI: {
    historyContent: { children: [], replaceChildren() { this.children = []; }, appendChild(child) { this.children.push(child); }, textContent: '' },
    historyModalTitle: { textContent: '' },
    historyModal: { classList: { add: vi.fn(), remove: vi.fn() } },
  },
  gameState: { gameId: 'first-game', currentLanguage: 'pl' },
}));
vi.mock('../js/trivia/dom.js', () => ({ UI }));
vi.mock('../js/trivia/state.js', () => ({ gameState }));
vi.mock('../js/trivia/config.js', () => ({ translations: { history_empty: { pl: 'Pusto' }, history_modal_title: { pl: 'Historia' } } }));
import { recordQuestionHistory, renderPromptHistory } from '../js/trivia/ui-history.js';

describe('session question history', () => {
  it('shows questions in reverse order and does not leak entries into another game', () => {
    vi.stubGlobal('document', { createElement: () => ({ children: [], append(...nodes) { this.children.push(...nodes); }, textContent: '', className: '' }) });
    try {
      recordQuestionHistory({ question: 'Pierwsze?', answer: 'A' }, 'Nauka');
      recordQuestionHistory({ question: 'Drugie?', answer: 'B' }, 'Sport');
      renderPromptHistory();
      expect(UI.historyContent.children.map(card => card.children[1].textContent)).toEqual(['Drugie?', 'Pierwsze?']);
      gameState.gameId = 'second-game';
      renderPromptHistory();
      expect(UI.historyContent.children).toHaveLength(0);
      expect(UI.historyContent.textContent).toBe('Pusto');
      recordQuestionHistory({ question: 'Nowe?', answer: 'C' }, 'Kultura');
      renderPromptHistory();
      expect(UI.historyContent.children.map(card => card.children[1].textContent)).toEqual(['Nowe?']);
    } finally { vi.unstubAllGlobals(); }
  });
});

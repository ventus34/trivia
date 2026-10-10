import { describe, it, expect, vi } from 'vitest';

// Set up DOM mocks
const createdElementsById = new Map();
globalThis.document = {
    getElementById: vi.fn((id) => {
        if (createdElementsById.has(id)) return createdElementsById.get(id);
        const classList = {
            add: vi.fn(),
            remove: vi.fn(),
            toggle: vi.fn(),
            contains: vi.fn().mockReturnValue(false)
        };
        const parentNode = {
            replaceChild: vi.fn()
        };
        const querySelector = vi.fn((sel) => {
            if (sel === 'span') return { textContent: '' };
            return null;
        });
        const element = {
            id,
            classList,
            value: 'mock-value',
            checked: false,
            disabled: false,
            addEventListener: vi.fn(),
            setAttribute: vi.fn(),
            toggleAttribute: vi.fn(),
            querySelector,
            parentNode,
            cloneNode: vi.fn().mockImplementation(() => ({
                addEventListener: vi.fn(),
                classList: { remove: vi.fn() },
                parentNode: { replaceChild: vi.fn() }
            })),
            appendChild: vi.fn(),
            innerHTML: '',
            style: {},
            textContent: ''
        };

        if (id === 'player-count') {
            element.value = '2';
        } else if (id === 'theme-input') {
            element.value = 'sci-fi';
        } else if (id === 'player-names-container') {
            element.innerHTML = '';
        } else if (id === 'categories-container') {
            element.innerHTML = '';
        }
        return element;
    }),
    querySelector: vi.fn((sel) => {
        if (sel === '.board-wrapper') {
            return {
                querySelector: vi.fn().mockReturnValue(null),
                insertBefore: vi.fn()
            };
        }
        return null;
    }),
    querySelectorAll: vi.fn((sel) => {
        if (sel === '#player-names-container > .player-entry') {
            return [
                {
                    querySelector: vi.fn((sub) => {
                        if (sub === '.player-name-input') return { value: 'Alice', placeholder: 'Alice' };
                        if (sub === '.emoji-button') return { textContent: '🦄' };
                        return null;
                    })
                },
                {
                    querySelector: vi.fn((sub) => {
                        if (sub === '.player-name-input') return { value: 'Bob', placeholder: 'Bob' };
                        if (sub === '.emoji-button') return { textContent: '🦊' };
                        return null;
                    })
                }
            ];
        } else if (sel === '#categories-container .category-input') {
            return [
                { value: 'History' },
                { value: 'Geography' },
                { value: 'Science' },
                { value: 'Art' },
                { value: 'Sports' },
                { value: 'Entertainment' }
            ];
        }
        return [];
    }),
    documentElement: { lang: 'pl' },
    createElement: vi.fn().mockImplementation(() => {
        const element = {
            style: {},
            classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn().mockReturnValue(false) },
            appendChild: vi.fn(),
            append: vi.fn(),
            addEventListener: vi.fn(),
            setAttribute: vi.fn(),
            toggleAttribute: vi.fn(),
            remove: vi.fn(),
            textContent: '',
            _id: '',
        };
        Object.defineProperty(element, 'id', {
            get() {
                return this._id;
            },
            set(id) {
                this._id = id;
                createdElementsById.set(id, this);
            },
        });
        return element;
    }),
    createElementNS: vi.fn().mockImplementation(() => ({
        setAttribute: vi.fn(),
        appendChild: vi.fn()
    }))
};

globalThis.localStorage = {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn()
};

globalThis.window = {
    location: {
        reload: vi.fn(),
        search: ''
    },
    dispatchEvent: vi.fn()
};

describe('Game Flow - initializeGame', () => {
    it('should initialize game successfully and transition screens', async () => {
        const gameFlow = await import('../js/trivia/game-flow.js');
        const state = await import('../js/trivia/state.js');
        const { UI } = await import('../js/trivia/dom.js');
        const { setupStateSubscriptions } = await import('../js/trivia/ui-state.js');

        UI.boardElement.appendChild = vi.fn();
        const unsubscribe = setupStateSubscriptions();
        let renderedPlayerTokens = [];
        const { subscribe } = await import('../js/trivia/store.js');
        const unsubscribeFromCompletion = subscribe((event) => {
            if (event === 'state:init-complete') {
                renderedPlayerTokens = UI.boardElement.appendChild.mock.calls
                    .slice(-2)
                    .map(([element]) => element)
                    .filter((element) => element.className === 'player-token')
                    .map((element) => ({ left: element.style.left, top: element.style.top }));
            }
        });
        
        try {
            expect(() => gameFlow.initializeGame()).not.toThrow();
        } finally {
            unsubscribeFromCompletion();
            unsubscribe();
        }

        expect(state.gameState.players.length).toBe(2);
        expect(state.gameState.board).toHaveLength(73);
        expect(state.gameState.players[0].name).toBe('Alice');
        expect(state.gameState.players[1].name).toBe('Bob');
        expect(state.gameState.categories).toEqual(['History', 'Geography', 'Science', 'Art', 'Sports', 'Entertainment']);
        expect(state.gameState.players.map((player) => player.position)).toEqual([0, 0]);
        expect(renderedPlayerTokens).toHaveLength(2);
        const tokenLeftPositions = renderedPlayerTokens.map(({ left }) => Number.parseFloat(left));
        const tokenTopPositions = renderedPlayerTokens.map(({ top }) => Number.parseFloat(top));
        const hubPosition = state.gameState.board[0].pos;
        expect(tokenLeftPositions[0]).not.toBe(tokenLeftPositions[1]);
        expect(tokenTopPositions[0]).toBeCloseTo(hubPosition.y - 1.75);
        expect(tokenTopPositions[1]).toBeCloseTo(hubPosition.y - 1.75);
        tokenLeftPositions.forEach((left) => {
            expect(Math.abs(left + 1.75 - hubPosition.x)).toBeCloseTo(1.6);
        });
    });

    it('validates player count and the six categories required by the board', async () => {
        const { validateGameSetup } = await import('../js/trivia/game-flow.js');

        expect(validateGameSetup(2, ['History', 'Geography', 'Science', 'Art', 'Sports', 'Media'])).toBeNull();
        expect(validateGameSetup(0, ['History', 'Geography', 'Science', 'Art', 'Sports', 'Media'])).toBe('player-count');
        expect(validateGameSetup(2, ['History', 'Geography', 'Science', 'Art', 'Sports'])).toBe('categories');
        expect(validateGameSetup(2, ['History', '', 'Science', 'Art', 'Sports', 'Media'])).toBe('categories');
    });

    it('clears stale question data and makes the dice usable when question loading fails', async () => {
        const gameFlow = await import('../js/trivia/game-flow.js');
        const { gameState, setState } = await import('../js/trivia/state.js');
        const { setApiAdapter } = await import('../js/trivia/services/api-service.js');
        const { UI } = await import('../js/trivia/dom.js');

        setState({
            players: [{ name: 'Alice', position: 0, wedges: [] }],
            currentPlayerIndex: 0,
            categories: ['History', 'Geography', 'Science', 'Art', 'Sports', 'Media'],
            board: [{ id: 0, categoryIndex: 0 }],
            gameMode: 'mcq',
            currentQuestionData: { question: 'Old question', answer: 'Old answer' },
        });
        UI.diceElement.disabled = true;
        setApiAdapter({
            generateQuestion: vi.fn().mockRejectedValue(new Error('Question service unavailable')),
        });

        await gameFlow.askQuestion(0);

        expect(gameState.currentQuestionData).toBeNull();
        expect(UI.diceElement.disabled).toBe(false);
        expect(UI.answerInput.value).toBe('');
    });
});

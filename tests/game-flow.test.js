import { describe, it, expect, vi, beforeEach } from 'vitest';

// Set up DOM mocks
global.document = {
    getElementById: vi.fn((id) => {
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
    createElement: vi.fn().mockImplementation(() => ({
        style: {},
        classList: { add: vi.fn() },
        appendChild: vi.fn(),
        addEventListener: vi.fn()
    })),
    createElementNS: vi.fn().mockImplementation(() => ({
        setAttribute: vi.fn(),
        appendChild: vi.fn()
    }))
};

global.localStorage = {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn()
};

global.window = {
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
        
        expect(() => gameFlow.initializeGame()).not.toThrow();
        expect(state.gameState.players.length).toBe(2);
        expect(state.gameState.players[0].name).toBe('Alice');
        expect(state.gameState.players[1].name).toBe('Bob');
        expect(state.gameState.categories).toEqual(['History', 'Geography', 'Science', 'Art', 'Sports', 'Entertainment']);
    });
});

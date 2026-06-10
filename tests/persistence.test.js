import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define document and localStorage mocks before importing files that use them
global.document = {
    getElementById: vi.fn().mockReturnValue({
        classList: {
            add: vi.fn(),
            remove: vi.fn(),
            toggle: vi.fn()
        },
        value: 'mock-value',
        addEventListener: vi.fn(),
        querySelector: vi.fn(),
        parentNode: {
            replaceChild: vi.fn()
        },
        cloneNode: vi.fn().mockImplementation(() => ({
            addEventListener: vi.fn(),
            classList: { remove: vi.fn() },
            parentNode: { replaceChild: vi.fn() }
        }))
    }),
    querySelector: vi.fn().mockReturnValue({
        remove: vi.fn()
    }),
    querySelectorAll: vi.fn().mockReturnValue([]),
    documentElement: { lang: 'pl' }
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
    }
};

describe('Persistence Service', () => {
    let saveGameState, loadGameState, gameState, setState, createBoardLayout;

    beforeEach(async () => {
        vi.clearAllMocks();
        
        // Import dynamically to ensure globals are defined first
        const persistence = await import('../js/trivia/services/persistence-service.js');
        saveGameState = persistence.saveGameState;
        loadGameState = persistence.loadGameState;
        
        const state = await import('../js/trivia/state.js');
        gameState = state.gameState;
        setState = state.setState;
        
        const board = await import('../js/trivia/board.js');
        createBoardLayout = board.createBoardLayout;

        // Reset gameState
        setState({
            gameId: 'game-123',
            players: [
                { name: 'Player 1', emoji: '🎲', position: 0, color: '#ff0000', wedges: [] }
            ],
            categories: ['Kat1', 'Kat2', 'Kat3', 'Kat4', 'Kat5', 'Kat6'],
            board: [],
            theme: 'test-theme',
            includeCategoryTheme: false,
            mutateCategories: false,
            currentPlayerIndex: 0,
            isAwaitingMove: false,
            lastAnswerWasCorrect: false,
            categoryTopicHistory: {},
            possiblePaths: {},
            selectedQuestionModel: 'trivia',
            selectedQuestionProvider: 'custom',
            selectedExplanationModel: 'trivia',
            selectedExplanationProvider: 'custom',
            selectedBlueprintModel: 'trivia',
            selectedBlueprintProvider: 'custom',
            selectedCategoryModel: 'trivia',
            currentProvider: 'custom',
            api: {
                isConfigured: () => true
            }
        });
        createBoardLayout();
    });

    it('should save game state without throwing', () => {
        let savedData = null;
        global.localStorage.setItem = vi.fn((key, val) => {
            if (key === 'savedQuizGame') {
                savedData = JSON.parse(val);
            }
        });

        expect(() => saveGameState()).not.toThrow();
        expect(savedData).not.toBeNull();
        expect(savedData.gameId).toBe('game-123');
        expect(savedData.players.length).toBe(1);
        expect(savedData.api).toBeUndefined(); // Excluded key
        expect(savedData.board).toBeUndefined(); // Excluded key
    });

    it('should load game state', () => {
        const mockSaved = {
            gameId: 'game-456',
            players: [{ name: 'Player 2', position: 5 }],
            categories: ['Kat1']
        };
        global.localStorage.getItem = vi.fn((key) => {
            if (key === 'savedQuizGame') {
                return JSON.stringify(mockSaved);
            }
            return null;
        });

        const loaded = loadGameState();
        expect(loaded).not.toBeNull();
        expect(loaded.gameId).toBe('game-456');
    });
});

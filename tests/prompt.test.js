import { describe, it, expect, vi } from 'vitest';

// Set up DOM mocks
global.document = {
    getElementById: vi.fn((id) => {
        const classList = {
            add: vi.fn(),
            remove: vi.fn(),
            toggle: vi.fn(),
            contains: vi.fn().mockReturnValue(false)
        };
        const element = {
            id,
            classList,
            value: 'mock-value',
            checked: false,
            disabled: false,
            addEventListener: vi.fn(),
            querySelector: vi.fn(),
            appendChild: vi.fn(),
            innerHTML: '',
            style: {},
            textContent: ''
        };

        if (id === 'theme-input') {
            element.value = 'Astronomia';
        } else if (id === 'knowledge-level') {
            element.value = 'intermediate';
        } else if (id === 'game-mode') {
            element.value = 'mcq';
        } else if (id === 'prompt-q-per-category') {
            element.value = '20';
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
        if (sel === '#categories-container .category-input') {
            return [
                { value: 'Kosmos' },
                { value: 'Gwiazdy' },
                { value: 'Galaktyki' },
                { value: 'Planety' },
                { value: 'Księżyce' },
                { value: 'Loty kosmiczne' }
            ];
        }
        return [];
    })
};

global.localStorage = {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
    removeItem: vi.fn()
};

global.window = {
    location: {
        search: ''
    },
    dispatchEvent: vi.fn()
};

describe('AI Prompt Generation', () => {
    it('should compile a correct JSON format prompt when format is json', async () => {
        const { compileAIPrompt } = await import('../js/trivia/ui-events.js');
        const { gameState } = await import('../js/trivia/state.js');
        
        gameState.currentLanguage = 'pl';
        
        const prompt = compileAIPrompt();
        expect(prompt).toContain('Jesteś ekspertem od tworzenia gier typu Trivia');
        expect(prompt).toContain('formacie JSON');
        expect(prompt).toContain('options');
        expect(prompt).toContain('explanation_correct');
    });
});describe('JSON Healing and Parsing', () => {
    it('should parse valid JSON directly', async () => {
        const { healAndParseJSON } = await import('../js/trivia/utils.js');
        const obj = healAndParseJSON('{"name": "test"}');
        expect(obj.name).toBe('test');
    });

    it('should heal markdown block wrapped JSON', async () => {
        const { healAndParseJSON } = await import('../js/trivia/utils.js');
        const obj = healAndParseJSON('```json\n{"name": "test"}\n```');
        expect(obj.name).toBe('test');
    });

    it('should heal conversational text wrapped JSON', async () => {
        const { healAndParseJSON } = await import('../js/trivia/utils.js');
        const obj = healAndParseJSON('Here is your database:\n```json\n{"name": "test"}\n```\nEnjoy!');
        expect(obj.name).toBe('test');
    });

    it('should heal trailing commas', async () => {
        const { healAndParseJSON } = await import('../js/trivia/utils.js');
        const obj = healAndParseJSON('{"name": "test", "items": [1, 2, ],}');
        expect(obj.name).toBe('test');
        expect(obj.items).toEqual([1, 2]);
    });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveCategoryIds } from '../js/trivia/category-selection.js';
import { gameState, setState } from '../js/trivia/state.js';

vi.mock('../js/trivia/main.js', () => ({ initializeApp: vi.fn() }));
vi.mock('../js/trivia/error-bus.js', () => ({ notify: vi.fn() }));

const astronomy = { id: 'astro_pl', path: '/astro', aliases: ['old_astro_pl', 'older_astro_pl'] };
const translated = { id: 'astro_en', path: '/astro-en' };

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('consolidated category IDs', () => {
  it('resolves saved aliases once, keeping order and separate translations', () => {
    expect(
      resolveCategoryIds(
        ['old_astro_pl', 'missing', 'astro_en', 'older_astro_pl', 'astro_pl'],
        [translated, astronomy]
      )
    ).toEqual(['astro_pl', 'astro_en']);
  });

  it('loads a previously saved selection from the canonical pack path', async () => {
    const categories = [
      astronomy,
      translated,
      ...['a', 'b', 'c', 'd'].map((id) => ({ id, path: '/' + id })),
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (path) => ({
        ok: true,
        json: async () =>
          path === 'databases/list.json' ? categories : { name: path, questions: [] },
      }))
    );
    vi.stubGlobal('window', { dispatchEvent: vi.fn() });
    const { clientAdapter } = await import('../js/trivia/client-adapter.js');
    setState({
      allCategories: [],
      selectedCategoryIds: ['old_astro_pl', 'astro_en', 'a', 'b', 'c', 'd'],
      gameId: null,
    });

    await clientAdapter.loadDatabase('categories');

    expect(fetch.mock.calls.map(([path]) => path)).toEqual([
      'databases/list.json',
      '/astro',
      '/astro-en',
      '/a',
      '/b',
      '/c',
      '/d',
    ]);
    expect(gameState.selectedCategoryIds).toEqual(['astro_pl', 'astro_en', 'a', 'b', 'c', 'd']);
    expect(gameState.loadedDatabase.categories).toEqual([
      '/astro',
      '/astro-en',
      '/a',
      '/b',
      '/c',
      '/d',
    ]);
  });
});

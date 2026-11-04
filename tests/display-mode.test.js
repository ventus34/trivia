import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/theme.js', import.meta.url), 'utf8');

function setup(saved = null) {
  const listeners = {};
  const storage = new Map(saved ? [['trivia_display_mode', saved]] : []);
  const toggles = Array.from({ length: 2 }, () => ({
    checked: false,
    addEventListener(type, handler) { this[type] = handler; },
  }));
  const button = { hidden: false, addEventListener(type, handler) { this[type] = handler; }, setAttribute: vi.fn() };
  const document = {
    documentElement: { dataset: {}, requestFullscreen: vi.fn() },
    fullscreenEnabled: true,
    fullscreenElement: null,
    querySelectorAll: (selector) => selector === '[data-display-tv]' ? toggles : [button],
    getElementById: () => null,
    addEventListener(type, handler) { (listeners[type] ||= []).push(handler); },
  };
  const window = { dispatchEvent: vi.fn(), addEventListener: vi.fn() };
  const localStorage = { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) };
  runInNewContext(source, { document, window, localStorage, Event: class { constructor(type) { this.type = type; } }, console });
  listeners.DOMContentLoaded.forEach((handler) => handler());
  return { document, toggles, storage, window, button };
}

describe('display controls', () => {
  it('defaults to standard and synchronizes the saved setting between controls', () => {
    const app = setup();
    expect(app.document.documentElement.dataset.displayMode).toBe('standard');
    app.toggles[0].checked = true;
    app.toggles[0].change();
    expect(app.storage.get('trivia_display_mode')).toBe('tv');
    expect(app.toggles[1].checked).toBe(true);
    expect(app.document.documentElement.dataset.displayMode).toBe('tv');
    expect(app.window.dispatchEvent).toHaveBeenCalled();
  });

  it('restores TV independently and toggles fullscreen separately', async () => {
    const app = setup('tv');
    expect(app.toggles.every((toggle) => toggle.checked)).toBe(true);
    await app.button.click();
    expect(app.document.documentElement.requestFullscreen).toHaveBeenCalledOnce();
    expect(app.storage.get('trivia_display_mode')).toBe('tv');
  });
});

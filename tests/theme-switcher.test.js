import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/theme.js', import.meta.url), 'utf8');

function setupThemeSwitcher(savedTheme = 'dark') {
  const listeners = {};
  const storage = new Map([['trivia_theme', savedTheme]]);
  const radio = {
    value: 'dark',
    checked: false,
    ariaLabelledby: 'theme-dark-label',
  };
  const accessibleName = { id: 'theme-dark-label', textContent: 'Ciemny', ariaHidden: false };
  const icon = { textContent: '🌙', ariaHidden: true };
  const label = {
    children: [radio, icon, accessibleName],
    querySelector(selector) { return selector === 'input' ? radio : null; },
  };
  const switcher = {
    querySelectorAll(selector) { return selector === 'label' ? [label] : []; },
    querySelector(selector) { return selector === 'input[value="dark"]' ? radio : null; },
    addEventListener(type, handler) { this[type] = handler; },
  };
  const document = {
    documentElement: { dataset: {}, className: '' },
    fullscreenEnabled: false,
    fullscreenElement: null,
    getElementById(id) {
      if (id === 'theme-switcher') return switcher;
      return label.children.find((child) => child.id === id) || null;
    },
    querySelectorAll: () => [],
    addEventListener(type, handler) { (listeners[type] ||= []).push(handler); },
    createElement() { throw new Error('Theme initialization should preserve existing label nodes.'); },
  };
  const localStorage = {
    getItem: (key) => storage.get(key),
    setItem: (key, value) => storage.set(key, value),
  };
  const window = { dispatchEvent() {}, addEventListener() {} };

  runInNewContext(source, {
    document,
    localStorage,
    window,
    Event: class {},
    console,
  });
  listeners.DOMContentLoaded.forEach((handler) => handler());

  return { accessibleName, icon, label, localStorage, radio, storage, switcher };
}

describe('theme switcher', () => {
  it('preserves the labelled-by target and icon while restoring the saved theme', () => {
    const app = setupThemeSwitcher();

    expect(app.radio.checked).toBe(true);
    expect(app.label.children).toEqual([app.radio, app.icon, app.accessibleName]);
    expect(app.label.children.find((child) => child.id === app.radio.ariaLabelledby)).toBe(app.accessibleName);
  });

  it('applies and persists a selected theme', () => {
    const app = setupThemeSwitcher();
    app.switcher.change({ target: { value: 'light' } });

    expect(app.storage.get('trivia_theme')).toBe('light');
    expect(app.localStorage.getItem('trivia_theme')).toBe('light');
  });
});

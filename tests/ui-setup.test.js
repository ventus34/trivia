import { describe, expect, it, vi } from 'vitest';

function makeElement(tagName) {
  const attributes = new Map();
  const listeners = new Map();
  const classes = new Set();
  const element = {
    tagName: tagName.toUpperCase(),
    attributes,
    children: [],
    className: '',
    type: '',
    textContent: '',
    placeholder: '',
    parentElement: null,
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
      contains: (name) => classes.has(name),
      toggle: (name) => {
        if (classes.has(name)) {
          classes.delete(name);
          return false;
        }
        classes.add(name);
        return true;
      },
    },
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: (name) => attributes.get(name) ?? null,
    addEventListener: (type, listener) => listeners.set(type, listener),
    appendChild(child) {
      child.parentElement = element;
      element.children.push(child);
      return child;
    },
    querySelectorAll(selector) {
      if (selector === '.emoji-option') {
        return element.children.filter((child) => child.className === 'emoji-option');
      }
      return [];
    },
    focus: vi.fn(),
    click(event = { preventDefault: vi.fn() }) {
      listeners.get('click')?.(event);
    },
  };
  return element;
}

describe('player setup controls', () => {
  it('renders accessible native avatar buttons that work with keyboard and gamepad activation', async () => {
    const elementsById = new Map();
    globalThis.document = {
      getElementById: vi.fn((id) => {
        if (!elementsById.has(id)) elementsById.set(id, makeElement('div'));
        return elementsById.get(id);
      }),
      querySelector: vi.fn(() => null),
      querySelectorAll: vi.fn(() => []),
      createElement: vi.fn((tagName) => makeElement(tagName)),
      documentElement: { classList: { contains: vi.fn(() => false) } },
    };

    const { UI } = await import('../js/trivia/dom.js');
    const { CONFIG, translations } = await import('../js/trivia/config.js');
    const { updatePlayerNameInputs } = await import('../js/trivia/ui-setup.js');
    const entries = [];
    UI.playerCountInput.value = '1';
    UI.playerNamesContainer.appendChild = (entry) => entries.push(entry);

    updatePlayerNameInputs();

    const [nameInput, picker] = entries[0].children;
    const [avatarButton, emojiPanel] = picker.children;
    const [selectedEmoji, nextEmoji] = emojiPanel.children;

    expect(nameInput.getAttribute('aria-label')).toBe('Imię gracza 1');
    expect(avatarButton.type).toBe('button');
    expect(avatarButton.getAttribute('aria-label')).toBe(translations.player_avatar_button.pl.replace('{i}', '1'));
    expect(emojiPanel.getAttribute('role')).toBe('group');
    expect(emojiPanel.children).toHaveLength(CONFIG.EMOJI_OPTIONS.length);
    expect(emojiPanel.children.every((option) => option.tagName === 'BUTTON' && option.type === 'button')).toBe(true);
    expect(selectedEmoji.getAttribute('aria-pressed')).toBe('true');

    avatarButton.click();
    expect(avatarButton.getAttribute('aria-expanded')).toBe('true');
    expect(emojiPanel.classList.contains('active')).toBe(true);

    nextEmoji.click();
    expect(avatarButton.textContent).toBe(CONFIG.EMOJI_OPTIONS[1]);
    expect(nextEmoji.getAttribute('aria-pressed')).toBe('true');
    expect(selectedEmoji.getAttribute('aria-pressed')).toBe('false');
    expect(avatarButton.getAttribute('aria-expanded')).toBe('false');
    expect(emojiPanel.classList.contains('active')).toBe(false);
    expect(avatarButton.focus).toHaveBeenCalledOnce();
  });
});

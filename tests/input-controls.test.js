import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  findDirectionalTarget,
  getFocusableElements,
  readGamepadDirection,
  setupInputControls,
} from '../js/trivia/input-controls.js';

function makeElement(document, options = {}) {
  const classes = new Set(options.classes || []);
  const attributes = { ...(options.attributes || {}) };
  const element = {
    tagName: (options.tagName || 'button').toUpperCase(),
    type: options.type || '',
    id: options.id || '',
    disabled: Boolean(options.disabled),
    readOnly: Boolean(options.readOnly),
    hidden: Boolean(options.hidden),
    inert: false,
    isContentEditable: false,
    value: options.value || '',
    min: options.min,
    max: options.max,
    step: options.step,
    dataset: {},
    ownerDocument: document,
    parentElement: options.parent || null,
    computedStyle: {
      display: 'block',
      visibility: 'visible',
      pointerEvents: 'auto',
      zIndex: '0',
    },
    classList: {
      contains: (name) => classes.has(name),
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
    },
    getAttribute: (name) => (Object.hasOwn(attributes, name) ? attributes[name] : null),
    hasAttribute: (name) => Object.hasOwn(attributes, name),
    setAttribute: (name, value) => {
      attributes[name] = String(value);
    },
    contains(target) {
      for (let node = target; node; node = node.parentElement) {
        if (node === element) return true;
      }
      return false;
    },
    getBoundingClientRect: () => options.rect || { left: 0, top: 0, width: 40, height: 40 },
    focus: vi.fn(() => {
      document.activeElement = element;
    }),
    scrollIntoView: vi.fn(),
    click: vi.fn(),
    querySelector: vi.fn(() => null),
    querySelectorAll: vi.fn(() => options.descendants || []),
  };
  return element;
}

function makeDocument() {
  const document = {
    activeElement: null,
    listeners: new Map(),
    focusables: [],
    scopes: [],
    defaultView: null,
    querySelectorAll(selector) {
      if (selector.includes('#answer-popup')) return this.scopes;
      return this.focusables;
    },
    querySelector: vi.fn(() => null),
    getElementById: vi.fn(() => null),
    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    },
    removeEventListener: vi.fn(),
    dispatch(type, event) {
      this.listeners.get(type)?.(event);
    },
  };
  document.defaultView = {
    getComputedStyle: (element) => element.computedStyle,
    Event: class {
      constructor(type, init) {
        this.type = type;
        this.bubbles = init?.bubbles;
      }
    },
  };
  document.documentElement = makeElement(document, { tagName: 'html' });
  return document;
}

function makeWindow(gamepads = []) {
  const listeners = new Map();
  let intervalCallback;
  return {
    navigator: { getGamepads: () => gamepads },
    addEventListener: (type, listener) => listeners.set(type, listener),
    removeEventListener: vi.fn(),
    setInterval: vi.fn((callback) => {
      intervalCallback = callback;
      return 1;
    }),
    clearInterval: vi.fn(),
    runInterval: () => intervalCallback?.(),
  };
}

describe('input controls', () => {
  const cleanups = [];

  afterEach(() => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
  });

  it('chooses the closest aligned control in the requested direction', () => {
    const document = makeDocument();
    const current = makeElement(document, { rect: { left: 0, top: 0, width: 40, height: 40 } });
    const aligned = makeElement(document, { rect: { left: 100, top: 0, width: 40, height: 40 } });
    const diagonal = makeElement(document, { rect: { left: 60, top: 55, width: 40, height: 40 } });

    expect(findDirectionalTarget(current, [current, aligned, diagonal], 'right')).toBe(aligned);
    expect(findDirectionalTarget(current, [current], 'right')).toBeNull();
  });

  it('excludes disabled controls and controls inside hidden containers', () => {
    const document = makeDocument();
    const hiddenContainer = makeElement(document, { classes: ['hidden'] });
    const visible = makeElement(document);
    const disabled = makeElement(document, { disabled: true });
    const ariaDisabled = makeElement(document, { attributes: { 'aria-disabled': 'true' } });
    const hidden = makeElement(document, { parent: hiddenContainer });
    document.focusables = [visible, disabled, ariaDisabled, hidden];

    expect(getFocusableElements(document)).toEqual([visible]);
  });

  it('applies a deadzone and reads D-pad or stick directions', () => {
    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
    expect(readGamepadDirection({ buttons, axes: [0.2, 0.2] })).toBeNull();
    expect(readGamepadDirection({ buttons, axes: [-0.8, 0.3] })).toBe('left');
    buttons[12].pressed = true;
    expect(readGamepadDirection({ buttons, axes: [0, 0] })).toBe('up');
  });

  it('leaves text editing arrows alone and activates custom board buttons with Enter', () => {
    const document = makeDocument();
    const input = makeElement(document, { tagName: 'input', type: 'text' });
    const boardCell = makeElement(document, {
      tagName: 'div',
      attributes: { role: 'button', tabindex: '0' },
      rect: { left: 100, top: 0, width: 40, height: 40 },
    });
    document.focusables = [input, boardCell];
    document.activeElement = input;
    const window = makeWindow();
    cleanups.push(setupInputControls({ document, window }));

    const arrowEvent = { key: 'ArrowRight', preventDefault: vi.fn() };
    document.dispatch('keydown', arrowEvent);
    expect(arrowEvent.preventDefault).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(input);

    document.activeElement = boardCell;
    document.dispatch('keydown', { key: 'Enter', preventDefault: vi.fn() });
    expect(boardCell.click).toHaveBeenCalledOnce();
  });

  it('allows spatial navigation and wizard back from a readonly number field', () => {
    const document = makeDocument();
    const count = makeElement(document, {
      tagName: 'input',
      type: 'number',
      readOnly: true,
      attributes: { readonly: '' },
      rect: { left: 0, top: 0, width: 40, height: 40 },
    });
    const next = makeElement(document, { rect: { left: 80, top: 0, width: 40, height: 40 } });
    const back = makeElement(document, { id: 'wizard-back-btn' });
    const elements = new Map([['wizard-back-btn', back]]);
    document.getElementById.mockImplementation((id) => elements.get(id) || null);
    document.focusables = [count, next, back];
    document.activeElement = count;
    const window = makeWindow();
    cleanups.push(setupInputControls({ document, window }));

    const arrowEvent = { key: 'ArrowRight', preventDefault: vi.fn() };
    document.dispatch('keydown', arrowEvent);
    expect(arrowEvent.preventDefault).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(next);

    document.activeElement = count;
    document.dispatch('keydown', { key: 'Escape', preventDefault: vi.fn() });
    expect(back.click).toHaveBeenCalledOnce();
  });

  it('collapses the avatar trigger when Escape closes its picker', () => {
    const document = makeDocument();
    const trigger = makeElement(document, { attributes: { 'aria-expanded': 'true' } });
    const picker = makeElement(document);
    picker.querySelector.mockReturnValue(trigger);
    const panel = makeElement(document, { classes: ['active'], parent: picker });
    const option = makeElement(document, { parent: panel });
    document.querySelector.mockReturnValue(panel);
    document.focusables = [trigger, option];
    document.activeElement = option;
    const window = makeWindow();
    cleanups.push(setupInputControls({ document, window }));

    document.dispatch('keydown', { key: 'Escape', preventDefault: vi.fn() });

    expect(panel.classList.contains('active')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('moves focus with the gamepad and repeats only after the hold delay', () => {
    const document = makeDocument();
    const first = makeElement(document, { rect: { left: 0, top: 0, width: 40, height: 40 } });
    const second = makeElement(document, { rect: { left: 60, top: 0, width: 40, height: 40 } });
    const third = makeElement(document, { rect: { left: 120, top: 0, width: 40, height: 40 } });
    document.focusables = [first, second, third];
    document.activeElement = first;

    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
    const gamepad = { index: 0, axes: [0.8, 0], buttons };
    const window = makeWindow([gamepad]);
    let time = 0;
    cleanups.push(setupInputControls({ document, window, now: () => time }));

    window.runInterval();
    expect(document.activeElement).toBe(second);
    expect(second.dataset.gamepadFocus).toBe('true');
    time = 200;
    window.runInterval();
    expect(document.activeElement).toBe(second);
    time = 360;
    window.runInterval();
    expect(document.activeElement).toBe(third);
  });

  it('keeps D-pad navigation on legal board moves and wraps between them', () => {
    const document = makeDocument();
    const leftMove = makeElement(document, {
      attributes: { 'data-controller-focus': '', tabindex: '0' },
      rect: { left: 0, top: 100, width: 40, height: 40 },
    });
    const rightMove = makeElement(document, {
      attributes: { 'data-controller-focus': '', tabindex: '0' },
      rect: { left: 100, top: 100, width: 40, height: 40 },
    });
    const menu = makeElement(document, {
      id: 'open-game-menu-btn',
      rect: { left: 220, top: 100, width: 40, height: 40 },
    });
    document.focusables = [leftMove, rightMove, menu];
    document.activeElement = rightMove;
    const window = makeWindow();
    cleanups.push(setupInputControls({ document, window }));

    document.dispatch('keydown', { key: 'ArrowRight', preventDefault: vi.fn() });

    expect(document.activeElement).toBe(leftMove);
  });

  it('toggles the game menu with the standard gamepad Start button', () => {
    const document = makeDocument();
    const openButton = makeElement(document, { id: 'open-game-menu-btn' });
    const menuAction = makeElement(document);
    const menuPanel = makeElement(document, { id: 'game-menu-panel', parent: null });
    const overlay = makeElement(document, { id: 'game-menu-overlay' });
    menuAction.parentElement = menuPanel;
    menuPanel.querySelectorAll.mockReturnValue([menuAction]);
    openButton.click.mockImplementation(() => {
      menuPanel.classList.add('visible');
      overlay.classList.add('visible');
    });
    overlay.click.mockImplementation(() => {
      menuPanel.classList.remove('visible');
      overlay.classList.remove('visible');
      openButton.focus();
    });
    document.focusables = [openButton, menuAction];
    document.scopes = [menuPanel];
    document.activeElement = openButton;
    const elements = new Map([
      ['open-game-menu-btn', openButton],
      ['game-menu-panel', menuPanel],
      ['game-menu-overlay', overlay],
    ]);
    document.getElementById.mockImplementation((id) => elements.get(id) || null);

    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
    const window = makeWindow([{ index: 0, axes: [0, 0], buttons }]);
    cleanups.push(setupInputControls({ document, window }));

    buttons[9].pressed = true;
    window.runInterval();
    expect(menuPanel.classList.contains('visible')).toBe(true);

    buttons[9].pressed = false;
    window.runInterval();
    expect(document.activeElement).toBe(menuAction);

    buttons[9].pressed = true;
    window.runInterval();
    expect(menuPanel.classList.contains('visible')).toBe(false);
    expect(document.activeElement).toBe(openButton);
  });

  it('moves focus to the die when a selected roll-again square becomes unavailable', () => {
    const document = makeDocument();
    const square = makeElement(document, {
      attributes: { 'data-board-square': '', 'data-controller-focus': '', tabindex: '0' },
    });
    const dice = makeElement(document, { id: 'dice' });
    document.focusables = [square, dice];
    document.activeElement = square;
    const window = makeWindow();
    cleanups.push(setupInputControls({ document, window }));

    square.setAttribute('tabindex', '-1');
    square.setAttribute('aria-disabled', 'true');
    window.runInterval();

    expect(document.activeElement).toBe(dice);
  });

  it('restores game focus when disabling the die rehomes browser focus to the menu', () => {
    const document = makeDocument();
    const menu = makeElement(document, { id: 'open-game-menu-btn' });
    const dice = makeElement(document, { id: 'dice' });
    const square = makeElement(document, {
      attributes: { 'data-board-square': '', 'data-controller-focus': '', tabindex: '0' },
    });
    const nextSquare = makeElement(document, {
      attributes: { 'data-board-square': '', 'data-controller-focus': '', tabindex: '0' },
      rect: { left: 100, top: 0, width: 40, height: 40 },
    });
    dice.click.mockImplementation(() => {
      dice.disabled = true;
      document.dispatch('blur', { target: dice });
      document.activeElement = menu;
      document.dispatch('focusin', { target: menu });
    });
    document.focusables = [menu, dice];
    document.activeElement = dice;

    const buttons = Array.from({ length: 16 }, () => ({ pressed: false }));
    const gamepad = { index: 0, axes: [0, 0], buttons };
    const window = makeWindow([gamepad]);
    cleanups.push(setupInputControls({ document, window }));

    buttons[0].pressed = true;
    window.runInterval();
    expect(document.activeElement).toBe(menu);

    buttons[0].pressed = false;
    document.focusables.push(square, nextSquare);
    window.runInterval();
    expect(document.activeElement).toBe(square);

    buttons[15].pressed = true;
    window.runInterval();

    expect(document.activeElement).toBe(nextSquare);
  });
});

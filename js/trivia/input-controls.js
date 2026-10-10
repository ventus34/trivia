/**
 * Keyboard and gamepad navigation for the trivia interface.
 *
 * Navigation is spatial so the same controls work on the setup wizard, the board,
 * generated answer choices, and dialogs without maintaining a second menu model.
 */

const FOCUSABLE_SELECTOR =
  'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [data-controller-focus], [tabindex]:not([tabindex="-1"])';
const ACTIVE_SCOPE_SELECTOR =
  '#answer-popup, #question-modal, #category-choice-modal, #category-selection-modal, #history-modal, #model-choice-modal, #suggestion-modal, #game-menu-panel, #winner-screen';
const VISIBLE_CLASS_SCOPES = new Set([
  'question-modal',
  'category-choice-modal',
  'history-modal',
  'model-choice-modal',
  'suggestion-modal',
]);
const DIRECTION_KEYS = {
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  w: 'up',
  d: 'right',
  s: 'down',
  a: 'left',
};
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};
const GAMEPAD_REPEAT_DELAY_MS = 360;
const GAMEPAD_REPEAT_INTERVAL_MS = 120;

function hasClass(element, className) {
  return Boolean(element?.classList?.contains(className));
}

function getComputedStyleSafe(element) {
  const view = element?.ownerDocument?.defaultView;
  return view?.getComputedStyle ? view.getComputedStyle(element) : null;
}

function isRendered(element) {
  if (!element) return false;
  const visibleMenuOverlay = element.id === 'game-menu-overlay' && hasClass(element, 'visible');
  const visibleModal = VISIBLE_CLASS_SCOPES.has(element.id) && hasClass(element, 'visible');
  if ((element.hidden || hasClass(element, 'hidden')) && !visibleMenuOverlay && !visibleModal) return false;
  if (element.getAttribute?.('aria-hidden') === 'true' || element.inert) return false;

  if (element.id === 'game-menu-panel' && !hasClass(element, 'visible')) return false;
  if (element.id === 'game-menu-overlay' && !hasClass(element, 'visible')) return false;

  const style = getComputedStyleSafe(element);
  if (style && (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse')) {
    return false;
  }

  return true;
}

function isAvailable(element) {
  if (!element || element.disabled || element.getAttribute?.('aria-disabled') === 'true') return false;
  if (element.getAttribute?.('tabindex') !== null && Number(element.getAttribute('tabindex')) < 0) {
    return false;
  }

  for (let node = element; node; node = node.parentElement) {
    if (node.getAttribute?.('aria-disabled') === 'true') return false;
    if (node.tagName?.toLowerCase() === 'fieldset' && node.disabled) return false;
    if (!isRendered(node)) return false;
  }

  const style = getComputedStyleSafe(element);
  if (style && style.pointerEvents === 'none') return false;
  return true;
}

/** Returns all currently available controls in document order. */
export function getFocusableElements(root = document) {
  return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isAvailable);
}

/**
 * Finds the nearest focus target in a direction using element centers. Candidates
 * must be in the requested half-plane; perpendicular distance breaks ties.
 */
export function findDirectionalTarget(current, candidates, direction, rectOf = (el) => el.getBoundingClientRect()) {
  const vector = DIRECTIONS[direction];
  if (!current || !vector) return null;

  const currentRect = rectOf(current);
  const currentX = currentRect.left + currentRect.width / 2;
  const currentY = currentRect.top + currentRect.height / 2;
  let best = null;
  let bestScore = Infinity;

  candidates.forEach((candidate) => {
    if (candidate === current) return;
    const rect = rectOf(candidate);
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const primary = (x - currentX) * vector.x + (y - currentY) * vector.y;
    if (primary <= 1) return;

    const perpendicular = Math.abs((x - currentX) * vector.y - (y - currentY) * vector.x);
    const score = primary + perpendicular * 1.65;
    if (score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  });

  return best;
}

function findWrappedDirectionalTarget(current, candidates, direction) {
  const vector = DIRECTIONS[direction];
  if (!current || !vector) return null;

  const currentRect = current.getBoundingClientRect();
  const currentX = currentRect.left + currentRect.width / 2;
  const currentY = currentRect.top + currentRect.height / 2;
  let best = null;
  let bestPrimary = Infinity;
  let bestPerpendicular = Infinity;

  candidates.forEach((candidate) => {
    if (candidate === current) return;
    const rect = candidate.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const primary = (x - currentX) * vector.x + (y - currentY) * vector.y;
    if (primary >= -1) return;

    const perpendicular = Math.abs((x - currentX) * vector.y - (y - currentY) * vector.x);
    if (primary < bestPrimary || (primary === bestPrimary && perpendicular < bestPerpendicular)) {
      best = candidate;
      bestPrimary = primary;
      bestPerpendicular = perpendicular;
    }
  });

  return best;
}

/** Maps a Gamepad axes/buttons snapshot to one cardinal direction. */
export function readGamepadDirection(gamepad, deadzone = 0.35) {
  if (!gamepad) return null;

  const pressed = (index) => Boolean(gamepad.buttons?.[index]?.pressed ?? gamepad.buttons?.[index]);
  const dpadX = Number(pressed(15)) - Number(pressed(14));
  const dpadY = Number(pressed(13)) - Number(pressed(12));
  let x = dpadX;
  let y = dpadY;

  if (!x && !y) {
    const axisX = Number(gamepad.axes?.[0] || 0);
    const axisY = Number(gamepad.axes?.[1] || 0);
    if (Math.abs(axisX) < deadzone && Math.abs(axisY) < deadzone) return null;
    x = axisX;
    y = axisY;
  }

  if (Math.abs(x) >= Math.abs(y)) return x < 0 ? 'left' : 'right';
  return y < 0 ? 'up' : 'down';
}

function isTextEditingTarget(element) {
  if (!element) return false;
  if (element.isContentEditable || element.getAttribute?.('contenteditable') === 'true') return true;

  const tagName = element.tagName?.toLowerCase();
  if (tagName === 'textarea') return !element.disabled && !element.readOnly && !element.hasAttribute?.('readonly');
  if (tagName !== 'input') return false;
  if (element.disabled || element.readOnly || element.hasAttribute?.('readonly')) return false;

  const type = (element.type || 'text').toLowerCase();
  return !['button', 'submit', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image'].includes(type);
}

function isNativeArrowControl(element) {
  const tagName = element?.tagName?.toLowerCase();
  const type = (element?.type || '').toLowerCase();
  return (
    tagName === 'select' ||
    (tagName === 'input' &&
      !element.disabled &&
      !element.readOnly &&
      !element.hasAttribute?.('readonly') &&
      ['number', 'range', 'radio', 'checkbox'].includes(type)) ||
    element?.getAttribute?.('role') === 'slider'
  );
}

function isNativeActivationTarget(element) {
  const tagName = element?.tagName?.toLowerCase();
  return ['button', 'a', 'input', 'select', 'textarea', 'summary'].includes(tagName);
}

function getActiveScope(root) {
  const scopes = Array.from(root.querySelectorAll(ACTIVE_SCOPE_SELECTOR)).filter(isRendered);
  if (!scopes.length) return null;

  const view = root.defaultView;
  return scopes.reduce((top, scope) => {
    if (!top) return scope;
    const topZ = Number.parseInt(view?.getComputedStyle?.(top).zIndex || '0', 10) || 0;
    const scopeZ = Number.parseInt(view?.getComputedStyle?.(scope).zIndex || '0', 10) || 0;
    return scopeZ >= topZ ? scope : top;
  }, null);
}

function getPreferredFocusTarget(scope, candidates) {
  if (!scope) return null;
  const preferredTargets = scope.querySelectorAll('[autofocus], [data-controller-initial-focus]');
  for (const preferred of preferredTargets) {
    if (!isRendered(preferred)) continue;
    if (candidates.includes(preferred)) return preferred;
    const descendant = candidates.find((candidate) => preferred.contains(candidate));
    if (descendant) return descendant;
  }
  return null;
}

function getInitialFocusTarget(scope, candidates) {
  if (!scope) return candidates[0] || null;
  const preferredTarget = getPreferredFocusTarget(scope, candidates);
  if (preferredTarget) return preferredTarget;
  return candidates[0] || null;
}

function getReturnFocusTarget(root, candidates, preferredTarget) {
  if (candidates.includes(preferredTarget) && isAvailable(preferredTarget)) return preferredTarget;

  const availableMove = candidates.find((candidate) => candidate.hasAttribute?.('data-controller-focus'));
  if (availableMove) return availableMove;

  const preferredIds = [
    'dice',
    'start-game-btn',
    'wizard-next-btn',
    'play-again-btn',
    'open-game-menu-btn',
  ];
  for (const id of preferredIds) {
    const candidate = root.getElementById(id);
    if (candidates.includes(candidate)) return candidate;
  }

  return candidates[0] || null;
}

function buttonPressed(button) {
  return Boolean(button?.pressed ?? button);
}

function adjustNativeControl(element, direction) {
  const tagName = element?.tagName?.toLowerCase();
  const type = (element?.type || '').toLowerCase();

  if (tagName === 'select') {
    if (direction === 'up' || direction === 'down') return false;
    const options = Array.from(element.options || []).filter((option) => !option.disabled);
    if (options.length < 2) return false;
    const currentIndex = options.findIndex((option) => option.value === element.value);
    const step = direction === 'left' || direction === 'up' ? -1 : 1;
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + step));
    if (nextIndex === currentIndex) return false;
    element.value = options[nextIndex].value;
  } else if ((tagName === 'input' && type === 'range') || element.getAttribute?.('role') === 'slider') {
    if (direction === 'up' || direction === 'down') return false;
    const min = Number(element.min || 0);
    const max = Number(element.max || 100);
    const step = Number(element.step || 1) || 1;
    const increment = direction === 'right' || direction === 'up' ? step : -step;
    const value = Number(element.value || min);
    const next = Math.max(min, Math.min(max, value + increment));
    if (next === value) return false;
    const precision = Math.max(0, (String(step).split('.')[1] || '').length);
    element.value = String(Number(next.toFixed(precision)));
  } else {
    return false;
  }

  const EventConstructor = element.ownerDocument?.defaultView?.Event;
  if (EventConstructor) {
    element.dispatchEvent(new EventConstructor('input', { bubbles: true }));
    element.dispatchEvent(new EventConstructor('change', { bubbles: true }));
  }
  return true;
}

function findVisibleCloseControl(root, scopeId, selector) {
  const scope = root.getElementById(scopeId);
  if (!scope || !isRendered(scope)) return null;
  const control = scope.querySelector(selector);
  return isAvailable(control) ? control : null;
}

function closeSafeContext(root) {
  const closeTargets = [
    ['category-selection-modal', '#close-category-selection-btn'],
    ['history-modal', '#close-history-btn'],
    ['suggestion-modal', '#close-suggestion-modal-btn'],
  ];

  for (const [scopeId, selector] of closeTargets) {
    const control = findVisibleCloseControl(root, scopeId, selector);
    if (control) {
      control.click();
      return true;
    }
  }

  const menu = root.getElementById('game-menu-panel');
  const overlay = root.getElementById('game-menu-overlay');
  if (menu && hasClass(menu, 'visible') && overlay && isRendered(overlay)) {
    overlay.click();
    return true;
  }

  const activeEmojiPanel = root.querySelector('.emoji-panel.active');
  if (activeEmojiPanel) {
    activeEmojiPanel.classList.remove('active');
    const trigger = activeEmojiPanel.parentElement?.querySelector('.emoji-button');
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.focus();
    return true;
  }

  const wizardBack = root.getElementById('wizard-back-btn');
  if (isAvailable(wizardBack)) {
    wizardBack.click();
    return true;
  }

  return false;
}

function toggleGameMenu(root) {
  const menu = root.getElementById('game-menu-panel');
  const overlay = root.getElementById('game-menu-overlay');
  if (menu && hasClass(menu, 'visible') && overlay && isRendered(overlay)) {
    overlay.click();
    return true;
  }

  const scope = getActiveScope(root);
  if (scope) return false;

  const openButton = root.getElementById('open-game-menu-btn');
  if (isAvailable(openButton)) {
    openButton.click();
    return true;
  }

  return false;
}

function focusAndReveal(element, root) {
  if (!element || !isAvailable(element)) return false;
  element.focus?.({ preventScroll: true });
  element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  return root.activeElement === element || element === root.activeElement;
}

/** Creates and attaches keyboard/gamepad controls. */
export function setupInputControls({
  document: doc = document,
  window: win = window,
  deadzone = 0.35,
  pollIntervalMs = 70,
  now = () => Date.now(),
} = {}) {
  if (!doc?.addEventListener || !win) return () => {};

  let activeScope = null;
  let returnFocusTarget = null;
  let gamepadFocus = null;
  let lastFocusedControl = null;
  let pendingDiceFocusRecovery = false;
  let pendingDiceFocusWasGamepad = false;
  let pendingPreferredFocus = false;
  let lastDirection = null;
  let lastMoveAt = 0;
  const buttonsByGamepad = new Map();

  const focusTarget = (element, isGamepad = false) => {
    if (!element) return false;
    if (gamepadFocus && gamepadFocus !== element) delete gamepadFocus.dataset?.gamepadFocus;
    if (isGamepad) {
      element.dataset.gamepadFocus = 'true';
      gamepadFocus = element;
    } else {
      delete element?.dataset?.gamepadFocus;
      gamepadFocus = null;
    }
    const focused = focusAndReveal(element, doc);
    if (focused) lastFocusedControl = element;
    return focused;
  };

  const getCandidates = () => {
    const scope = getActiveScope(doc);
    return { scope, candidates: getFocusableElements(scope || doc) };
  };

  const syncScope = () => {
    const { scope, candidates } = getCandidates();

    // Chromium can move focus to the first remaining page control when a focused
    // native button becomes disabled. Remember the die blur until its legal move
    // buttons are available, then restore game focus before menu navigation wins.
    if (pendingDiceFocusRecovery && !scope) {
      const target =
        candidates.find((candidate) => candidate.hasAttribute?.('data-controller-focus')) ||
        candidates.find((candidate) => candidate.id === 'dice');
      if (target) {
        const isGamepadFocus = pendingDiceFocusWasGamepad;
        pendingDiceFocusRecovery = false;
        pendingDiceFocusWasGamepad = false;
        focusTarget(target, isGamepadFocus);
      }
    }

    if (scope !== activeScope) {
      if (scope) {
        if (!activeScope) returnFocusTarget = doc.activeElement;
        activeScope = scope;
        pendingPreferredFocus = false;
        const target = getInitialFocusTarget(scope, candidates);
        const hasPreferred = scope.querySelector('[autofocus], [data-controller-initial-focus]');
        pendingPreferredFocus = Boolean(hasPreferred && !getPreferredFocusTarget(scope, candidates));
        if (!scope.contains(doc.activeElement)) focusTarget(target);
      } else {
        activeScope = null;
        pendingPreferredFocus = false;
        const fallback = getReturnFocusTarget(doc, candidates, returnFocusTarget);
        if (fallback) focusTarget(fallback);
        returnFocusTarget = null;
      }
    } else if (scope && !scope.contains(doc.activeElement)) {
      focusTarget(getInitialFocusTarget(scope, candidates));
    } else if (scope && !candidates.includes(doc.activeElement) && lastFocusedControl === doc.activeElement) {
      focusTarget(getInitialFocusTarget(scope, candidates));
    } else if (scope && pendingPreferredFocus) {
      const preferredTarget = getPreferredFocusTarget(scope, candidates);
      if (preferredTarget) {
        focusTarget(preferredTarget);
        pendingPreferredFocus = false;
      }
    } else if (!scope && candidates.includes(doc.activeElement)) {
      lastFocusedControl = doc.activeElement;
    } else if (!scope && lastFocusedControl && doc.activeElement === lastFocusedControl) {
      const fallback = getReturnFocusTarget(doc, candidates, null);
      if (fallback) focusTarget(fallback);
    }
  };

  const moveFocus = (direction, isGamepad = false) => {
    syncScope();
    const { candidates: allCandidates } = getCandidates();
    const legalMoveCandidates = allCandidates.filter((candidate) =>
      candidate.hasAttribute?.('data-controller-focus')
    );
    const candidates = legalMoveCandidates.length ? legalMoveCandidates : allCandidates;
    if (!candidates.length) return false;

    const current = candidates.includes(doc.activeElement) ? doc.activeElement : null;
    if (isGamepad && current && adjustNativeControl(current, direction)) return true;
    if (!isGamepad && (isTextEditingTarget(doc.activeElement) || isNativeArrowControl(doc.activeElement))) {
      return false;
    }

    if (!current) {
      const fallback = getReturnFocusTarget(doc, candidates, null);
      if (!fallback) return false;
      pendingPreferredFocus = false;
      return focusTarget(fallback, isGamepad);
    }

    const target = findDirectionalTarget(current, candidates, direction);
    const wrappedTarget = target || findWrappedDirectionalTarget(current, candidates, direction);
    if (!wrappedTarget) return false;
    pendingPreferredFocus = false;
    return focusTarget(wrappedTarget, isGamepad);
  };

  const activateFocused = () => {
    syncScope();
    const { candidates } = getCandidates();
    const target = candidates.includes(doc.activeElement)
      ? doc.activeElement
      : getInitialFocusTarget(getActiveScope(doc), candidates);
    if (!target || !isAvailable(target)) return false;
    focusTarget(target, true);
    target.click?.();
    return true;
  };

  const handleBack = (event) => {
    syncScope();
    if (
      event &&
      (isTextEditingTarget(doc.activeElement) || doc.activeElement?.tagName?.toLowerCase() === 'select')
    ) {
      return false;
    }
    const handled = closeSafeContext(doc);
    if (handled) {
      event?.preventDefault?.();
      syncScope();
    }
    return handled;
  };

  const onKeyDown = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    syncScope();

    if (event.key === 'Tab' && activeScope) {
      const candidates = getFocusableElements(activeScope);
      if (!candidates.length) return;
      const currentIndex = candidates.indexOf(doc.activeElement);
      const nextIndex =
        currentIndex === -1
          ? event.shiftKey
            ? candidates.length - 1
            : 0
          : (currentIndex + (event.shiftKey ? -1 : 1) + candidates.length) % candidates.length;
      event.preventDefault();
      focusTarget(candidates[nextIndex]);
      return;
    }

    if (event.key === 'Escape') {
      handleBack(event);
      return;
    }

    const direction = DIRECTION_KEYS[event.key] || DIRECTION_KEYS[event.key.toLowerCase()];
    if (direction) {
      if (isTextEditingTarget(doc.activeElement) || isNativeArrowControl(doc.activeElement)) return;
      if (moveFocus(direction)) event.preventDefault();
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && !isNativeActivationTarget(doc.activeElement)) {
      if (doc.activeElement?.getAttribute?.('role') === 'button') {
        event.preventDefault();
        doc.activeElement.click?.();
      }
    }
  };

  const onFocusIn = (event) => {
    if (event.target && isAvailable(event.target)) lastFocusedControl = event.target;
    if (event.target !== gamepadFocus && gamepadFocus) {
      delete gamepadFocus.dataset?.gamepadFocus;
      gamepadFocus = null;
    }
    syncScope();
  };

  const onBlur = (event) => {
    if (event.target?.id === 'dice' && !isAvailable(event.target)) {
      pendingDiceFocusRecovery = true;
      pendingDiceFocusWasGamepad = event.target.dataset?.gamepadFocus === 'true';
    }
  };

  const pollGamepads = () => {
    syncScope();
    const gamepads = win.navigator?.getGamepads?.();
    if (!gamepads) return;

    const time = now();
    let activeDirection = null;
    for (const gamepad of Array.from(gamepads)) {
      if (!gamepad) continue;
      const priorButtons = buttonsByGamepad.get(gamepad.index) || [];
      const button0 = buttonPressed(gamepad.buttons?.[0]);
      const button1 = buttonPressed(gamepad.buttons?.[1]);
      const button9 = buttonPressed(gamepad.buttons?.[9]);
      const button0WasPressed = Boolean(priorButtons[0]);
      const button1WasPressed = Boolean(priorButtons[1]);
      const button9WasPressed = Boolean(priorButtons[9]);
      buttonsByGamepad.set(gamepad.index, { 0: button0, 1: button1, 9: button9 });

      if (button0 && !button0WasPressed) activateFocused();
      if (button1 && !button1WasPressed) handleBack();
      if (button9 && !button9WasPressed) toggleGameMenu(doc);

      if (!activeDirection) activeDirection = readGamepadDirection(gamepad, deadzone);
    }

    if (activeDirection) {
      const isFirstMove = activeDirection !== lastDirection;
      const repeatReady =
        !isFirstMove &&
        time - directionStartedAt >= GAMEPAD_REPEAT_DELAY_MS &&
        time - lastMoveAt >= GAMEPAD_REPEAT_INTERVAL_MS;
      if (isFirstMove || repeatReady) {
        moveFocus(activeDirection, true);
        if (isFirstMove) directionStartedAt = time;
        lastMoveAt = time;
      }
    } else {
      lastDirection = null;
      lastMoveAt = 0;
      directionStartedAt = 0;
    }

    if (activeDirection) lastDirection = activeDirection;
  };

  let directionStartedAt = 0;
  doc.addEventListener('keydown', onKeyDown);
  doc.addEventListener('focusin', onFocusIn);
  doc.addEventListener('blur', onBlur, true);
  const intervalId = win.setInterval?.(pollGamepads, pollIntervalMs);
  const onGamepadConnected = () => {
    buttonsByGamepad.clear();
    syncScope();
  };
  const onGamepadDisconnected = (event) => {
    if (event.gamepad) buttonsByGamepad.delete(event.gamepad.index);
    if (buttonsByGamepad.size === 0) {
      lastDirection = null;
      lastMoveAt = 0;
    }
  };
  win.addEventListener?.('gamepadconnected', onGamepadConnected);
  win.addEventListener?.('gamepaddisconnected', onGamepadDisconnected);

  const observer = win.MutationObserver
    ? new win.MutationObserver(syncScope)
    : null;
  observer?.observe(doc.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['class', 'hidden', 'aria-hidden', 'aria-disabled', 'disabled', 'inert'],
  });
  syncScope();

  return () => {
    doc.removeEventListener('keydown', onKeyDown);
    doc.removeEventListener('focusin', onFocusIn);
    doc.removeEventListener('blur', onBlur, true);
    win.removeEventListener?.('gamepadconnected', onGamepadConnected);
    win.removeEventListener?.('gamepaddisconnected', onGamepadDisconnected);
    if (intervalId !== undefined) win.clearInterval?.(intervalId);
    observer?.disconnect();
    if (gamepadFocus) delete gamepadFocus.dataset?.gamepadFocus;
  };
}

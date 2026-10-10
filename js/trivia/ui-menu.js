/**
 * @file ui-menu.js
 * Side menu setup for trivia UI.
 */

import { UI } from './dom.js';
import { showHistoryModal } from './ui-history.js';

/**
 * Sets up the side menu panel for game options.
 */
export function setupGameMenu() {
  const openBtn = UI.openGameMenuBtn;
  const panel = UI.gameMenuPanel;
  const overlay = UI.gameMenuOverlay;

  function closeMenu(restoreFocus = true) {
    panel?.classList.remove('visible');
    overlay?.classList.remove('visible');
    panel?.setAttribute('aria-hidden', 'true');
    overlay?.setAttribute('aria-hidden', 'true');
    if (panel) panel.inert = true;
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    if (restoreFocus) openBtn?.focus();
  }

  function openMenu() {
    panel?.classList.add('visible');
    overlay?.classList.add('visible');
    panel?.setAttribute('aria-hidden', 'false');
    overlay?.setAttribute('aria-hidden', 'false');
    if (panel) panel.inert = false;
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    panel
      ?.querySelector('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled])')
      ?.focus();
  }

  closeMenu(false);

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  if (UI.showHistoryBtn) {
    UI.showHistoryBtn.addEventListener('click', () => {
      closeMenu(false);
      showHistoryModal();
    });
  }
}

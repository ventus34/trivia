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

  function closeMenu() {
    panel.classList.remove('visible');
    overlay.classList.remove('visible');
  }

  function openMenu() {
    panel.classList.add('visible');
    overlay.classList.add('visible');
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  if (UI.showHistoryBtn) {
    UI.showHistoryBtn.addEventListener('click', () => {
      closeMenu();
      showHistoryModal();
    });
  }

  initScalingControls();
}

function initScalingControls() {
  const configs = [
    {
      key: 'trivia_scale_dice',
      cssVar: '--dice-scale',
      slider: UI.scaleDiceSlider,
      label: UI.scaleDiceVal,
      defaultVal: 1.0,
    },
    {
      key: 'trivia_scale_board',
      cssVar: '--board-scale',
      slider: UI.scaleBoardSlider,
      label: UI.scaleBoardVal,
      defaultVal: 1.0,
    },
    {
      key: 'trivia_scale_descriptions',
      cssVar: '--move-desc-scale',
      slider: UI.scaleDescriptionsSlider,
      label: UI.scaleDescriptionsVal,
      defaultVal: 1.0,
    },
    {
      key: 'trivia_scale_question',
      cssVar: '--question-scale',
      slider: UI.scaleQuestionSlider,
      label: UI.scaleQuestionVal,
      defaultVal: 1.0,
    },
  ];

  configs.forEach((cfg) => {
    if (!cfg.slider) return;

    // Load value
    const savedVal = localStorage.getItem(cfg.key);
    const val = savedVal !== null ? parseFloat(savedVal) : cfg.defaultVal;

    // Apply initial value
    cfg.slider.value = val;
    if (cfg.label) cfg.label.textContent = `${val.toFixed(2)}x`;
    document.documentElement.style.setProperty(cfg.cssVar, val);

    // Event listener
    cfg.slider.addEventListener('input', (e) => {
      const currentVal = parseFloat(e.target.value);
      if (cfg.label) cfg.label.textContent = `${currentVal.toFixed(2)}x`;
      document.documentElement.style.setProperty(cfg.cssVar, currentVal);
      localStorage.setItem(cfg.key, currentVal);
    });
  });
}

function applyTheme(theme) {
  document.documentElement.className = theme === 'light' ? '' : theme;
  localStorage.setItem('trivia_theme', theme);
}

function initializeThemeSwitcher() {
  const switcher = document.getElementById('theme-switcher');
  if (!switcher) return;

  // Set the active button based on the saved theme
  const savedTheme = localStorage.getItem('trivia_theme') || 'oled';
  const currentRadio = switcher.querySelector(`input[value="${savedTheme}"]`);
  if (currentRadio) {
    currentRadio.checked = true;
  }

  switcher.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    applyTheme(selectedTheme);
  });
}

// Initialize after the DOM has loaded
document.addEventListener('DOMContentLoaded', initializeThemeSwitcher);

/** Keep the independently persisted display preference in sync across controls. */
function initializeDisplayControls() {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('[data-display-tv]');
  const fullscreenButtons = document.querySelectorAll('[data-display-fullscreen]');
  const applyMode = (mode) => {
    const normalized = mode === 'tv' ? 'tv' : 'standard';
    root.dataset.displayMode = normalized;
    toggles.forEach((toggle) => { toggle.checked = normalized === 'tv'; });
    window.dispatchEvent(new Event('resize'));
  };
  let savedMode = 'standard';
  try { savedMode = localStorage.getItem('trivia_display_mode') || 'standard'; } catch { /* Storage may be unavailable. */ }
  applyMode(savedMode);
  toggles.forEach((toggle) => toggle.addEventListener('change', () => {
    const mode = toggle.checked ? 'tv' : 'standard';
    try { localStorage.setItem('trivia_display_mode', mode); } catch { /* Keep the current session usable. */ }
    applyMode(mode);
  }));
  const syncFullscreen = () => fullscreenButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
  });
  fullscreenButtons.forEach((button) => {
    button.hidden = !document.fullscreenEnabled;
    button.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await root.requestFullscreen();
      } catch (error) {
        console.warn('Fullscreen unavailable:', error);
      }
      syncFullscreen();
    });
  });
  document.addEventListener('fullscreenchange', syncFullscreen);
  syncFullscreen();
  window.addEventListener('storage', (event) => {
    if (event.key === 'trivia_display_mode') applyMode(event.newValue);
  });
}

document.addEventListener('DOMContentLoaded', initializeDisplayControls);

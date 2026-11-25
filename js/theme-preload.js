(() => {
  let theme = 'oled';
  let displayMode = 'standard';
  try {
    const savedTheme = localStorage.getItem('trivia_theme');
    if (['light', 'dark', 'oled'].includes(savedTheme)) theme = savedTheme;
    if (localStorage.getItem('trivia_display_mode') === 'tv') displayMode = 'tv';
  } catch {
    // Storage can be unavailable on a fresh or restricted profile.
  }
  const root = document.documentElement;
  root.dataset.displayMode = displayMode;
  if (theme !== 'light') root.classList.add(theme);
})();

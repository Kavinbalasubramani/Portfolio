export const getSavedTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return window.localStorage.getItem('portfolio-theme') || document.documentElement.dataset.theme || 'dark';
};

export const applyTheme = (theme) => {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  window.localStorage.setItem('portfolio-theme', nextTheme);
  window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: nextTheme }));
  return nextTheme;
};

export const subscribeToTheme = (callback) => {
  const update = () => callback(getSavedTheme());
  window.addEventListener('portfolio-theme-change', update);
  window.addEventListener('storage', update);
  return () => {
    window.removeEventListener('portfolio-theme-change', update);
    window.removeEventListener('storage', update);
  };
};

import type { Theme, ThemeStorage } from './types.js';

/**
 * Core theme manager class
 * Handles theme detection, storage, and application
 */
export class ThemeManager {
  private storage: ThemeStorage;

  constructor(storage: ThemeStorage) {
    this.storage = storage;
  }

  /**
   * Get system color scheme preference
   * @returns 'dark' if system prefers dark mode, 'light' otherwise
   */
  getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Get current active theme
   * Returns stored preference if exists, otherwise system theme
   * @returns Current theme
   */
  getCurrentTheme(): Theme {
    return this.storage.get() || this.getSystemTheme();
  }

  /**
   * Set theme and apply to DOM
   * @param theme - Theme to set
   */
  setTheme(theme: Theme): void {
    this.storage.set(theme);
    this.applyTheme(theme);
  }

  /**
   * Clear stored theme preference
   * Falls back to system theme
   */
  clearTheme(): void {
    this.storage.remove();
    this.applyTheme(this.getSystemTheme());
  }

  /**
   * Toggle between light and dark themes
   * @returns New theme after toggle
   */
  toggleTheme(): Theme {
    const current = this.getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
    return next;
  }

  /**
   * Apply theme to document
   * Sets data-theme attribute on <html> element
   * @param theme - Theme to apply
   */
  applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * Watch for system theme changes
   * Only triggers callback when no stored preference exists
   * @param callback - Function called when system theme changes
   * @returns Cleanup function to remove listener
   */
  watchSystemTheme(callback: (theme: Theme) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only respond to system changes if no stored preference
      if (!this.storage.get()) {
        const theme = e.matches ? 'dark' : 'light';
        this.applyTheme(theme);
        callback(theme);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
}


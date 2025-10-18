/**
 * Theme type - light or dark mode
 */
export type Theme = 'light' | 'dark';

/**
 * Storage interface for persisting theme preference
 */
export interface ThemeStorage {
  /**
   * Get stored theme preference
   * @returns Theme if stored, null if not set
   */
  get(): Theme | null;

  /**
   * Store theme preference
   * @param theme - Theme to store
   */
  set(theme: Theme): void;

  /**
   * Remove stored theme preference
   */
  remove(): void;
}


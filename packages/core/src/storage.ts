import type { Theme, ThemeStorage } from './types.js';

/**
 * Cookie-based storage adapter
 * Stores theme preference in a browser cookie
 */
export class CookieStorage implements ThemeStorage {
  private cookieName: string;

  constructor(cookieName = 'theme') {
    this.cookieName = cookieName;
  }

  get(): Theme | null {
    if (typeof document === 'undefined') return null;

    const value = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${this.cookieName}=`))
      ?.split('=')[1];

    if (value === 'light' || value === 'dark') return value;
    return null;
  }

  set(theme: Theme): void {
    if (typeof document === 'undefined') return;
    // Set cookie for 1 year
    document.cookie = `${this.cookieName}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }

  remove(): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${this.cookieName}=; path=/; max-age=0`;
  }
}

/**
 * localStorage-based storage adapter
 * Stores theme preference in browser localStorage
 */
export class LocalStorage implements ThemeStorage {
  private key: string;

  constructor(key = 'theme') {
    this.key = key;
  }

  get(): Theme | null {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(this.key);
      if (value === 'light' || value === 'dark') return value;
      return null;
    } catch {
      return null;
    }
  }

  set(theme: Theme): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.key, theme);
    } catch {
      // Fail silently (localStorage might be disabled)
    }
  }

  remove(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this.key);
    } catch {
      // Fail silently
    }
  }
}


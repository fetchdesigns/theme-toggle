import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CookieStorage, LocalStorage } from '../src/storage';

describe('CookieStorage', () => {
  let storage: CookieStorage;

  beforeEach(() => {
    storage = new CookieStorage('theme');
    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'theme=; path=/; max-age=0';
    }
  });

  describe('get', () => {
    it('returns "light" for valid light theme cookie', () => {
      document.cookie = 'theme=light; path=/';
      expect(storage.get()).toBe('light');
    });

    it('returns "dark" for valid dark theme cookie', () => {
      document.cookie = 'theme=dark; path=/';
      expect(storage.get()).toBe('dark');
    });

    it('returns null when cookie does not exist', () => {
      expect(storage.get()).toBeNull();
    });

    it('returns null for invalid cookie value', () => {
      document.cookie = 'theme=invalid; path=/';
      expect(storage.get()).toBeNull();
    });

    it('uses custom cookie name', () => {
      const customStorage = new CookieStorage('myTheme');
      document.cookie = 'myTheme=dark; path=/';
      expect(customStorage.get()).toBe('dark');
    });
  });

  describe('set', () => {
    it('sets light theme cookie', () => {
      storage.set('light');
      expect(document.cookie).toContain('theme=light');
    });

    it('sets dark theme cookie', () => {
      storage.set('dark');
      expect(document.cookie).toContain('theme=dark');
    });

    it('overwrites existing cookie', () => {
      storage.set('light');
      storage.set('dark');
      expect(storage.get()).toBe('dark');
    });

    it('uses custom cookie name', () => {
      const customStorage = new CookieStorage('myTheme');
      customStorage.set('dark');
      expect(document.cookie).toContain('myTheme=dark');
    });
  });

  describe('remove', () => {
    it('removes theme cookie', () => {
      storage.set('dark');
      storage.remove();
      expect(storage.get()).toBeNull();
    });

    it('removes custom named cookie', () => {
      const customStorage = new CookieStorage('myTheme');
      customStorage.set('dark');
      customStorage.remove();
      expect(customStorage.get()).toBeNull();
    });
  });
});

describe('LocalStorage', () => {
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage('theme');
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('get', () => {
    it('returns "light" for valid light theme', () => {
      localStorage.setItem('theme', 'light');
      expect(storage.get()).toBe('light');
    });

    it('returns "dark" for valid dark theme', () => {
      localStorage.setItem('theme', 'dark');
      expect(storage.get()).toBe('dark');
    });

    it('returns null when key does not exist', () => {
      expect(storage.get()).toBeNull();
    });

    it('returns null for invalid value', () => {
      localStorage.setItem('theme', 'invalid');
      expect(storage.get()).toBeNull();
    });

    it('uses custom key name', () => {
      const customStorage = new LocalStorage('myTheme');
      localStorage.setItem('myTheme', 'dark');
      expect(customStorage.get()).toBe('dark');
    });

    it('handles localStorage errors gracefully', () => {
      const customStorage = new LocalStorage('theme');
      
      // Mock localStorage.getItem to throw
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage disabled');
      });

      expect(customStorage.get()).toBeNull();
      
      // Restore
      Storage.prototype.getItem = originalGetItem;
    });
  });

  describe('set', () => {
    it('sets light theme', () => {
      storage.set('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('sets dark theme', () => {
      storage.set('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('overwrites existing value', () => {
      storage.set('light');
      storage.set('dark');
      expect(storage.get()).toBe('dark');
    });

    it('uses custom key name', () => {
      const customStorage = new LocalStorage('myTheme');
      customStorage.set('dark');
      expect(localStorage.getItem('myTheme')).toBe('dark');
    });

    it('handles localStorage errors gracefully', () => {
      const customStorage = new LocalStorage('theme');
      
      // Mock localStorage.setItem to throw
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });

      // Should not throw
      expect(() => customStorage.set('dark')).not.toThrow();
      
      // Restore
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('remove', () => {
    it('removes theme from localStorage', () => {
      storage.set('dark');
      storage.remove();
      expect(storage.get()).toBeNull();
    });

    it('removes custom key', () => {
      const customStorage = new LocalStorage('myTheme');
      customStorage.set('dark');
      customStorage.remove();
      expect(customStorage.get()).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      const customStorage = new LocalStorage('theme');
      
      // Mock localStorage.removeItem to throw
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage disabled');
      });

      // Should not throw
      expect(() => customStorage.remove()).not.toThrow();
      
      // Restore
      Storage.prototype.removeItem = originalRemoveItem;
    });
  });
});


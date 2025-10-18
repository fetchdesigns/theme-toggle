import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from '../src/theme-manager';
import type { Theme, ThemeStorage } from '../src/types';

// Mock storage implementation
class MockStorage implements ThemeStorage {
  private value: Theme | null = null;

  get(): Theme | null {
    return this.value;
  }

  set(theme: Theme): void {
    this.value = theme;
  }

  remove(): void {
    this.value = null;
  }
}

describe('ThemeManager', () => {
  let mockStorage: MockStorage;
  let manager: ThemeManager;

  beforeEach(() => {
    // Reset DOM
    if (typeof document !== 'undefined') {
      document.documentElement.removeAttribute('data-theme');
    }
    
    mockStorage = new MockStorage();
    manager = new ThemeManager(mockStorage);
    
    // Reset mocks
    vi.clearAllMocks();
  });

  describe('getSystemTheme', () => {
    it('returns "light" when no dark preference', () => {
      // Mock matchMedia to return false for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(manager.getSystemTheme()).toBe('light');
    });

    it('returns "dark" when prefers dark mode', () => {
      // Mock matchMedia to return true for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(manager.getSystemTheme()).toBe('dark');
    });
  });

  describe('getCurrentTheme', () => {
    it('returns stored theme when available', () => {
      mockStorage.set('dark');
      expect(manager.getCurrentTheme()).toBe('dark');
    });

    it('returns system theme when no stored preference', () => {
      // Mock system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: true, // Dark mode
          media: '(prefers-color-scheme: dark)',
        })),
      });

      expect(manager.getCurrentTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('stores theme in storage', () => {
      manager.setTheme('dark');
      expect(mockStorage.get()).toBe('dark');
    });

    it('applies theme to DOM', () => {
      manager.setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('clearTheme', () => {
    it('removes theme from storage', () => {
      mockStorage.set('dark');
      manager.clearTheme();
      expect(mockStorage.get()).toBeNull();
    });

    it('applies system theme to DOM after clearing', () => {
      // Mock system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false, // Light mode
          media: '(prefers-color-scheme: dark)',
        })),
      });

      mockStorage.set('dark');
      manager.clearTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    beforeEach(() => {
      // Mock matchMedia to return light as system preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: '(prefers-color-scheme: dark)',
        })),
      });
    });

    it('switches light to dark', () => {
      mockStorage.set('light');
      const result = manager.toggleTheme();
      expect(result).toBe('dark');
      expect(mockStorage.get()).toBe('dark');
    });

    it('switches dark to light', () => {
      mockStorage.set('dark');
      const result = manager.toggleTheme();
      expect(result).toBe('light');
      expect(mockStorage.get()).toBe('light');
    });

    it('uses system theme when no stored preference', () => {
      // System theme is light (from beforeEach mock)
      const result = manager.toggleTheme();
      expect(result).toBe('dark'); // Toggles light to dark
      expect(mockStorage.get()).toBe('dark');
    });

    it('applies toggled theme to DOM', () => {
      mockStorage.set('light');
      manager.toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('applyTheme', () => {
    it('sets data-theme="light" on html element', () => {
      manager.applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('sets data-theme="dark" on html element', () => {
      manager.applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('overwrites existing data-theme', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      manager.applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('watchSystemTheme', () => {
    it('calls callback when system theme changes', () => {
      const callback = vi.fn();
      const mediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue(mediaQuery),
      });

      manager.watchSystemTheme(callback);

      // Simulate system theme change
      const handler = mediaQuery.addEventListener.mock.calls[0][1];
      handler({ matches: true } as MediaQueryListEvent);

      expect(callback).toHaveBeenCalledWith('dark');
    });

    it('does not call callback when stored preference exists', () => {
      const callback = vi.fn();
      mockStorage.set('light'); // Set stored preference

      const mediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue(mediaQuery),
      });

      manager.watchSystemTheme(callback);

      // Simulate system theme change
      const handler = mediaQuery.addEventListener.mock.calls[0][1];
      handler({ matches: true } as MediaQueryListEvent);

      expect(callback).not.toHaveBeenCalled();
    });

    it('returns cleanup function that removes listener', () => {
      const callback = vi.fn();
      const mediaQuery = {
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue(mediaQuery),
      });

      const cleanup = manager.watchSystemTheme(callback);
      cleanup();

      expect(mediaQuery.removeEventListener).toHaveBeenCalled();
    });
  });
});


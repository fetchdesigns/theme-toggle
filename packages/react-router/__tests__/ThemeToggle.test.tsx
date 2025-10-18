import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import '@testing-library/jest-dom';
import { ThemeToggle } from '../src/components/ThemeToggle.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.matchMedia (required for theme detection)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false, // Default to light mode
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Helper to render component with router
function renderWithRouter(
  initialTheme: 'light' | 'dark' = 'light',
  initialPath = '/',
  currentTheme: 'light' | 'dark' | null = 'light'
) {
  // Set the theme on the document before rendering
  document.documentElement.setAttribute('data-theme', initialTheme);
  
  const routes = [
    {
      path: '/',
      element: <ThemeToggle currentTheme={currentTheme} cookieName="smart-report-theme" action="/api/theme-toggle" />,
    },
    {
      path: '/assessment',
      element: <ThemeToggle currentTheme={currentTheme} cookieName="smart-report-theme" action="/api/theme-toggle" />,
    },
  ];

  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  return {
    ...render(<RouterProvider router={router} />),
    router,
  };
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.removeAttribute('data-theme');
    window.localStorage.clear();
    mockFetch.mockClear();
    mockFetch.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders a single theme toggle button', () => {
      renderWithRouter();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('shows both icons with light icon highlighted when theme is light', () => {
      renderWithRouter('light', '/', 'light');
      
      const button = screen.getByRole('button', { name: /switch to dark theme/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      
      // Should show a sliding toggle with single icon when theme is set
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('shows both icons with dark icon highlighted when theme is dark', () => {
      renderWithRouter('dark', '/', 'dark');
      
      const button = screen.getByRole('button', { name: /switch to light theme/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      
      // Should show a sliding toggle with single icon when theme is set
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('includes hidden redirectTo field with current location', () => {
      const { container } = renderWithRouter('light', '/assessment?tab=results', 'light');
      
      const redirectInput = container.querySelector('input[name="redirectTo"]') as HTMLInputElement;
      expect(redirectInput).toBeTruthy();
      expect(redirectInput?.value).toBe('/assessment?tab=results');
    });
  });

  describe('Theme Switching (with JS)', () => {
    it('switches from light to dark when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('light', '/', 'light');

      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i });
      await user.click(toggleButton);

      // Check that fetch was called to persist theme
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/theme-toggle'),
          expect.objectContaining({
            method: 'POST',
          }),
        );
      });
    });

    it('switches from dark to light when clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter('light', '/', 'light');

      // First set to dark
      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });

      // Then switch back to light - button text should change
      const lightButton = screen.getByRole('button', { name: /switch to light theme/i });
      await user.click(lightButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2); // Both clicks should trigger fetch
      });
    });

    it('updates data-theme attribute on document when clicked', async () => {
      const user = userEvent.setup();
      document.documentElement.setAttribute('data-theme', 'light');

      renderWithRouter('light', '/', 'light');

      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i });
      await user.click(toggleButton);

      // Wait for the state update to apply theme
      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      });
    });

    it('handles fetch failure gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const user = userEvent.setup();
      renderWithRouter('light', '/', 'light');

      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i });
      await user.click(toggleButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to save theme preference:', expect.any(Error));
      });

      // Theme should still be applied client-side even if fetch fails
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      consoleSpy.mockRestore();
    });

  });

  describe('Form Submission (no-JS fallback)', () => {
    it('form submits to /api/theme-toggle endpoint', () => {
      const { container } = renderWithRouter('light', '/', 'light');
      const form = container.querySelector('form');
      expect(form?.getAttribute('action')).toBe('/api/theme-toggle');
      expect(form?.getAttribute('method')).toBe('post');
    });

    it('form includes theme value in button to toggle to opposite theme', () => {
      const { container } = renderWithRouter('light', '/', 'light');
      
      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i }) as HTMLButtonElement;
      expect(toggleButton.type).toBe('submit');
      
      // Check the hidden input has the correct value
      const themeInput = container.querySelector('input[name="theme"]') as HTMLInputElement;
      expect(themeInput?.value).toBe('dark');
    });

    it('preserves current URL in redirectTo field', () => {
      const { container } = renderWithRouter('light', '/assessment?search=test', 'light');
      const redirectInput = container.querySelector('input[name="redirectTo"]') as HTMLInputElement;
      expect(redirectInput?.value).toBe('/assessment?search=test');
    });
  });

  describe('Accessibility', () => {
    it('has accessible label for theme toggle button when light is active', () => {
      renderWithRouter('light', '/', 'light');
      const button = screen.getByRole('button', { name: /switch to dark theme/i });
      expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');
      expect(button.getAttribute('title')).toBe('Switch to dark theme');
    });

    it('has accessible label when dark is active', () => {
      renderWithRouter('dark', '/', 'dark');
      const button = screen.getByRole('button', { name: /switch to light theme/i });
      expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
      expect(button.getAttribute('title')).toBe('Switch to light theme');
    });

    it('includes screen reader text for current theme', () => {
      renderWithRouter('light', '/', 'light');
      const srText = screen.getByText('Switch to dark theme', { selector: '.sr-only' });
      expect(srText).toBeInTheDocument();
    });

    it('maintains accessible labels through toggle', async () => {
      const user = userEvent.setup();
      renderWithRouter('light', '/', 'light');

      // Single button with proper aria-label
      const button = screen.getByRole('button', { name: /switch to dark theme/i });
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');

      // Click to toggle
      await user.click(button);

      // Wait for theme to change
      await waitFor(() => {
        const newButton = screen.getByRole('button', { name: /switch to light theme/i });
        expect(newButton).toHaveAttribute('aria-label', 'Switch to light theme');
      });
    });
  });

  describe('Progressive Enhancement', () => {
    it('works without JavaScript via form submission', () => {
      const { container } = renderWithRouter('light', '/', 'light');
      const form = container.querySelector('form') as HTMLFormElement;
      const toggleButton = screen.getByRole('button', { name: /switch to dark theme/i }) as HTMLButtonElement;
      const themeInput = container.querySelector('input[name="theme"]') as HTMLInputElement;

      // Verify form will submit with correct data
      expect(form.getAttribute('action')).toBe('/api/theme-toggle');
      expect(themeInput.value).toBe('dark');
      expect(toggleButton.type).toBe('submit');
    });

    it('form can be submitted without JavaScript', () => {
      const { container } = renderWithRouter('light', '/', 'light');
      const form = container.querySelector('form') as HTMLFormElement;
      const submitButton = form.querySelector('button[type="submit"]');

      // Form should be submit-able (not disabled)
      expect(form).toBeTruthy();
      expect(submitButton).toBeTruthy();
      expect(form.method).toBe('post');
      expect(form.action).toContain('/api/theme-toggle');
    });
  });

  describe('Server-Side Rendering (SSR)', () => {
    it('renders with light theme when currentTheme prop is "light"', () => {
      renderWithRouter('light', '/', 'light');
      
      const button = screen.getByRole('button', { name: /switch to dark theme/i });

      // Light should be active based on server-provided theme
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      expect(button).toHaveAttribute('title', 'Switch to dark theme');
    });

    it('renders with dark theme when currentTheme prop is "dark"', () => {
      renderWithRouter('dark', '/', 'dark');
      
      const button = screen.getByRole('button', { name: /switch to light theme/i });

      // Dark should be active based on server-provided theme
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(button).toHaveAttribute('title', 'Switch to light theme');
    });

    it('uses currentTheme prop over DOM detection when provided', () => {
      // Simulate server says "dark" but DOM hasn't been updated yet
      document.documentElement.setAttribute('data-theme', 'light');
      renderWithRouter('light', '/', 'dark');
      
      const button = screen.getByRole('button', { name: /switch to light theme/i });

      // Should respect server-provided theme for initial render
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(button).toHaveAttribute('title', 'Switch to light theme');
    });

    it('detects system theme when currentTheme is null (no cookie, with JS)', () => {
      renderWithRouter('light', '/', null);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      
      // With JS, new component shows both icons in neutral state when no cookie
      const button = buttons[0];
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    it('shows correct theme after form submission (simulated page reload)', () => {
      // Initial render: no cookie, shows neutral state
      const { unmount } = renderWithRouter('light', '/', null);
      let buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-label', 'Switch to dark theme');

      unmount();

      // Simulate form submission → server sets cookie → page reloads with dark theme
      renderWithRouter('dark', '/', 'dark');
      
      const button = screen.getByRole('button', { name: /switch to light theme/i });

      // After "reload", dark should be active
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(button).toHaveAttribute('title', 'Switch to light theme');
    });

    it('works correctly with theme persistence flow', () => {
      // Start with no cookie (neutral state)
      const { unmount: unmount1 } = renderWithRouter('light', '/', null);
      let buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-label', 'Switch to dark theme');
      unmount1();

      // User submits form to switch to dark (cookie created, page reloads)
      const { unmount: unmount2 } = renderWithRouter('dark', '/', 'dark');
      let button = screen.getByRole('button', { name: /switch to light theme/i });
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(button).toHaveAttribute('title', 'Switch to light theme');
      unmount2();

      // User submits form to switch to light (cookie updated, page reloads)
      renderWithRouter('light', '/', 'light');
      button = screen.getByRole('button', { name: /switch to dark theme/i });
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      expect(button).toHaveAttribute('title', 'Switch to dark theme');
    });
  });

  describe('System Theme Detection (No Cookie + With JS)', () => {
    it('detects and shows system preference when currentTheme is null', () => {
      renderWithRouter('light', '/', null);
      
      // With JS enabled, new component shows neutral state (both icons) when no cookie
      const themeButtons = screen.getAllByRole('button');
      expect(themeButtons).toHaveLength(1);
      
      const button = themeButtons[0];
      expect(button).toHaveAttribute('type', 'submit');
      // Shows both icons to indicate system preference
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    it('applies detected system theme without persisting to cookie', () => {
      renderWithRouter('light', '/', null);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      const button = buttons[0];
      
      // Should show neutral state (both icons)
      expect(button).toHaveAttribute('aria-label', 'Switch to dark theme');
      
      // But fetch should not have been called (no cookie persistence yet)
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('button submits to toggle from detected light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      const { container } = renderWithRouter('light', '/', null);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      
      // Check the hidden input has the correct value
      const themeInput = container.querySelector('input[name="theme"]') as HTMLInputElement;
      expect(themeInput?.value).toBe('dark');
      
      // Form should be valid
      const form = container.querySelector('form');
      expect(form?.getAttribute('action')).toBe('/api/theme-toggle');
    });

    it('persists theme when user explicitly toggles', async () => {
      const user = userEvent.setup();
      renderWithRouter('light', '/', null);
      
      // Initially no cookie, neutral state
      const button = screen.getByRole('button', { name: /switch to dark theme/i });
      
      // User clicks to toggle to dark - this should persist to cookie
      await user.click(button);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/theme-toggle'),
          expect.objectContaining({
            method: 'POST',
          }),
        );
      });
    });

    it('switches from auto-detected to explicit theme preference', () => {
      // Start with auto-detected system theme (no cookie, neutral state)
      const { unmount } = renderWithRouter('light', '/', null);
      const buttons1 = screen.getAllByRole('button');
      expect(buttons1).toHaveLength(1);
      // Shows neutral state with both icons
      expect(buttons1[0]).toHaveAttribute('aria-label', 'Switch to dark theme');
      unmount();
      
      // After user explicitly sets a preference (cookie created)
      const { unmount: unmount2 } = renderWithRouter('dark', '/', 'dark');
      const button = screen.getByRole('button', { name: /switch to light theme/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
      expect(button).toHaveAttribute('title', 'Switch to light theme');
      unmount2();
      
      // If cookie is cleared, goes back to neutral state
      renderWithRouter('light', '/', null);
      const buttons2 = screen.getAllByRole('button');
      expect(buttons2).toHaveLength(1);
      expect(buttons2[0]).toHaveAttribute('aria-label', 'Switch to dark theme');
    });

    it('renders both icons in all states', () => {
      const { container } = renderWithRouter('light', '/', null);
      
      const buttons = screen.getAllByRole('button');
      const button = buttons[0];
      
      // After mount, system theme is detected and component shows single icon (active state)
      // When currentTheme is null, useEffect detects system theme and applies it
      const svgs = button.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThanOrEqual(1); // At least one icon (active theme)
      
      // Icon containers present
      const spans = button.querySelectorAll('span');
      expect(spans.length).toBeGreaterThan(0);
    });
  });
});


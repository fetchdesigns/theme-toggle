import { createCookie } from 'react-router';
import type { Theme } from '@fetchdesigns/theme-toggle-core';

export const THEME_COOKIE_NAME = 'theme';

/**
 * Create a React Router cookie adapter for theme storage
 * @param cookieName - Name of the cookie (default: 'theme')
 * @returns Cookie utilities for React Router
 */
export function createThemeCookie(cookieName = THEME_COOKIE_NAME) {
  /**
   * Theme cookie configuration
   * - 1 year expiration
   * - Secure in production
   * - SameSite Lax for cross-site navigation
   */
  const themeCookie = createCookie(cookieName, {
    maxAge: 365 * 24 * 60 * 60, // 1 year
    httpOnly: false, // Need client-side access for instant theme application
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return {
    /**
     * Get theme from cookie in request
     * Returns null if cookie doesn't exist or has invalid value
     */
    async getTheme(request: Request): Promise<Theme | null> {
      const cookieValue = await themeCookie.parse(request.headers.get('Cookie'));

      if (!cookieValue) {
        return null;
      }

      // Validate cookie value
      if (cookieValue === 'light' || cookieValue === 'dark') {
        return cookieValue;
      }

      return null;
    },

    /**
     * Create cookie header to set theme
     */
    async setTheme(theme: Theme): Promise<string> {
      return await themeCookie.serialize(theme);
    },

    /**
     * Create cookie header to clear theme
     */
    async clearTheme(): Promise<string> {
      return await themeCookie.serialize('', { maxAge: 0 });
    },
  };
}

/**
 * Default theme cookie instance
 */
export const defaultThemeCookie = createThemeCookie();

/**
 * Get theme from cookie (using default cookie name)
 * @deprecated Use createThemeCookie().getTheme() instead for better flexibility
 */
export const getThemeFromCookie = defaultThemeCookie.getTheme;

/**
 * Create cookie header to set theme (using default cookie name)
 * @deprecated Use createThemeCookie().setTheme() instead for better flexibility
 */
export const createThemeCookieHeader = defaultThemeCookie.setTheme;


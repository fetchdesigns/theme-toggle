import { redirect, type ActionFunctionArgs } from 'react-router';
import { createThemeCookie } from './server.js';
import type { Theme } from '@fetchdesigns/theme-toggle-core';

/**
 * Options for the theme action handler
 */
export interface ThemeActionOptions {
  /**
   * Cookie name to use for storing theme preference
   * @default 'theme'
   */
  cookieName?: string;

  /**
   * Default redirect path when redirectTo is not provided
   * @default '/'
   */
  defaultRedirect?: string;
}

/**
 * Creates an action handler for the theme route
 * 
 * @example
 * ```typescript
 * // app/routes/theme.tsx
 * import { createThemeActionHandler } from '@fetchdesigns/theme-toggle-react-router';
 * 
 * export const action = createThemeActionHandler();
 * ```
 * 
 * @example With options
 * ```typescript
 * export const action = createThemeActionHandler({
 *   cookieName: 'myTheme',
 *   defaultRedirect: '/home',
 * });
 * ```
 */
export function createThemeActionHandler(options?: ThemeActionOptions) {
  const cookieName = options?.cookieName ?? 'theme';
  const defaultRedirect = options?.defaultRedirect ?? '/';
  
  return async ({ request }: ActionFunctionArgs) => {
    const themeCookie = createThemeCookie(cookieName);
    const formData = await request.formData();
    const themeValue = formData.get('theme');
    const redirectTo = formData.get('redirectTo') || defaultRedirect;
    
    let theme: Theme;
    
    // Support "toggle" to enable no-JS progressive enhancement
    if (themeValue === 'toggle') {
      const currentTheme = await themeCookie.getTheme(request);
      // Toggle: null/light → dark, dark → light
      theme = currentTheme === 'dark' ? 'light' : 'dark';
    } else if (themeValue === 'light' || themeValue === 'dark') {
      theme = themeValue as Theme;
    } else {
      throw new Response('Invalid theme value', { status: 400 });
    }
    
    const cookieHeader = await themeCookie.setTheme(theme);
    
    // Redirect back to where they came from
    return redirect(redirectTo as string, {
      status: 303,
      headers: {
        'Set-Cookie': cookieHeader,
      },
    });
  };
}


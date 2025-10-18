/**
 * @fetchdesigns/theme-toggle-react-router
 * Theme toggle components for React Router with SSR support
 */

// Components
export { ThemeToggle } from './components/ThemeToggle.js';
export { ThemeScript } from './components/ThemeScript.js';

// Icons (optional exports for customization)
export { SunIcon } from './components/icons/Sun.js';
export { MoonIcon } from './components/icons/Moon.js';

// Route handler
export { createThemeActionHandler } from './route-handler.js';
export type { ThemeActionOptions } from './route-handler.js';

// Server utilities
export {
  createThemeCookie,
  defaultThemeCookie,
  getThemeFromCookie,
  createThemeCookieHeader,
  THEME_COOKIE_NAME,
} from './server.js';

// Re-export types from core
export type { Theme, ThemeStorage } from '@fetchdesigns/theme-toggle-core';


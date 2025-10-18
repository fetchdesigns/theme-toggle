/**
 * ThemeScript
 *
 * Inline script that runs in <head> before CSS loads.
 * Prevents flash of wrong theme on page load.
 *
 * Logic:
 * 1. Read theme cookie
 * 2. If cookie exists: apply it immediately
 * 3. If no cookie: detect system preference and apply
 * 4. Set data-theme attribute on <html> element
 */

interface Props {
  /**
   * Cookie name to read theme from
   * @default 'theme'
   */
  cookieName?: string;
}

export function ThemeScript({ cookieName = 'theme' }: Props = {}) {
  // This script runs synchronously before CSS loads
  const script = `
    (function() {
      // Get system theme preference
      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Read and decode theme cookie (React Router base64 encodes cookie values)
      function getCookie(name) {
        const value = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
        if (!value) return null;
        
        try {
          const cookieValue = decodeURIComponent(value.pop());
          // React Router stores cookies as base64 encoded JSON
          const decoded = atob(cookieValue);
          const parsed = JSON.parse(decoded);
          return parsed;
        } catch (e) {
          return null;
        }
      }
      
      const themeCookie = getCookie('${cookieName}');
      const theme = themeCookie || getSystemTheme();
      
      // Apply theme immediately (before CSS loads)
      if (theme === 'light' || theme === 'dark') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      // No defer/async - must run synchronously
    />
  );
}


import { Form, useLocation } from 'react-router';
import type { Theme } from '@fetchdesigns/theme-toggle-core';
import { ThemeManager, CookieStorage } from '@fetchdesigns/theme-toggle-core';
import { useState, useEffect, useMemo } from 'react';
import { SunIcon } from './icons/Sun.js';
import { MoonIcon } from './icons/Moon.js';

interface Props {
  /**
   * Current theme from server (cookie)
   * null means no preference stored (use system theme)
   */
  currentTheme: Theme | null;

  /**
   * Optional custom icons
   */
  icons?: {
    light?: React.ReactNode;
    dark?: React.ReactNode;
  };

  /**
   * Additional CSS class for the button (legacy, use classes.button instead)
   */
  className?: string;

  /**
   * Granular class overrides for specific elements
   */
  classes?: {
    form?: string;
    button?: string;
    container?: string;
    neutralIconWrapper?: string;
    activeContainer?: string;
    slidingCircle?: string;
    iconInner?: string;
  };

  /**
   * Whether to use default Tailwind styles
   * @default true
   */
  useDefaultStyles?: boolean;

  /**
   * Cookie name to use for persistence
   * @default 'theme'
   */
  cookieName?: string;

  /**
   * API endpoint for theme toggle
   * @default '/theme'
   */
  action?: string;

  /**
   * Optional callback when theme changes
   * Called after theme is applied but before server sync
   * Useful for analytics, custom side effects, etc.
   * @param newTheme - The new theme that was applied
   */
  onThemeChange?: (newTheme: Theme) => void;
}

/**
 * Theme toggle that handles both explicit preferences (cookie) and system preferences.
 *
 * When no cookie exists (using system theme):
 * - Without JS: Shows neutral state (both icons visible) to accurately represent
 *   that system preference is active
 * - With JS: Detects actual system theme and shows correct selection
 *
 * When cookie exists (explicit preference):
 * - Shows correct theme immediately (server-rendered)
 */
export function ThemeToggle({
  currentTheme,
  icons,
  className,
  classes,
  useDefaultStyles = true,
  cookieName = 'theme',
  action = '/theme',
  onThemeChange,
}: Props) {
  const location = useLocation();
  // Start with server value, or null to indicate "unknown/system"
  const [theme, setTheme] = useState<Theme | null>(currentTheme);

  // Create theme manager (memoized to prevent recreating on every render)
  const manager = useMemo(() => new ThemeManager(new CookieStorage(cookieName)), [cookieName]);

  // Detect actual theme after mount (client-side only)
  useEffect(() => {
    if (currentTheme) {
      // Cookie exists, use it
      setTheme(currentTheme);
    } else {
      // No cookie - check what ThemeScript applied
      const appliedTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
      if (appliedTheme === 'light' || appliedTheme === 'dark') {
        setTheme(appliedTheme);
      } else {
        // Fallback to system preference
        setTheme(manager.getSystemTheme());
      }
    }
  }, [currentTheme, manager]);

  // Determine effective theme for display
  // When theme is null (no cookie, not yet mounted), we're in "system/neutral" mode
  const isSystemMode = theme === null;
  const effectiveTheme = theme || 'light'; // Fallback for calculations

  // For display label only
  const nextTheme: Theme = effectiveTheme === 'light' ? 'dark' : 'light';
  const label = `Switch to ${nextTheme} theme`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Calculate next theme based on current state
    const currentEffectiveTheme = theme || manager.getSystemTheme();
    const newTheme: Theme = currentEffectiveTheme === 'light' ? 'dark' : 'light';

    // Update UI immediately
    setTheme(newTheme);
    manager.applyTheme(newTheme);

    // Notify callback if provided
    onThemeChange?.(newTheme);

    // Submit to server in background (set cookie)
    const formData = new FormData(event.currentTarget);
    formData.set('theme', newTheme);

    try {
      // Build full URL to avoid resolution issues
      const path = action.startsWith('/') ? action : `/${action}`;
      const url = typeof window !== 'undefined' 
        ? `${window.location.origin}${path}`
        : path;
      
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        redirect: 'manual', // Don't follow redirects - we just need to set the cookie
      });
      
      // Manual redirect returns opaque response (type: 'opaqueredirect')
      // This is expected and fine - the cookie was set
      if (response.type === 'opaqueredirect' || response.status === 0) {
        // Success - cookie was set
        return;
      }
    } catch (error) {
      // Fail silently - theme is already applied client-side
      console.error('Failed to save theme preference:', error);
    }
  };

  const LightIcon = icons?.light || <SunIcon className="block" />;
  const DarkIcon = icons?.dark || <MoonIcon className="block" />;
  const Icon = effectiveTheme === 'light' ? LightIcon : DarkIcon;
  const isLight = effectiveTheme === 'light';

  // Default Tailwind classes
  const defaultClasses = {
    button: 'relative inline-flex items-center rounded-full p-0 cursor-pointer border border-solid border-gray-600 dark:border-gray-400 hover:border-black dark:hover:border-white bg-white dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-900 text-black dark:text-white',
    container: 'relative flex items-center justify-center gap-1 w-11 h-6',
    neutralIconWrapper: 'flex items-center justify-center w-4 h-4',
    activeContainer: 'relative flex items-center w-11 h-6',
    slidingCircle: 'flex items-center justify-center w-5 h-5 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-sm transition-transform duration-300',
    iconInner: '',
  };

  // Helper to merge classes
  const mergeClasses = (defaultClass: string, overrideClass?: string) => {
    if (useDefaultStyles === false) {
      return overrideClass || '';
    }
    return overrideClass ? `${defaultClass} ${overrideClass}` : defaultClass;
  };

  return (
    <Form 
      method="POST" 
      action={action} 
      onSubmit={handleSubmit} 
      suppressHydrationWarning
      className={classes?.form}
    >
      <input type="hidden" name="theme" value={nextTheme} />
      <input type="hidden" name="redirectTo" value={location.pathname + location.search} />
      <button
        type="submit"
        className={mergeClasses(defaultClasses.button, className || classes?.button)}
        aria-label={label}
        title={label}
        suppressHydrationWarning
      >
        {isSystemMode ? (
          /* Neutral state: Show both icons to indicate system preference is active */
          <span className={mergeClasses(defaultClasses.container, classes?.container)}>
            <span className={mergeClasses(defaultClasses.neutralIconWrapper, classes?.neutralIconWrapper)}>
              {LightIcon}
            </span>
            <span className={mergeClasses(defaultClasses.neutralIconWrapper, classes?.neutralIconWrapper)}>
              {DarkIcon}
            </span>
          </span>
        ) : (
          /* Active theme: Show sliding toggle with single icon */
          <span className={mergeClasses(defaultClasses.activeContainer, classes?.activeContainer)}>
            {/* Sliding circle with icon */}
            <span
              style={{
                transform: isLight ? 'translateX(.15rem)' : 'translateX(1.35rem)',
              }}
              className={mergeClasses(defaultClasses.slidingCircle, classes?.slidingCircle)}
            >
              <span className={mergeClasses(defaultClasses.iconInner, classes?.iconInner)}>
                {Icon}
              </span>
            </span>
          </span>
        )}
        <span className="sr-only" suppressHydrationWarning>
          {label}
        </span>
      </button>
    </Form>
  );
}


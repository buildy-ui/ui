// apps/cab/src/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { skyOSTheme, type SkyOSTheme } from '@ui8kit/theme';

interface ThemeContextValue {
  theme: SkyOSTheme;
  rounded: SkyOSTheme['rounded'];
  buttonSize: SkyOSTheme['buttonSize'];
  isDarkMode: boolean;
  prefersReducedMotion: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const baseTheme: SkyOSTheme = skyOSTheme;

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('ui:dark') : null;
    if (stored !== null) return stored === '1';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    try {
      window.localStorage.setItem('ui:dark', isDarkMode ? '1' : '0');
    } catch {}
  }, [isDarkMode]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = 'matches' in e ? e.matches : (e as MediaQueryList).matches;
      setPrefersReducedMotion(matches);
    };
    handler(mql as unknown as MediaQueryList);
    if (mql.addEventListener) {
      mql.addEventListener('change', handler as EventListener);
      return () => mql.removeEventListener('change', handler as EventListener);
    } else if (mql.addListener) {
      // @ts-ignore
      mql.addListener(handler);
      // @ts-ignore
      return () => mql.removeListener(handler);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: baseTheme,
      rounded: baseTheme.rounded,
      buttonSize: { default: baseTheme.buttonSize.default, badge: baseTheme.buttonSize.badge },
      isDarkMode,
      prefersReducedMotion,
      toggleDarkMode: () => setIsDarkMode((v) => !v),
      setDarkMode: setIsDarkMode,
    }),
    [baseTheme, isDarkMode, prefersReducedMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

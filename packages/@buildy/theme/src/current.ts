import { DEFAULT_THEME, THEME_TYPES } from './constants';
import type { ThemeType } from './types';

// Global variable for the theme
let currentTheme: ThemeType = DEFAULT_THEME;

/**
 * Gets current theme 
 */
export function getTheme(): ThemeType {
  return currentTheme;
}

/**
 * Sets current theme
 */
export function setTheme(theme: string): void {
  if (Object.values(THEME_TYPES).includes(theme as ThemeType)) {
    currentTheme = theme as ThemeType;
  } else {
    console.warn(`Invalid theme: ${theme}. Using default: ${DEFAULT_THEME}`);
    currentTheme = DEFAULT_THEME;
  }
} 
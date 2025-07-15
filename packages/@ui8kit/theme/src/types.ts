import React from 'react';

/**
 * Type for component collection
 */
export type ComponentCollection = { [key: string]: React.ComponentType<any> };

/**
 * Theme types
 */
import { THEME_TYPES } from './constants';

export type ThemeType = typeof THEME_TYPES[keyof typeof THEME_TYPES];

/**
 * Theme state interface
 */
export interface ThemeState {
  current: ThemeType;
  isLoading: boolean;
}

/**
 * Theme action types
 */
export type ThemeAction =
  | { type: 'SET_THEME'; payload: ThemeType }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LOADING'; payload: boolean }; 
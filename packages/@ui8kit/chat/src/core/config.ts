export const DEFAULT_MODEL =
  (typeof process !== 'undefined' && process.env?.UI8KIT_DEFAULT_MODEL) ||
  'gpt-5-mini';

export const OPENROUTER_HTTP_REFERER =
  typeof process !== 'undefined' ? process.env?.OPENROUTER_HTTP_REFERER : undefined;

export const OPENROUTER_X_TITLE =
  typeof process !== 'undefined' ? process.env?.OPENROUTER_X_TITLE : undefined;



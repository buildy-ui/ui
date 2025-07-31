import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Отключаем базовые правила для TypeScript файлов
      'no-undef': 'off', // TypeScript сам проверяет undefined переменные
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-use-before-define': 'off',

      // TypeScript правила для автоисправления
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-use-before-define': 'error',

      // React правила
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { 
          allowConstantExport: true,
          allowExportNames: ['defaultLayoutContentHooks', 'createLayoutContentHook', 'createContentHook', 'defaultContentHooks', 'advancedContentHooks']
        },
      ],

      // Общие правила
      'prefer-const': 'error',
      'no-var': 'error',
      'no-self-assign': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-exports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'error',
    },
  },
  {
    files: ['**/factory/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module.replace('.js', '.mjs'),
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
      postcss({
        extract: 'styles.css',
        minimize: true,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      ...Object.keys(packageJson.dependencies || {}),
    ],
  },

  // UI components bundle
  {
    input: 'src/ui/index.ts',
    output: [
      {
        file: 'dist/ui/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/ui/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      ...Object.keys(packageJson.dependencies || {}),
    ],
  },

  // Core AI bundle
  {
    input: 'src/core/index.ts',
    output: [
      {
        file: 'dist/core/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/core/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
  },

  // Hooks bundle
  {
    input: 'src/hooks/index.ts',
    output: [
      {
        file: 'dist/hooks/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/hooks/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
  },

  // Type definitions
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
  {
    input: 'dist/types/ui/index.d.ts',
    output: [{ file: 'dist/ui/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
  {
    input: 'dist/types/core/index.d.ts',
    output: [{ file: 'dist/core/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
  {
    input: 'dist/types/hooks/index.d.ts',
    output: [{ file: 'dist/hooks/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];

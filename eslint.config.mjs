// @ts-check

import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      playwright,
    },
  },
  {
    ignores: ['./playwright-report', './lib'],
  },
);

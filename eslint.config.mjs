import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'graphql/**', 'tests/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.js'],
    rules: {
      'import/prefer-default-export': 'off',
      'no-case-declarations': 'off',
    },
  },
];

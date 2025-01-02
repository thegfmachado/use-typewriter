import js from '@eslint/js';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJest from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ...js.configs.recommended,
    files: ['*.js', '*.ts'],
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
    },
  },
  eslintPluginPrettierRecommended,
  {
    plugins: eslintPluginReact,
    files: ['*.jsx', '*.tsx'],
    rules: {
      'react/jsx-uses-react': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    plugins: { jest: eslintPluginJest },
    languageOptions: {
      globals: eslintPluginJest.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
];

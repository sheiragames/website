// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import love from 'eslint-config-love';
import functional from 'eslint-plugin-functional';

export default defineConfig(
  {
    ignores: ['public/dist/**'],
    ...love,
    files: ['**/*.{js,ts}'],
  },
  {
    files: ['**/*.{js,ts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
    ],
    plugins: { functional },
    rules: {
      '@typescript-eslint/no-shadow': 'error',
      'functional/immutable-data': 'error',
      'functional/prefer-immutable-types': 'error',
      'functional/no-let': 'error',
      'functional/type-declaration-immutability': 'error',
      'functional/no-class-inheritance': 'error',
      'functional/no-mixed-types': 'error',
      'functional/no-loop-statements': 'error',
      'functional/no-throw-statements': 'error',
      'functional/functional-parameters': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
);

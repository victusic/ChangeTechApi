const path = require('path');
const globals = require('globals');
const pluginJs = require('@eslint/js');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        tsconfigRootDir: path.resolve(),
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      'no-undef': 'off',
      'prettier/prettier': 'warn',
    },
    ignores: ['node_modules', 'dist/**/*', 'dbconfig/**/*'],
  },
  pluginJs.configs.recommended,
  prettierConfig,
];

const tseslint = require('typescript-eslint');

module.exports = [
  {
    ignores: ['**/*.js', 'node_modules/**', '.pnpm-store/**', 'cdk.out/**', 'dist/**', 'infra/cdk.out/**', 'infra/node_modules/**', 'backend/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
    },
    rules: {
      semi: ['error', 'always'],
    },
  },
];

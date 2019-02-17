module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    camelcase: 'off',
    '@typescript-eslint/camelcase': 'error',
    'no-unused-vars': 'off',
    'no-console': 'off',
  },
};

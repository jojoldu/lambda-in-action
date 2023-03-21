module.exports = {
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  plugins: ['import', 'eslint-plugin-node'],
  extends: [
    'eslint:recommended',
    'eslint-config-prettier',
    'eslint-config-async',
    'plugin:jest-formatting/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'off',
    'no-undef': 'off',
    'curly': 1,
    'arrow-body-style': ['error', 'as-needed'],
    'eqeqeq': ['error', 'always'],
    'no-else-return': ['error', { allowElseIf: false }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/newline-after-import': ['error', { 'count': 1 }],
    'max-nested-callbacks': ['error', 5],
    'no-return-await': 'off',
  },
};

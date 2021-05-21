module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.client.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    "formatjs",
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-imports': [
      'error',
      {
        'patterns':  ["@material-ui/*/*/*", "!@material-ui/core/test-utils/*"]
      }
    ],
    '@typescript-eslint/no-inferrable-types': 'off',

    // formatjs/
    "formatjs/enforce-placeholders": 'warn',
    "formatjs/enforce-plural-rules": [
      2,
      {
        "one": true,
        "few": true,
        "many": true,
      }
    ],
    'formatjs/no-multiple-whitespaces': 'warn',
    'formatjs/no-multiple-plurals': 'warn',
    'formatjs/no-offset': 'err',
    
  },
};

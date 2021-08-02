module.exports = {
  extends: ['react-app', 'plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['sample-app', 'lib'],
  rules: {
    indent: ['error', 2],
    'no-trailing-spaces' : ['error'],
    'no-multi-spaces' : ['error'],
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', {
      named: 'never',
      anonymous: 'never'
    }],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', {
      code: 125,
      ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
    }],
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error'],
  }
};
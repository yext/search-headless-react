module.exports = {
  extends: [
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-perf/recommended',
    'plugin:@yext/export-star/recommended'
  ],
  plugins: ['react-perf'],
  ignorePatterns: ['sample-app', 'lib', 'tests/setup/responses'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-trailing-spaces': ['error'],
    'no-multi-spaces': ['error'],
    quotes: ['error', 'single'],
    'space-before-function-paren': ['error', {
      named: 'never',
      anonymous: 'never'
    }],
    'object-curly-spacing': ['error', 'always'],
    'quote-props': ['error', 'as-needed'],
    'max-len': ['error', {
      code: 110,
      ignorePattern: '^import\\s.+\\sfrom\\s.+;$'
    }],
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: false
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false
      },
    }]
  }
};

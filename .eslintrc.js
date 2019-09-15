module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'prettier'],
  plugins: ['jest', 'vue', 'prettier'],
  rules: {
    // Allow paren-less arrow functions
    'arrow-parens': 0,
    // Allow async-await
    'generator-star-spacing': 0,
    // Allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // Do not allow console.logs etc...
    'no-console': 2,
    'comma-dangle': 0,
    'semi': 'never',
    "space-before-function-parentheses": 'always'
  },
  globals: {
    'jest/globals': true,
    jasmine: true
  }
}

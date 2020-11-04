module.exports = {
  preset: 'jest-puppeteer',
  globals: {
    'ts-jest': {
      tsConfig: './test/tsconfig.json'
    }
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}

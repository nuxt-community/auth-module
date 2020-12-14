module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json'
    }
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['/test/fixture'],
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}

module.exports = {
  preset: 'ts-jest',
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

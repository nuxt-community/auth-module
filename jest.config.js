const { jsWithBabel: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'jest-puppeteer',
  globals: {
    'ts-jest': {
      tsConfig: './test/tsconfig.json'
    }
  },
  testMatch: ['**/test/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    ...tsjPreset.transform
  }
}

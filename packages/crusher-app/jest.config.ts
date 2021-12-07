export default {
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  clearMocks: true,
  "moduleNameMapper": {
    "^@crusher-shared(.*)$": "<rootDir>/../crusher-shared$1",
  }
};
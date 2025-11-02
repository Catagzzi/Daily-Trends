module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@appTypes/(.*)$': '<rootDir>/types/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
  collectCoverageFrom: [
    'services/**/*.ts',
    'controllers/**/*.ts',
    '!**/*.test.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};


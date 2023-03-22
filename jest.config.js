module.exports = {
  coverageReporters: ['lcov'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.js$',
  transform: {
    '^.+\\.(t|j)s$': [
      '@swc-node/jest',
      {
        swc: {
          sourceMaps: 'inline',
        },
      },
    ],
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  testTimeout: 30000,
};

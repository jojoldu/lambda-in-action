module.exports = {
  setupFiles: ['./jest.setup.ts'],
  coverageReporters: ['lcov'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
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
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
  snapshotFormat: {
    escapeString: false,
    printBasicPrototype: false,
  },
  testTimeout: 30000,
};

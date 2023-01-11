module.exports = {
  testEnvironment:
    '<rootDir>/../../packages/testutils/src/config/environment/mongodb',
  testPathIgnorePatterns: ['/node_modules/', './dist', './scripts'],
  transformIgnorePatterns: ['node_modules/(?!d3-random)'],
  coverageReporters: ['lcov', 'html'],
  setupFilesAfterEnv: [
    '<rootDir>/../../packages/testutils/src/config/setupTestFramework.js',
  ],
  setupFiles: ['<rootDir>/../../packages/testutils/src/config/setupFiles.js'],
  globalSetup: '<rootDir>/../../packages/testutils/src/config/setup.js',
  globalTeardown: '<rootDir>/../../packages/testutils/src/config/teardown.js',
  resetModules: false,
  reporters: ['default'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': 'esbuild-jest',
    // '^.+\\.(js|ts|tsx)?$': 'babel-jest',
    // '^.+\\.(js|ts|tsx)?$': '<rootDir>/../../packages/testutils/babelJestUpward',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx', 'json'],
  cacheDirectory: '.jest-cache',
  moduleNameMapper: {
    '^@event-list/server': '<rootDir>/../../apps/server/src/index.ts',
  },
};

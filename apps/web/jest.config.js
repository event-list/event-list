// eslint-disable-next-line @typescript-eslint/no-var-requires
const jestBaseConfig = require('../../packages/testutils/jest.web.config.base');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

module.exports = {
  ...jestBaseConfig,
  displayName: pkg.name,
  moduleNameMapper: {
    // When changing these, also look at the tsconfig!
    '^types/(.+)$': '<rootDir>/types/$1',
  },
  verbose: true,
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': [
      'babel-jest',
      { configFile: './apps/web/test/.babelrc' },
    ],
  },
};

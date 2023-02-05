// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const jestBaseConfig = require('../../packages/testutils/jest.config.base');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

module.exports = {
  ...jestBaseConfig,
  name: pkg.name,
  displayName: pkg.name,
};

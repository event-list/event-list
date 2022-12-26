const transformer = require('babel-jest');
const { join, resolve } = require('path');

const packagePath = resolve('../');
const packageGlob = join(packagePath, '*');

module.exports = transformer.default.createTransformer({
  babelrcRoots: packageGlob,
});

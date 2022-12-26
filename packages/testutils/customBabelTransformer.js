const babelJest = require('babel-jest');

const { configWeb } = require('@woovi/babel');

module.exports = babelJest.createTransformer(configWeb);

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const babelJest = require('babel-jest');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const { configWeb } = require('@woovi/babel');

module.exports = babelJest.createTransformer(configWeb);

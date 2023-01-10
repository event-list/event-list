// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const babelJest = require('babel-jest');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const { configJest } = require('@event-list/babel');

module.exports = babelJest.createTransformer(configJest);

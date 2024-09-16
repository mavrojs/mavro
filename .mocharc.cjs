module.exports = {
  require: ['ts-node/register'],
  spec: 'dist/core/test/**/*.test.js',
  extensions: ['js'],
  loader: 'ts-node/esm'
};
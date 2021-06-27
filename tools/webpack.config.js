const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'index.js',
    library: 'CssSelectorGenerator',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ],
  },
};

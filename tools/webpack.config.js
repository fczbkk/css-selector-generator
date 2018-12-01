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
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: 'raw-loader'
        }
      }
    ],
  },
};

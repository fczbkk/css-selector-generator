const webpack_config = require('./webpack.config')
const path = require('path')

module.exports = Object.assign({}, webpack_config, {
  mode: 'production',
  devtool: 'hidden-source-map',
  entry: path.resolve(__dirname, '../temp/index.js'),
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'index.js',
    library: 'CssSelectorGenerator',
    libraryTarget: 'umd',
  },
})

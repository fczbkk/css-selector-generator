const webpack_config = require('./webpack.config')

module.exports = Object.assign({}, webpack_config, {
  mode: 'development',
  devtool: 'inline-source-map',
})

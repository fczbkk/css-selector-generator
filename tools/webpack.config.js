const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.ts'),
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
            },
          },
          {
            loader: 'ts-loader'
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: {
          loader: 'raw-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
}

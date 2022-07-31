const webpackConfig = require('./webpack.dev.js')

module.exports = (config) => {
  config.set({
    files: [
      '../test/suppressConsoleWarnings.js',
      {pattern: '../test/**/*.spec.js', watched: false},
      {pattern: '../test/**/*.spec.ts', watched: false},
    ],
    preprocessors: {
      '../test/**/*.spec.js': ['webpack'],
      '../test/**/*.spec.ts': ['webpack'],
    },
    browsers: [
      'ChromeHeadless',
    ],
    frameworks: [
      'mocha', 'chai', 'webpack',
    ],
    plugins: [
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-chai'),
      require('karma-webpack'),
      require('karma-chrome-launcher')
    ],
    webpack: webpackConfig,
    reporters: [
      'mocha',
    ],
    mochaReporter: {
      output: 'minimal',
    },
    client: {
      captureConsole: true,
    },
    singleRun: true,
    autoWatch: false
  })
}

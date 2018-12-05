const webpack_config = require('./webpack.dev');

module.exports = (config) => {
  config.set({
    files: [
      '../test/**/*.spec.js',
    ],
    preprocessors: {
      '../test/**/*.spec.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      module: webpack_config.module
    },
    webpackMiddleware: {
      stats: 'errors-only',
    },
    browsers: [
      'ChromeHeadless',
    ],
    frameworks: [
      'mocha', 'chai',
    ],
    reporters: [
      'mocha',
    ],
    singleRun: true,
    autoWatch: false
  });
};

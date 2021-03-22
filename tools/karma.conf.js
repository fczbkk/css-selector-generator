const webpack_config = require('./webpack.dev');

module.exports = (config) => {
  config.set({
    files: [
      '../test/**/*.spec.js',
    ],
    preprocessors: {
      '../test/**/*.spec.js': ['webpack'],
    },
    webpack: webpack_config,
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

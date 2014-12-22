module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: [
      'mocha',
      'chai',
      'sinon',
      'fixture'
    ],
    files: [
      'bower_components/zepto/zepto.min.js',
      'bower_components/lodash/dist/lodash.min.js',
      'app/js/steppe.js',
      'test/helpers.js',
      'test/fixtures/**/*.html',
      'test/*_test.js'
    ],
    /**
     * 1. HTML files must be converted to js strings
     **/
    preprocessors: {
      'test/fixtures/**/*.html': 'html2js' /* 1 */
    },

    // list of files to exclude
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: false
  });
};

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'bower_components/zepto/zepto.min.js',
      'bower_components/lodash/dist/lodash.min.js', {
        pattern: 'test/fixtures/index.html',
        watched: true,
        included: true,
        served: true
      },
      'app/js/steppe.js',
      'test/*_test.js'
    ],
    preprocessors: {},

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

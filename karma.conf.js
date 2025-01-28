// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/mug-maker'),
      subdir: '.',
      reporters: [
        {type: 'html'},
        {type: 'text-summary'}
      ]
    },
    customLaunchers: {
      ChromeHeaded: {
        base: 'Chrome',
        flags: [
          '--no-sandbox', // Keep this only if absolutely necessary and understand the security implications
          '--remote-debugging-port=9222' // Or any other port you choose
        ]
      },
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        singleRun: true,
        flags: [
          '--no-sandbox', // Keep this only if absolutely necessary and understand the security implications
          '--disable-gpu',   // *Essential* for running Chrome Headless without a GPU
          '--disable-dev-shm-usage' // *Often helpful* for stability in CI environments (shared memory issues)
        ]
      }
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeaded'], // Or ['ChromeHeadlessCI'] as needed
    restartOnFileChange: true
  });
};

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
        // Add Jasmine configuration options here if needed
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/tienda-online'),
      subdir: '.',
      includeAllSources: true, // Include all files even if they have no tests
      reporters: [
        { type: 'html' },       // Generate HTML reports for coverage
        { type: 'text-summary' } // Generate a text summary in the console
      ],
      check: {
        global: {
          statements: 80, // Target minimum 80% for statements
          branches: 80,   // Target minimum 80% for branches
          functions: 80,  // Target minimum 80% for functions
          lines: 80       // Target minimum 80% for lines
        }
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'], // Add 'coverage' for better integration
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};

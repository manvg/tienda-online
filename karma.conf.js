// Karma configuration file
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
        { type: 'html' },       // Generate HTML reports for detailed analysis
        { type: 'lcovonly' },   // Generate lcov file for SonarQube
        { type: 'text-summary' } // Display a summary in the console
      ],
      check: {
        global: {
          statements: 80, // Minimum threshold for statements
          branches: 80,   // Minimum threshold for branches
          functions: 80,  // Minimum threshold for functions
          lines: 80       // Minimum threshold for lines
        }
      }
    },
    reporters: ['progress', 'kjhtml', 'coverage'], // Added 'coverage' for better integration
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};

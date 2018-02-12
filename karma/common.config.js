module.exports = {
    frameworks: ["jasmine"],
    exclude: [
        "*.spec.ts"
    ],
    plugins: [
        "karma-jasmine",
        "karma-chrome-launcher",
        "karma-webpack",
        "karma-sourcemap-loader",
        "karma-spec-reporter"
    ],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["Chrome"],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["spec"],

    specReporter: {
        suppressSkipped: true      // do not print information about skipped tests
    },

    webpackServer: {
        noInfo: true // prevent console spamming when running in Karma!
    },
    port: 9876,
    colors: true,

    // If any browser does not get captured within the timeout,
    // Karma will kill it and try to launch it again. After three attempts to capture it,
    // Karma will give up.
    captureTimeout: 120000,

    client: {
        captureConsole: true
    }
};

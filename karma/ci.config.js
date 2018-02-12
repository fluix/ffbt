module.exports = {
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    autoWatch: false,
    plugins: [
        "karma-jasmine",
        "karma-phantomjs-launcher",
        "karma-webpack",
        "karma-sourcemap-loader",
        "karma-teamcity-reporter"
    ],
    browsers: ["PhantomJS"],
    reporters: ["teamcity"]
}

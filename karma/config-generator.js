const path = require("path"),
    Environment = require("../environment"),
    karmaConstants = require('karma').constants;

class ConfigGenerator {
    makeConfig(ciMode, workingDirectory, webpackConfig) {
        const commonConfig = require("./common.config");
        const pathToEntry = path.resolve(workingDirectory, "spec.loader.js");

        const newConfig = Object.assign({}, commonConfig),
            ciConfig = require("./ci.config");

        // list of files / patterns to load in the browser
        newConfig.files = [pathToEntry];

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        newConfig.preprocessors = {
            [pathToEntry]: ["webpack", "sourcemap"]
        };

        newConfig.webpack = {
            devtool: webpackConfig.devtool,
            resolve: webpackConfig.resolve,
            module: webpackConfig.module,
            plugins: webpackConfig.plugins,
            resolveLoader: webpackConfig.resolveLoader
        };

        // level of logging
        // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
        newConfig.logLevel = karmaConstants.LOG_INFO;

        return ciMode
            ? Object.assign({}, newConfig, ciConfig)
            : newConfig;
    }

    makeEnvironmentConfig(buildConfig) {
        const ciMode = Environment.ciModeEnabled(),
            workDir = Environment.getTestWorkingDir(),
            pathToEntry = path.resolve(buildConfig.context, workDir);
        
        const testConfig = this.makeConfig(ciMode, pathToEntry, buildConfig);

        return testConfig;
    }
}

module.exports = ConfigGenerator;

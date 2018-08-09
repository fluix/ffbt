const chalk = require("chalk");

function printBriefWebpackStats(error, stats) {
    console.log(stats.toString({ // eslint-disable-line no-console
        modules: false,
        colors: true,
    }));
}

function printVerboseWebpackStats(error, stats) {
    // eslint-disable-next-line no-console
    console.log(stats.toString({
        colors: true,
    }));
}

function printColorError(useColor, error) {
    if (useColor) {
        console.log(chalk.red(error)); // eslint-disable-line no-console
    }

    console.error(error);// eslint-disable-line no-console
}

function printAllWebpackStats(error, stats) {
    console.log(stats.toString("verbose")); // eslint-disable-line no-console
}

function webpackStatsHasErrors(error, stats) {
    const hasCompilationErrors = stats.compilation
        && stats.compilation.errors
        && stats.compilation.errors.length;
    return error || hasCompilationErrors;
}

module.exports = {
    printVerboseWebpackStats,
    printBriefWebpackStats,
    printColorError,
    printAllWebpackStats,
    webpackStatsHasErrors,
};

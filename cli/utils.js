function printBriefWebpackStats(error, stats) {
    console.log(stats.toString({
        modules: false,
        colors: true
    }));
}

function printVerboseWebpackStats(error, stats) {
    console.log(stats.toString({
        colors: true
    }));
}

function printColorError(useColor, error) {
    if (useColor) {
        console.log(chalk.red(error));
    }

    console.error(error);
}

function printAllWebpackStats(error, stats) {
    console.log(stats.toString("verbose"));
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
    webpackStatsHasErrors
};

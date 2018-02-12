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

    return console.error(error);
}

module.exports = {
    printVerboseWebpackStats: printVerboseWebpackStats,
    printBriefWebpackStats: printBriefWebpackStats,
    printColorError: printColorError
};

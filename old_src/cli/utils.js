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

module.exports = {
    printVerboseWebpackStats,
    printBriefWebpackStats,
    printColorError,
};

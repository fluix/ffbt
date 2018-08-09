const path = require("path");
const stylelint = require("stylelint");

let noErrorExitCode;

function printResult(data) {
    // do things with data.output, data.errored,
    // and data.results
    const formattedResult = stylelint.formatters.string(data.results);
    console.log(formattedResult); // eslint-disable-line no-console
    if (data.errored && !noErrorExitCode) {
        process.exitCode = 1;
    }
}

function handleUnexpectedError(error) {
    // do things with err e.g.
    console.error(error.stack); // eslint-disable-line no-console
    if (!noErrorExitCode) {
        process.exitCode = 1;
    }
}

module.exports = (ffbtRoot, workDir, argv, projectConfig, PROJECT_ROOT_PATH) => {
    noErrorExitCode = argv && argv.force;

    let configPath = path.resolve(ffbtRoot, "./linters/stylelint.config.js");

    if (projectConfig.styleLintConfigPath) {
        configPath = path.resolve(PROJECT_ROOT_PATH, projectConfig.styleLintConfigPath);
    }

    // eslint-disable-next-line global-require
    const config = require(configPath);

    const lintStyles = stylelint.lint({
        config,
        files: path.join(workDir, "./**/**/**.scss"),
    });

    lintStyles
        .then(printResult)
        .catch(handleUnexpectedError);
};

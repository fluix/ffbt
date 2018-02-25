const path = require("path"),
    stylelint = require("stylelint");

let noErrorExitCode;
module.exports = function (ffbt_root, workdir, argv) {
    noErrorExitCode = argv && argv.force;
    const configPath = path.resolve(ffbt_root, "./linters/stylelint.config.js");
    const config = require(configPath);

    const lintStyles = stylelint.lint({
        config: config,
        files: path.join(workdir, "./**/**/**.scss")
    });

    lintStyles
        .then(printResult)
        .catch(handleUnexpectedError);
};

function printResult(data) {
    // do things with data.output, data.errored,
    // and data.results
    const formattedResult = stylelint.formatters.string(data.results);
    console.log(formattedResult);
    if (data.errored && !noErrorExitCode) {
        process.exitCode = 1;
    }
}

function handleUnexpectedError(error) {
    // do things with err e.g.
    console.error(error.stack);
    if (!noErrorExitCode) {
        process.exitCode = 1;
    }
}

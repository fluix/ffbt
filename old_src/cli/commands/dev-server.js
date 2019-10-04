const chalk = require("chalk");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const open = require("opn");
const addDevServerEntryPoints = require("webpack-dev-server/lib/util/addDevServerEntrypoints");
const OptionsValidationError = require("webpack-dev-server/lib/OptionsValidationError");
const Utils = require("../utils");

module.exports = (webpackConfig) => {
    addDevServerEntryPoints(webpackConfig, webpackConfig.devServer);

    let compiler;
    try {
        compiler = webpack(webpackConfig);
    } catch (e) {
        if (e instanceof webpack.WebpackOptionsValidationError) {
            console.error(Utils.printColorError(false, e.message)); // eslint-disable-line no-console
            process.exit(1);
        }
        throw e;
    }

    let server;
    try {
        server = new WebpackDevServer(compiler, webpackConfig.devServer);
    } catch (e) {
        if (e instanceof OptionsValidationError) {
            console.error(Utils.printColorError(false, e.message)); // eslint-disable-line no-console
            process.exit(1);
        }
        throw e;
    }

    const { host, port } = webpackConfig.devServer;
    const url = `http://${host}:${port}`;

    console.log(); // eslint-disable-line no-console
    console.log(chalk.yellow(`Starting server on ${url}`)); // eslint-disable-line no-console
    console.log(); // eslint-disable-line no-console

    server.listen(port, host);

    open(url);

    ["SIGINT", "SIGTERM"].forEach((sig) => {
        process.on(sig, () => {
            server.close();
            process.exit();
        });
    });
};

const chalk = require("chalk"),
    webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    open = require("opn"),
    addDevServerEntryPoints = require("webpack-dev-server/lib/util/addDevServerEntrypoints"),
    OptionsValidationError = require('webpack-dev-server/lib/OptionsValidationError'),
    Utils = require("../utils");

module.exports = function(webpackConfig) {
    addDevServerEntryPoints(webpackConfig, webpackConfig.devServer);

    let compiler;
    try {
        compiler = webpack(webpackConfig);
    } catch (e) {
        if (e instanceof webpack.WebpackOptionsValidationError) {
            console.error(Utils.printColorError(options.stats.colors, e.message));
            process.exit(1);
        }
        throw e;
    }

    let server;
    try {
        server = new WebpackDevServer(compiler, webpackConfig.devServer);
    } catch (e) {
        if (e instanceof OptionsValidationError) {
            console.error(Utils.printColorError(options.stats.colors, e.message));
            process.exit(1);
        }
        throw e;
    }

    const {host, port} = webpackConfig.devServer;
    const url = `http://${host}:${port}`;

    console.log();
    console.log(chalk.yellow(`Starting server on ${url}`));
    console.log();

    server.listen(port, host);

    open(url);

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
        process.on(sig, () => {
            server.close();
            process.exit();
        });
    });
};

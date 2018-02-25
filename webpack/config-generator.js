const path = require("path"),
    chalk = require("chalk"),
    constants = require("../constants"),
    env = require("../environment"),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

class WebpackConfigGenerator {
    constructor(projectSettings) {
        this.projectSettings = projectSettings;
    }

    /**
     * Generates the Webpack config object that depends on the current profile
     * Merges Base config and Profile config
     *
     * @param string profileName. You can get allowed profiles from the PROFILES constant
     */
    makeBuildConfig(profileName, workingDirectory, modules_dir) {
        this.printHeading(profileName, workingDirectory);

        const normalizedProfileName = profileName.toLowerCase();

        const baseWebpackConfig = require("./base-webpack-config")({
            projectRoot: this.projectSettings.projectRoot,
            autoprefixerConfig: {
                browsers: this.projectSettings.supportedBrowsers
            }
        });

        const profileConfig = require(`./profiles/${normalizedProfileName}`)(this.projectSettings);

        // Build config in webpack format
        const webpackConfig = Object.assign(baseWebpackConfig, {
            context: workingDirectory,
            entry: {
                app: path.resolve(workingDirectory, constants.tsEntrypointName),
                vendor: this.projectSettings.vendorContents
            },
            output: {
                path: this.projectSettings.buildPath,
                filename: profileConfig.webpackOutputSettings.filename,
                chunkFilename: profileConfig.webpackOutputSettings.chunkFilename
            },
            plugins: profileConfig.webpackPlugins
        });

        webpackConfig.module.noParse = this.projectSettings.noParse;
        webpackConfig.resolve.alias = this.projectSettings.aliases;

        webpackConfig.resolveLoader = {
            modules: ["node_modules", modules_dir]
        };

        // Add sourcemaps
        if (profileConfig.webpackDevtool) {
            webpackConfig.devtool = profileConfig.webpackDevtool;
        }

        webpackConfig.devServer = {
            port: 9091,
            inline: true,
            contentBase: this.projectSettings.buildPath,
            host: "0.0.0.0",
            historyApiFallback: true,
            publicPath: "/",
            stats: {
                colors: true
            }
        };

        if (env.analyzeModeEnabled()) {
            webpackConfig.plugins.push(
                new BundleAnalyzerPlugin()
            );
        }

        return webpackConfig;
    }

    printHeading(profileName, wokingDirectory) {
        const entrypointAbsolutePath = path.resolve(wokingDirectory, constants.tsEntrypointName);
        const isTestWorkdirProvided = Boolean(process.env.TEST_DIR);
        const bigProfileName = env.analyzeModeEnabled()
            ? `${profileName.toUpperCase()} (analyze bundle structure)`
            : profileName.toUpperCase();

        console.log(chalk.yellow.bold("Build profile:"), chalk.green.bold(bigProfileName));

        if (!isTestWorkdirProvided) {
            console.log(chalk.yellow("Working dir:"), chalk.green(wokingDirectory));
            console.log(chalk.yellow("Output dir:"), chalk.green(this.projectSettings.buildPath));
            console.log();
        }
    }
}

module.exports = WebpackConfigGenerator;

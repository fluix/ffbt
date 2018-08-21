const chalk = require("chalk");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const utils = require("../utils");
const env = require("../environment");
const configValidator = require("../config/validator");

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
    makeBuildConfig(profileName, workingDirectory, projectNodeModulesDir) {
        this.printHeading(profileName, workingDirectory);

        const normalizedProfileName = profileName.toLowerCase();

        // eslint-disable-next-line global-require
        const baseWebpackConfig = require("./base-webpack-config")({
            projectRoot: this.projectSettings.projectRoot,
            autoprefixerConfig: {
                browsers: this.projectSettings.supportedBrowsers,
            },
        });

        // eslint-disable-next-line global-require
        const profileConfig = require(`./profiles/${normalizedProfileName}`)(this.projectSettings);

        // Build config in webpack format
        const webpackConfig = Object.assign(baseWebpackConfig, {
            context: workingDirectory,
            entry: {
                app: utils.locateEntrypoint(workingDirectory),
            },
            output: {
                path: this.projectSettings.buildPath,
                filename: profileConfig.webpackOutputSettings.filename,
                chunkFilename: profileConfig.webpackOutputSettings.chunkFilename,
            },
            plugins: profileConfig.webpackPlugins,
        });

        if (configValidator.vendor(this.projectSettings.vendorContents)) {
            webpackConfig.entry.vendor = this.projectSettings.vendorContents;
        }

        webpackConfig.module.noParse = this.projectSettings.noParse;
        webpackConfig.resolve.alias = this.projectSettings.aliases;

        webpackConfig.resolveLoader = {
            modules: [
                utils.getLocalNodeModulesPath(),
                "node_modules",
            ],
        };

        if (projectNodeModulesDir) {
            webpackConfig.resolveLoader.modules.push(projectNodeModulesDir);
        }

        // Add sourcemaps
        if (profileConfig.webpackDevtool) {
            webpackConfig.devtool = profileConfig.webpackDevtool;
        }

        const defaultDevServerConfig = {
            port: 9091,
            inline: true,
            contentBase: this.projectSettings.buildPath,
            host: "127.0.0.1",
            historyApiFallback: true,
            publicPath: "/",
            stats: {
                colors: true,
            },
        };

        webpackConfig.devServer = {
            ...defaultDevServerConfig,
            ...this.projectSettings.devServer,
        };

        if (env.analyzeModeEnabled()) {
            webpackConfig.plugins.push(
                new BundleAnalyzerPlugin(),
            );
        }

        return webpackConfig;
    }

    printHeading(profileName, wokingDirectory) {
        const isTestWorkdirProvided = Boolean(process.env.TEST_DIR);
        const bigProfileName = env.analyzeModeEnabled()
            ? `${profileName.toUpperCase()} (analyze bundle structure)`
            : profileName.toUpperCase();

        // eslint-disable-next-line no-console
        console.log(chalk.yellow.bold("Build profile:"), chalk.green.bold(bigProfileName));
        if (!isTestWorkdirProvided) {
            // eslint-disable-next-line no-console
            console.log(chalk.yellow("Working dir:"), chalk.green(wokingDirectory));
            // eslint-disable-next-line no-console
            console.log(chalk.yellow("Output dir:"), chalk.green(this.projectSettings.buildPath));
            // eslint-disable-next-line no-console
            console.log();
        }
    }
}

module.exports = WebpackConfigGenerator;

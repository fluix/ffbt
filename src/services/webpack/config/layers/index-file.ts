import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {resolve} from "path";
import {existsSync} from "fs";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    const pathToTemplate = resolve(projectConfig.paths.projectWorkingDirectory, "index.ejs");

    const settingsForCustomTemplate: HtmlWebpackPlugin.Options = {
        template: pathToTemplate,
        templateParameters: (compilation, assets, options) => {
            return {
                envName: projectConfig.env._name,
                env: projectConfig.env,
                files: assets,
                htmlWebpackPluginOptions: options,
            };
        },
    };

    const settingsForDefaultTemplate: HtmlWebpackPlugin.Options = {
        title: "New Project",
    };

    const pluginSettings = existsSync(pathToTemplate)
        ? settingsForCustomTemplate
        : settingsForDefaultTemplate;

    return {
        plugins: [
            new HtmlWebpackPlugin({
                ...projectConfig.env.htmlWebpackPluginConfig,
                ...pluginSettings,
                minify: projectConfig.env.optimizeBundle && {
                    collapseWhitespace: true,
                    removeComments: true,
                },
            })
        ]
    };
};

module.exports = layer;

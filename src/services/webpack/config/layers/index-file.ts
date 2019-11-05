import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackLayerConfigurator} from "../index";
import {resolve} from "path";
import {existsSync} from "fs";

export const indexFileConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const pathToTemplate = resolve(paths.projectWorkingDirectory, "index.ejs");

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

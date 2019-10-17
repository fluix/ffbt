import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackLayerConfigurator} from "../index";
import {resolve} from "path";
import {existsSync} from "fs";

export const indexFileConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const pathToTemplate = resolve(paths.project.workingDirectory, "index.ejs");
    const settingsForCustomTemplate: HtmlWebpackPlugin.Options = {
        template: pathToTemplate,
        templateParameters: projectConfig.profile,
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
                ...pluginSettings,
                minify: projectConfig.profile.optimizeBundle && {
                    collapseWhitespace: true,
                    removeComments: true,
                },
            })
        ]
    };
};

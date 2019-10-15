import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackLayerConfigurator} from "../types";
import {resolve} from "path";

export const indexFileConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                title: "New Project",
                template: resolve(paths.project.workingDirectory, "index.ejs")
            })
        ]
    };
};

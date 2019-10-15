import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";
import {WebpackLayerConfigurator} from "../types";

export const typescriptConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        devtool: projectConfig.profile.sourceMapType as any, // Webpack doesn't have "(none)" value in typings
        entry: {
            main: paths.project.entrypoint,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                // Put loaders here
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "FFBT",
                excludeWarnings: true
            }),
        ],
    };
};

import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";
import {WebpackLayerConfigurator} from "../index";
import {CompilerOptions} from "typescript";
import {readJson} from "../../../../core/read-json";

interface TsConfig {
    compilerOptions: CompilerOptions;
}

export const typescriptConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const tsConfigPath = paths.project.tsConfig;
    const tsConfig = readJson<TsConfig>(tsConfigPath);

    return {
        devtool: projectConfig.profile.sourceMapType as any, // Webpack doesn't have "(none)" value in typings
        entry: {
            main: paths.project.entrypoint,
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        configFile: tsConfigPath,
                        compilerOptions: {
                            jsx: tsConfig.compilerOptions.jsx || "react",
                        },
                        experimentalWatchApi: true,
                        // disable type checker - we will use it in fork plugin
                        transpileOnly: true,
                    },
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsConfigPath,
            }),
            new ForkTsCheckerNotifierWebpackPlugin({
                title: "FFBT Type Checker",
                skipFirstNotification: true,
                skipSuccessful: true,
            }),
        ],
    };
};

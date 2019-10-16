import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import * as ForkTsCheckerNotifierWebpackPlugin from "fork-ts-checker-notifier-webpack-plugin";
import {WebpackLayerConfigurator} from "../types";
import {readJson} from "../../core/read-json";
import {CompilerOptions} from "typescript";

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
                title: "FFBT",
                excludeWarnings: true
            }),
        ],
    };
};

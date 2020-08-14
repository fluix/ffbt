import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {CompilerOptions} from "typescript";
import {readJson} from "../../../../core/read-json";
import {WebpackLayerConfigurator} from "./index";

interface TsConfig {
    compilerOptions: CompilerOptions;
}

const layer: WebpackLayerConfigurator = (projectConfig) => {
    const {paths} = projectConfig;
    const tsConfigPath = paths.projectTsConfig;
    const tsConfig = readJson<TsConfig>(tsConfigPath);
    const plugins: Array<any> = [];

    if (projectConfig.env.enableTypeChecking) {
        plugins.push(
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configFile: tsConfigPath,
                    profile: projectConfig.env.verboseMode,
                }
            })
        );
    }

    return {
        devtool: projectConfig.env.sourceMapType as any, // Webpack doesn't have "(none)" value in typings
        entry: {
            main: paths.projectEntrypoint,
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
                        logLevel: projectConfig.env.verboseMode ? "info" : "warn",
                        logInfoToStdOut: projectConfig.env.verboseMode,
                    },
                },
            ],
        },
        plugins,
    };
};

module.exports = layer;

import {resolve} from "path";
import {WebpackLayerConfigurator} from "../types";

export const baseConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    return {
        mode: "none",
        context: paths.project.workingDirectory,
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            // TODO: move paths to project config, calculate output path via getter
            path: resolve(paths.project.root, projectConfig.profile.outputPath),
        },
        optimization: {
            splitChunks: {
                chunks: "all",
            }
        }
    };
};

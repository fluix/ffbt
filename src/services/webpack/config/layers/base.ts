import {resolve} from "path";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    const {paths} = projectConfig;

    const whereToSearchLoaders = [
        "node_modules",
        resolve(paths.ffbtRoot, "node_modules"),
    ];

    if (paths.projectNodeModules) {
        whereToSearchLoaders.push(paths.projectNodeModules);
    }

    return {
        mode: projectConfig.env.optimizeBundle ? "production" : "development",
        context: paths.projectWorkingDirectory,
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[name].chunk.js',
            path: paths.destination,
        },
        resolveLoader: {
            modules: whereToSearchLoaders,
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                automaticNameDelimiter: "-",
            },
        },
    };
};

module.exports = layer;

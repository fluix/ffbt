import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import {resolve} from "path";
import {WebpackLayerConfigurator} from "./index";

const layer: WebpackLayerConfigurator = (projectConfig) => {
    const pathToReports = resolve(projectConfig.paths.projectRoot, "bundle-report");

    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                generateStatsFile: true,
                reportFilename: resolve(pathToReports, "bundle-analyze.html"),
                statsFilename: resolve(pathToReports, "stats.json"),
            }),
        ]
    };
};

module.exports = layer;

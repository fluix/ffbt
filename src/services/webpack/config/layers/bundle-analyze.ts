import {BundleStatsWebpackPlugin} from "bundle-stats";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import {relative, resolve} from "path";
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

            // https://github.com/bundle-stats/bundle-stats
            new BundleStatsWebpackPlugin({
                outDir: relative(projectConfig.paths.destination, pathToReports),
            })
        ]
    };
};

module.exports = layer;

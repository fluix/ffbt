import {BundleStatsWebpackPlugin} from "bundle-stats";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import {WebpackLayerConfigurator} from "../types";
import {resolve} from "path";

console.log(BundleStatsWebpackPlugin, BundleAnalyzerPlugin);

export const bundleAnalyzeConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const pathToReports = resolve(paths.project.root, "bundle-report");

    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: resolve(pathToReports, "bundle-analyze.html"),
            }),

            // https://github.com/bundle-stats/bundle-stats
            new BundleStatsWebpackPlugin({
                outDir: pathToReports,
            })
        ]
    };
};

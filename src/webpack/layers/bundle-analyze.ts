import * as BundleStatsWebpackPlugin from "bundle-stats";
import * as BundleAnalyzerPlugin from "webpack-bundle-analyzer";
import {WebpackLayerConfigurator} from "../types";

export const bundleAnalyzeConfigLayer: WebpackLayerConfigurator = () => {
    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                reportFilename: "../bundle-report/bundle-analyze.html"
            }),

            // https://github.com/bundle-stats/bundle-stats
            new BundleStatsWebpackPlugin({
                outDir: "../bundle-report"
            })
        ]
    };
};

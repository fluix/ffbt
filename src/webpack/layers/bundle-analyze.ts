import * as webpack from "webpack";
import * as BundleStatsWebpackPlugin from "bundle-stats";
import * as BundleAnalyzerPlugin from "webpack-bundle-analyzer";

export const bundleAnalyzeConfigLayer: webpack.Configuration = {
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

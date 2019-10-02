const { BundleStatsWebpackPlugin } = require("bundle-stats");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
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

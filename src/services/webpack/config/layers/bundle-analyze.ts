import {BundleStatsWebpackPlugin} from "bundle-stats";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";
import {WebpackLayerConfigurator} from "../index";
import {resolve} from "path";

export const bundleAnalyzeConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const pathToReports = resolve(paths.project.root, "bundle-report");

    const isBundleCompareMode = Boolean(process.env.FFBT_COMPARE);
    const isBaselineBuild = Boolean(process.env.FFBT_COMPARE_BASELINE);

    return {
        plugins: [
            new BundleAnalyzerPlugin({
                analyzerMode: "static",
                generateStatsFile: true,
                reportFilename: resolve(pathToReports, "bundle-analyze.html"),
                statsFilename: resolve(pathToReports, "stats.json"),
                openAnalyzer: !isBundleCompareMode,
            }),

            // https://github.com/bundle-stats/bundle-stats
            new BundleStatsWebpackPlugin({
                outDir: "../bundle-report",
                compare: isBundleCompareMode,
                baseline: isBaselineBuild,
            })
        ]
    };
};

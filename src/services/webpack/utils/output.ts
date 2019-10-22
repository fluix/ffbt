import * as webpack from "webpack";

export const printVerboseWebpackStats: webpack.ICompiler.Handler = (error, stats) => {
    console.log(stats.toString({
        colors: true,
    }));
};

import * as webpack from "webpack";

export const includeHtmlConfigLayer: webpack.Configuration = {
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    minimize: true,
                }
            },
        ],
    },
};

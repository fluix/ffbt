import * as webpack from "webpack";

export const globalsConfigLayer: webpack.Configuration = {
    plugins: [
        new webpack.DefinePlugin({
            "FFBT_BUILD_VERSION": JSON.stringify(`app.${Date.now()}`),
        })
    ]
};

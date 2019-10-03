const webpack = require("webpack");

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            "FFBT_BUILD_VERSION": JSON.stringify(`app.${Date.now()}`),
        })
    ]
};

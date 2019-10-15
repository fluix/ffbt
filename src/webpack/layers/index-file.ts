import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";

export const indexFileConfigLayer: webpack.Configuration = {
    plugins: [
        new HtmlWebpackPlugin({
            title: "Hello, new FFBT!",
            template: "src/index.ejs"
        })
    ]
};

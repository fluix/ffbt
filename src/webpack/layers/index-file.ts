import * as HtmlWebpackPlugin from "html-webpack-plugin";
import {WebpackLayerConfigurator} from "../types";

export const indexFileConfigLayer: WebpackLayerConfigurator = () => {
    return {
        plugins: [
            new HtmlWebpackPlugin({
                title: "Hello, new FFBT!",
                template: "src/index.ejs"
            })
        ]
    };
};

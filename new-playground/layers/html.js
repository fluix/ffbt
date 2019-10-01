const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            title: "Hello, new FFBT!",
            template: "src/index.ejs"
        })
    ]
};

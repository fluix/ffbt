const productionConfigGenerator = require("./production");

function makeConfig(projectConfig) {
    const config = productionConfigGenerator(projectConfig);
    config.webpackDevtool = "source-map";
    return config;
}

module.exports = makeConfig;

const productionConfigGenerator = require("./production");

function makeConfig(projectConfig, profileName) {
    const config = productionConfigGenerator(projectConfig, profileName);
    config.webpackDevtool = "source-map";
    return config;
}

module.exports = makeConfig;

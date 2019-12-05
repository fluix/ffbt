const OfflinePlugin = require('offline-plugin');

module.exports = {
    environments: {
        dev2: {
            _extends: "development",
            entrypointName: "index2",
        }
    },
    configureWebpack: (projectConfig, paths) => {
        return {
            plugins: [
                new OfflinePlugin(),
            ]
        }
    },
};

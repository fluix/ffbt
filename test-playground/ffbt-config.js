const OfflinePlugin = require('offline-plugin');

module.exports = {
    environments: {
        dev2: {
            _extends: "development",
            entrypointName: "index2",
        }
    },
    // disableWebpackLayers: () => ["buildNotifications"],
    configureWebpack: projectConfig => {
        return {
            plugins: [
                new OfflinePlugin(),
            ]
        }
    },
};

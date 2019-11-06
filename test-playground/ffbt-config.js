const OfflinePlugin = require('offline-plugin');

module.exports = {
    configureWebpack: (projectConfig, paths) => {
        return {
            plugins: [
                new OfflinePlugin(),
            ]
        }
    },
};

const OfflinePlugin = require('offline-plugin');

module.exports = {
    configureWebpack: (projectConfig, paths) => {
        console.log(projectConfig, paths);

        return {
            plugins: [
                new OfflinePlugin(),
            ]
        }
    },
};

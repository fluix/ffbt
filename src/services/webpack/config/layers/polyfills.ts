import {WebpackLayerConfigurator} from "../index";
import {existsSync} from "fs";
import {resolve} from "path";

export const polyfillsConfigLayer: WebpackLayerConfigurator = (projectConfig, paths) => {
    const pathToPolyfillsFile = resolve(paths.project.root, "polyfills.js");
    const hasPolyfillsFile = existsSync(pathToPolyfillsFile);

    if (!hasPolyfillsFile) {
        return {};
    }

    return {
        entry: {
            polyfills: pathToPolyfillsFile,
        }
    };
};

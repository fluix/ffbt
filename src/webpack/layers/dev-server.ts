import {WebpackLayerConfigurator} from "../types";

export const devServerConfigLayer: WebpackLayerConfigurator = () => {
    return {
        devServer: {
            open: true,
            overlay: true,
            port: 9393,
        }
    } as any; // TODO: Provide dev server types
};

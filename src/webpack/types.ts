import {ProjectConfig} from "../project-config";
import * as webpack from "webpack";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => webpack.Configuration;
export interface ProjectPaths {
    workingDirectory: string;
}

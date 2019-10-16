import {ProjectConfig} from "../project-config";
import * as webpack from "webpack";
import {ProjectPaths} from "../paths";
import {DeepPartial} from "utility-types";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => webpack.Configuration;
// export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => DeepPartial<webpack.Configuration>;


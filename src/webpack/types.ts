import {ProjectConfig} from "../project-config";
import * as webpack from "webpack";
import {ProjectPaths} from "../paths";

export type WebpackLayerConfigurator = (projectConfig: ProjectConfig, paths: ProjectPaths) => webpack.Configuration;


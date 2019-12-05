import * as path from "path";
import {Options} from "tslint/lib/runner";
import {locateFile} from "../../core/locate";
import {ProjectConfig} from "../../project-config";

interface CommandOptions {
    path: string;
    fix: boolean;
    force: boolean;
}

function getDefaultConfigPath() {
    return locateFile("tslint.json", __dirname);
}

export function createTsLintConfig(options: CommandOptions): Options {
    const config = ProjectConfig.loadFromFile(options.path);

    const customConfigPath = locateFile("tslint.json", config.paths.projectRoot, false);
    const lintConfigPath = customConfigPath || getDefaultConfigPath();

    return {
        config: lintConfigPath,
        exclude: ["node_modules/**"],
        files: [path.resolve(config.paths.projectWorkingDirectory, "./**/*.ts?(x)")],
        fix: options.fix,
        force: options.force,
        format: "stylish",
        project: config.paths.projectTsConfig,
    };
}

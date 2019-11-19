import * as path from "path";
import {Options} from "tslint/lib/runner";
import {locateFile} from "../../core/locate";
import {ProjectPaths} from "../../paths";

interface CommandOptions {
    path: string;
    fix: boolean;
    force: boolean;
}

function getDefaultConfigPath() {
    return locateFile("tslint.json", __dirname);
}

export function createTsLintConfig(options: CommandOptions): Options {
    const paths = ProjectPaths.getInstance(options.path);

    const customConfigPath = locateFile("tslint.json", paths.projectRoot, false);
    const lintConfigPath = customConfigPath || getDefaultConfigPath();

    return {
        config: lintConfigPath,
        exclude: ["node_modules/**"],
        files: [path.resolve(paths.projectRoot, "./**/*.ts?(x)")],
        fix: options.fix,
        force: options.force,
        format: "stylish",
        project: paths.projectTsConfig,
    };
}

import * as path from "path";
import {Options} from "tslint/lib/runner";
import {calculateProjectPaths} from "../../paths";
import {locateFile} from "../../core/locate";

interface CommandOptions {
    path: string;
    fix: boolean;
    force: boolean;
}

function getDefaultConfigPath() {
    return locateFile("tslint.json", __dirname);
}

export function createTsLintConfig(options: CommandOptions): Options {
    const paths = calculateProjectPaths(options.path);
    const lintConfigPath = paths.project.tsLintConfig
        ? paths.project.tsLintConfig
        : getDefaultConfigPath();

    return {
        config: lintConfigPath,
        exclude: ["node_modules/**/*"],
        files: [path.resolve(paths.project.root, "./**/*.ts?(x)")],
        fix: options.fix,
        force: options.force,
        format: "stylish",
        project: paths.project.tsConfig,
    };
}

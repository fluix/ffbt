import * as path from "path";
import {LinterOptions as StyleLintOptions} from "stylelint";
import {calculateProjectPaths} from "../../paths";
import {locateFile} from "../../core/locate";

interface CommandOptions {
    path: string;
    fix: boolean;
}

function getLintConfig(customConfigPath: string) {
    if (!customConfigPath) {
        return require("./stylelint.config");
    }

    require(customConfigPath);
}

export function createStyleLintConfig(options: CommandOptions): Partial<StyleLintOptions> {
    const paths = calculateProjectPaths(options.path);

    const customConfigPath = locateFile("stylelint.config.js", paths.project.root, false);
    const lintConfig = getLintConfig(customConfigPath);

    return {
        config: lintConfig,
        fix: options.fix,
        files: path.join(paths.project.workingDirectory, "./**/**/**.scss"),
    };
}

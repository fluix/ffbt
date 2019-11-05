import * as path from "path";
import {LinterOptions as StyleLintOptions} from "stylelint";
import {locateFile} from "../../core/locate";
import {ProjectPaths} from "../../paths";

interface CommandOptions {
    path: string;
    fix: boolean;
}

function getLintConfig(projectRoot: string) {
    const customConfigPath = locateFile("stylelint.config.js", projectRoot, false);
    if (!customConfigPath) {
        return require("./stylelint.config");
    }

    return require(customConfigPath);
}

export function createStyleLintConfig(options: CommandOptions): Partial<StyleLintOptions> {
    const paths = new ProjectPaths(options.path);
    const lintConfig = getLintConfig(paths.projectRoot);

    return {
        config: lintConfig,
        fix: options.fix,
        files: path.join(paths.projectWorkingDirectory, "./**/**/**.scss"),
    };
}

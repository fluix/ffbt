import * as path from "path";
import {LinterOptions as StyleLintOptions} from "stylelint";
import {locateFile} from "../../core/locate";
import {ProjectConfig} from "../../project-config";

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
    const projectConfig = ProjectConfig.loadFromFile(options.path);
    const lintConfig = getLintConfig(projectConfig.paths.projectRoot);

    return {
        config: lintConfig,
        fix: options.fix,
        files: path.join(projectConfig.paths.projectWorkingDirectory, "./**/**/**.scss"),
    };
}

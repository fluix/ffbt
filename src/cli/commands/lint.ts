import {BaseCommand, BaseFlags} from "../base-command";
import * as Parser from "@oclif/parser";
import {flags} from "@oclif/command";
import {TsLintRunner} from "../../services/tslint/runner";
import {createTsLintConfig} from "../../services/tslint/config";
import {ServiceRunStrategy} from "../../services/run-strategy";
import {createStyleLintConfig} from "../../services/stylelint/config";
import {StyleLintRunner} from "../../services/stylelint/runner";

interface Flags extends BaseFlags {
    fix: boolean;
    force: boolean;
}

enum ArgumentsKeys {
    sourcesDirectory = "sources_directory",
    linterType = "linter_type",
}

interface Arguments {
    [ArgumentsKeys.linterType]: LinterType;
    [ArgumentsKeys.sourcesDirectory]: string;
}

enum LinterType {
    ts = "ts",
    style = "style",
}

export default class LintCommand extends BaseCommand {
    static description = "lint source code";

    static args: Array<Parser.args.IArg> = [
        {
            name: ArgumentsKeys.sourcesDirectory,
            description: "directory with sources of the application",
            required: true,
        },
        {
            name: ArgumentsKeys.linterType,
            description: "type of the linter",
            options: [LinterType.ts, LinterType.style],
            required: true,
        }
    ];

    static flags = {
        ...BaseCommand.flags,

        fix: flags.boolean({
            default: false,
            description: "fixes linting errors"
        }),
        force: flags.boolean({
            char: "f",
            default: false,
            description: "return status code 0 even if there are lint errors"
        }),
    };

    async run() {
        const {linter_type} = this.getArguments<Arguments>();

        this.getRunner(linter_type).run();
    }

    private getRunner(type: LinterType): ServiceRunStrategy {
        const {sources_directory} = this.getArguments<Arguments>();
        const flags = this.getFlags<Flags>();

        if (type === LinterType.ts) {
            const tsLintRunnerConfig = createTsLintConfig({
                ...flags,
                path: sources_directory,
            });

            if (flags.verbose) {
                console.log("TsLint Parameters", tsLintRunnerConfig, "\n");
            }

            return new TsLintRunner(tsLintRunnerConfig);
        }

        if (type === LinterType.style) {
            const styleLintRunnerConfig = createStyleLintConfig({
                ...flags,
                path: sources_directory,
            });

            if (flags.verbose) {
                console.log("StyleLint Parameters", styleLintRunnerConfig, "\n");
            }

            return new StyleLintRunner(styleLintRunnerConfig, flags.force);
        }

        throw new Error(`Lint runner for '${type}' is not implemented yet`);
    }
}

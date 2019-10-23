import {BaseCommand, BaseFlags} from "../base-command";
import * as Parser from "@oclif/parser";
import {flags} from "@oclif/command";
import {TsLintRunner} from "../../services/tslint/runner";
import {createTsLintConfig} from "../../services/tslint/config";
import {ServiceRunStrategy} from "../../services/run-strategy";

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
        const runner = this.getRunner(linter_type);

        if (!runner) {
            return;
        }

        runner.run();
    }

    private getRunner(type: LinterType): ServiceRunStrategy | null {
        const {sources_directory} = this.getArguments<Arguments>();
        const flags = this.getFlags<Flags>();

        if (type === LinterType.ts) {
            const tsLintRunnerConfig = createTsLintConfig({
                ...flags,
                path: sources_directory,
            });

            return new TsLintRunner(tsLintRunnerConfig);
        }

        return null;
    }
}

import {BaseCommand, BaseFlags} from "../base-command";
import * as Parser from "@oclif/parser";

interface Flags extends BaseFlags {
}

enum Arguments {
    sourcesDirectory = "sources_directory",
    linterType = "linter_type",
}

export default class LintCommand extends BaseCommand {
    static description = "lint source code";

    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.sourcesDirectory,
            description: "directory with sources of the application",
            required: true,
        },
        {
            name: Arguments.linterType,
            description: "type of the linter",
            options: ["ts", "style"],
            required: true,
        }
    ];

    static flags = BaseCommand.flags;

    async run() {
        const {args, flags} = this.parse<Flags, any>(LintCommand);

        console.log("LINT", args, flags);
    }
}

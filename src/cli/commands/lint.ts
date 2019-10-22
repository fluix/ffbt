import {BaseCommand} from "../base-command";
import * as Parser from "@oclif/parser";

enum Arguments {
    sourcesDirectory = "sources_directory",
}

export default class LintCommand extends BaseCommand {
    static description = "lint source code";

    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.sourcesDirectory,
            description: "directory with sources of the application",
        }
    ];

    static flags = BaseCommand.flags;

    async run() {
        const {args, flags} = this.parse(LintCommand);

        console.log("LINT", args, flags);
    }
}

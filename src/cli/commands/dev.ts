import {Command, flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {ServiceRunStrategy} from "../../services/webpack/runner";

enum Arguments {
    workingDirectory = "working_directory",
}

export default class DevCommand extends BaseWebpackCommand {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.workingDirectory
        }
    ];

    static flags = BaseWebpackCommand.flags;

    getWebpackRunner(): ServiceRunStrategy {
    }

    async run() {
        // TODO: Provide interface for arugments and flags
        const {args, flags} = this.parse(DevCommand);

    }
}

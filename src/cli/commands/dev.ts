import {Command, flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import {RunWebpackDevServerStrategy} from "../../services/webpack/runner/run-webpack-dev-server";
import * as webpack from "webpack";

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

    getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new RunWebpackDevServerStrategy(webpackConfig);
    }

    async run() {
        const {args, flags} = this.parse(DevCommand);
        const workdir = args[Arguments.workingDirectory];

        this.runWebpack(workdir, "development", flags);
    }
}

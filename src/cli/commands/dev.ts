import {flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import {RunWebpackDevServerStrategy} from "../../services/webpack/runner/run-webpack-dev-server";
import * as webpack from "webpack";
import {BaseCommand} from "../base-command";
import {RunWebpackCompileWatcherStrategy} from "../../services/webpack/runner/run-compile-watcher";

enum Arguments {
    workingDirectory = "working_directory",
}

export default class DevCommand extends BaseWebpackCommand {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.workingDirectory
        }
    ];

    static flags: flags.Input<any> = {
        server: flags.boolean({
            default: false,
            description: "Run a Development Server"
        }),
        ...BaseCommand.flags,
    };

    getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        const {flags} = this.parse(DevCommand);

        if (flags.server) {
            return new RunWebpackDevServerStrategy(webpackConfig);
        }

        return new RunWebpackCompileWatcherStrategy(webpackConfig);
    }

    async run() {
        const {args, flags} = this.parse(DevCommand);
        const workdir = args[Arguments.workingDirectory];

        this.runWebpack(workdir, "development", flags);
    }
}

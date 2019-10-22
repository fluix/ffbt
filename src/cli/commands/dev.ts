import {flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import {RunWebpackDevServerStrategy} from "../../services/webpack/runner/run-webpack-dev-server";
import * as webpack from "webpack";
import {BaseCommand} from "../base-command";
import {RunWebpackCompileWatcherStrategy} from "../../services/webpack/runner/run-compile-watcher";

export default class DevCommand extends BaseWebpackCommand {
    static description = "start developing the application";

    static args: Array<Parser.args.IArg> = BaseWebpackCommand.args;
    static flags: flags.Input<any> = {
        server: flags.boolean({
            default: false,
            description: "run a development server"
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
        const {flags} = this.parse(DevCommand);
        const workdir = this.getSourcesDirectory();

        this.runWebpack(workdir, "development", flags);
    }
}

import {flags} from "@oclif/command";
import * as Parser from "@oclif/parser";
import {BaseWebpackCommand, BaseWebpackFlags} from "../base-webpack-command";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import {RunWebpackDevServerStrategy} from "../../services/webpack/runner/run-webpack-dev-server";
import * as webpack from "webpack";
import {RunWebpackCompileWatcherStrategy} from "../../services/webpack/runner/run-compile-watcher";

interface Flags extends BaseWebpackFlags {
    server: boolean;
}

export default class DevCommand extends BaseWebpackCommand {
    static description = "start developing the application";

    static args: Array<Parser.args.IArg> = BaseWebpackCommand.args;
    static flags: flags.Input<Flags> = {
        server: flags.boolean({
            default: false,
            description: "run a development server",
            exclusive: ["output"]
        }),
        ...BaseWebpackCommand.flags,
    };

    getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        const {flags} = this.parse<Flags, any>(DevCommand);

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

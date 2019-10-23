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

    protected getEnvironment(): string {
        return "development";
    }

    protected getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        const flags = this.getFlags<Flags>();

        if (flags.server) {
            return new RunWebpackDevServerStrategy(webpackConfig);
        }

        return new RunWebpackCompileWatcherStrategy(webpackConfig);
    }
}

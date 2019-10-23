import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {MakeBundleStrategy} from "../../services/webpack/runner/make-bundle";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import * as webpack from "webpack";

enum Arguments {
    environmentName = "environment_name",
    workingDirectory = "working_directory",
}

export default class BundleCommand extends BaseWebpackCommand {
    static description = "create application bundle for specific environment";

    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.environmentName,
            required: true,
            description: "a name of environment configured in ffbt-config.js"
        },
        ...BaseWebpackCommand.args,
    ];

    static flags = BaseWebpackCommand.flags;

    protected getEnvironment(): string {
        const args = this.getArguments<any>();
        return args[Arguments.environmentName];
    }

    protected getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new MakeBundleStrategy(webpackConfig);
    }
}

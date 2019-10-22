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

    getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new MakeBundleStrategy(webpackConfig);
    }

    private getEnvironmentName(): string {
        const {args} = this.parse(BundleCommand);
        return args[Arguments.environmentName];
    }

    async run() {
        const {flags} = this.parse(BundleCommand);
        const workdir = this.getSourcesDirectory();
        const environmentName = this.getEnvironmentName();

        this.runWebpack(workdir, environmentName, flags);
    }
}

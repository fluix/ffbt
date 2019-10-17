import * as Parser from "@oclif/parser";
import {BaseWebpackCommand} from "../base-webpack-command";
import {MakeBundleStrategy} from "../../services/webpack/runner/make-bundle";
import {ServiceRunStrategy} from "../../services/webpack/runner";
import * as webpack from "webpack";

enum Arguments {
    profileName = "profile_name",
    workingDirectory = "working_directory",
}

export default class BundleCommand extends BaseWebpackCommand {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.profileName,
            required: true,
        },
        {
            name: Arguments.workingDirectory
        }
    ];

    static flags = BaseWebpackCommand.flags;

    getWebpackRunner(webpackConfig: webpack.Configuration): ServiceRunStrategy {
        return new MakeBundleStrategy(webpackConfig);
    }

    async run() {
        const {args, flags} = this.parse(BundleCommand);

        const workdir = args[Arguments.workingDirectory];
        const profileName = args[Arguments.profileName];

        this.runWebpack(workdir, profileName, flags);
    }
}

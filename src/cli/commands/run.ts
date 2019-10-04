import {Command, flags} from "@oclif/command";
import * as Parser from "@oclif/parser";

enum Arguments {
    profileName = "profile_name",
}

export default class RunWebpackCommand extends Command {
    static args: Array<Parser.args.IArg> = [
        {
            name: Arguments.profileName,
            required: true,
        }
    ];

    static flags: flags.Input<any> = {
        optimize: flags.boolean({
            default: false,
        }),
        output: flags.string({
            default: undefined,
        })
    };

    async run() {
        const {args, flags} = this.parse(RunWebpackCommand);

        console.log("Profile: ", args[Arguments.profileName].toUpperCase());
        console.log("Optimize: ", flags.optimize);
        flags.output && console.log("Output: ", flags.output);
    }
}

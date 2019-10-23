import {Command, flags} from "@oclif/command";

export interface BaseFlags {
    verbose: boolean;
}

export abstract class BaseCommand extends Command {
    static flags: flags.Input<BaseFlags> = {
        verbose: flags.boolean({
            default: false,
            description: "shows details about the results of running command",
        })
    };

    protected getArguments<TArgs>() {
        const {args} = this.parse<any, TArgs>(this.constructor as any);
        return args;
    }

    protected getFlags<TFlags>() {
        const {flags} = this.parse<TFlags, any>(this.constructor as any);
        return flags;
    }
}

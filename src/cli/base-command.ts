import {Command, flags} from "@oclif/command";
import {redBright} from 'chalk';

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

    async catch(error: Error) {
        const {verbose} = this.getFlags<BaseFlags>();

        const errorInfo = verbose
            ? String(error.stack)
            : error.message;

        console.log(redBright(errorInfo));
    }
}

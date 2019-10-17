import {Command, flags} from "@oclif/command";

export abstract class BaseCommand extends Command {
    static flags: flags.Input<any> = {
        verbose: flags.boolean({
            default: false,
        })
    };
}

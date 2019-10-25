import Chalk from "chalk";
import {Hook} from "@oclif/config";

const hook: Hook<'init'> = async function (options) {
    const banner =
        " _____ _____ _____ _____ \n" +
        "|   __|   __| __  |_   _|\n" +
        "|   __|   __| __ -| | |  \n" +
        "|__|  |__|  |_____| |_|  \n" +
        "                         ";

    console.log(Chalk.blueBright(banner));
};

export default hook;

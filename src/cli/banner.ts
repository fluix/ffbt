import {Hook} from "@oclif/config";
import {blueBright} from 'chalk';

const hook: Hook<'init'> = async function (options) {
    const banner =
        " _____ _____ _____ _____ \n" +
        "|   __|   __| __  |_   _|\n" +
        "|   __|   __| __ -| | |  \n" +
        "|__|  |__|  |_____| |_|  \n" +
        "                         ";

    console.log(blueBright(banner));
};

export default hook;

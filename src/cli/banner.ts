import {Hook} from "@oclif/config";
import {blueBright} from 'chalk';

const hook: Hook<'init'> = async function (options) {
    const banner = "FFBT: Fluix Frontend Build Tool 🛠 \n";
    console.log(blueBright(banner));
};

export default hook;

#!/usr/bin/env node
const path = require("path"),
    fs = require("fs"),
    chalk = require("chalk"),
    findUp = require('find-up');

const argv = require("minimist")(process.argv.slice(2)),
    constants = require("../constants");

const NODE_MODULES = locate("node_modules");
const ROOT = path.dirname(NODE_MODULES);
const PROJECT_CONFIG_PATH = locate("config.js");
const PROJECT_ROOT = path.dirname(PROJECT_CONFIG_PATH);

let [command, workdir] = argv._;
const ciMode = argv.ci === true;

if (!workdir) {
    workdir = process.cwd();
}
const ENTRYPOINT_PATH = path.resolve(workdir, constants.tsEntrypointName);

function locate(name) {
    const path = findUp.sync(name);
    if (!path) {
        printCriticalError(`Can't locate ${name}`);
    }

    return path;
}

function printCriticalError(errorText) {
    console.error(chalk.red(errorText));
    process.exit(1);
}

function printAvailableCommands(availableCommands) {
    console.log("Available commands:");
    console.log(availableCommands.reduce(function(buffer, command) {
        return buffer + ` - ${command}\n`;
    }, ""));
}

function setupEnvVariables(command) {
    process.env.NODE_ENV = getEnvForCommand(command);

    if (command === "test") {
        process.env.TEST_DIR = workdir;
    } else {
        process.env.BUILD_WORKDIR = workdir;
    }

    if (ciMode) {
        process.env.TEST_CI_MODE = true;
    }
}

function runCommand(command) {
    setupEnvVariables(command);

    const config = require(PROJECT_CONFIG_PATH);
    config.resolveLoader = {
        modules: ["node_modules", NODE_MODULES]
    };

    const runBuildCommand = require(`./commands/${command}.js`);
    runBuildCommand(config);
}

function runLintCommand(type) {
    const startLinter = require(`./commands/lint/${type}.js`);

    startLinter(ROOT, path.resolve(PROJECT_ROOT, workdir), argv);
}

function getEnvForCommand(command) {
    switch (command) {
        case "dev":
        case "dev-server":
            return "dev";
        case "test":
            return "test";
        case "build":
        default:
            return "production";
    }
}

const availableCommands = [
    "dev",
    "dev-server",
    "build",
    "test",
    "lint-style",
    "lint-ts"
];

if (!availableCommands.includes(command)) {
    console.error(chalk.red(`Unknown command "${command}"`));
    printAvailableCommands(availableCommands);
    process.exit(1);
}

if (command === "lint-style" || command === "lint-ts") {
    const [, type] = command.split("-");
    runLintCommand(type);
} else {
    if (!fs.existsSync(ENTRYPOINT_PATH)) {
        printCriticalError(`Can't locate ${constants.tsEntrypointName}`)
    }

    runCommand(command);
}


#!/usr/bin/env node

const path = require("path"),
    chalk = require("chalk");

const argv = require("minimist")(process.argv.slice(2));

const ROOT = path.resolve(__dirname, "../");
const NODE_MODULES = path.resolve(ROOT, "./node_modules");
const PROJECT_ROOT = process.cwd();
const PROJECT_CONFIG_PATH = path.resolve(PROJECT_ROOT, "config.js");

const [command] = argv._;
const workdir = argv.workdir || "./";
const ciMode = argv.ci === true;

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

    const runCommand = require(`./commands/${command}.js`);

    runCommand(config);
}

function runLintCommand(type) {
    const runCommand = require(`./commands/lint/${type}.js`);

    runCommand(ROOT, path.resolve(PROJECT_ROOT, workdir), argv);
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
    runCommand(command);
}


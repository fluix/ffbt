#!/usr/bin/env node
const path = require("path"),
    fs = require("fs"),
    chalk = require("chalk"),
    findUp = require('find-up'),
    WebpackConfigGenerator = require("../webpack/config-generator");

const argv = require("minimist")(process.argv.slice(2)),
    utils = require("../utils"),
    constants = require("../constants"),
    defaultConfig = require("../config/default");

let [command, workdir] = argv._;
const ciMode = argv.ci === true;
const analyzeMode = argv.analyze === true;

if (!workdir) {
    workdir = process.cwd();
}

const FFBT_ROOT_PATH = path.dirname(locate("node_modules", __dirname));
const PROJECT_NODE_MODULES_PATH = locate("node_modules", workdir, false);
const PROJECT_CONFIG_PATH = locate("config.js", workdir);
const PROJECT_PACKAGE_JSON_PATH = locate("package.json", workdir, false);
const PROJECT_ROOT_PATH = path.dirname(PROJECT_CONFIG_PATH);
const ENTRYPOINT_PATH = utils.locateEntrypoint(workdir);

const PROJECT_PACKAGE_JSON = require(PROJECT_PACKAGE_JSON_PATH);

function locate(name, cwd = '', raiseErrorIfNotExists = true) {
    const path = findUp.sync(name, {
        cwd: cwd
    });
    if (!path && raiseErrorIfNotExists) {
        printCriticalError(`Can't locate ${name}`);
    }

    return path || "";
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
    process.env.PLATFORM = "web";
    process.env.NODE_ENV = getProfileForCommand(command);

    if (analyzeMode) {
        process.env.FFBT_ANALYZE_MODE = true;
    }

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

    let projectConfig = require(PROJECT_CONFIG_PATH);
    projectConfig = applyConfigDefaults(projectConfig);
    overrideConfigOptionsFromCli(projectConfig, argv);

    const BuildConfigGenerator = new WebpackConfigGenerator(projectConfig);
    const buildProfile = getProfileForCommand(command);
    const buildWorkdir = workdir
        ? path.resolve(PROJECT_ROOT_PATH, workdir)
        : PROJECT_ROOT_PATH;

    const webpackConfig = BuildConfigGenerator.makeBuildConfig(buildProfile, buildWorkdir, PROJECT_NODE_MODULES_PATH);

    const runBuildCommand = require(`./commands/${command}.js`);
    runBuildCommand(webpackConfig, {
        projectName: PROJECT_PACKAGE_JSON.name
    });
}

function overrideConfigOptionsFromCli(projectConfig, argv) {
    // ability to override output path via cli option
    const outputPathOption = argv.output;

    if (outputPathOption) {
        projectConfig.buildPath = path.resolve(process.cwd(), outputPathOption);
    }
}

function applyConfigDefaults(projectConfig) {
    const newConfig = Object.assign({}, defaultConfig, projectConfig);
    newConfig.projectRoot = PROJECT_ROOT_PATH;

    // if path is relative - it becomes absolute to project root
    // if path is absolute - nothing happens
    newConfig.buildPath = path.resolve(PROJECT_ROOT_PATH, newConfig.buildPath);

    return newConfig;
}

function runLintCommand(type) {
    const startLinter = require(`./commands/lint/${type}.js`);

    startLinter(FFBT_ROOT_PATH, path.resolve(PROJECT_ROOT_PATH, workdir), argv);
}

function getProfileForCommand(command) {
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
    if (!ENTRYPOINT_PATH) {
        printCriticalError(`Can't locate ${constants.tsEntrypointName}.ts(x)`);
    }

    runCommand(command);
}


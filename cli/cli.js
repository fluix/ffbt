#!/usr/bin/env node
/* eslint-disable no-use-before-define,global-require */
const path = require("path");
const chalk = require("chalk");
const findUp = require("find-up");
const WebpackConfigGenerator = require("../webpack/config-generator");

const argv = require("minimist")(process.argv.slice(2));
const utils = require("../utils");
const constants = require("../constants");
const defaultConfig = require("../config/default");

/* eslint-disable-next-line prefer-const */
let [command, workdir] = argv._;
const analyzeMode = argv.analyze === true;

if (!workdir) {
    workdir = process.cwd();
}

const FFBT_ROOT_PATH = path.dirname(locatePath("node_modules", __dirname));
const PROJECT_NODE_MODULES_PATH = locatePath("node_modules", workdir, false);
const PROJECT_CONFIG_PATH = locatePath("ffbt-config.js", workdir);
const PROJECT_PACKAGE_JSON_PATH = locatePath("package.json", workdir, false);
const PROJECT_ROOT_PATH = path.dirname(PROJECT_CONFIG_PATH);
const ENTRYPOINT_PATH = utils.locateEntrypoint(workdir);

const PROJECT_PACKAGE_JSON = require(PROJECT_PACKAGE_JSON_PATH);

function locatePath(name, cwd = "", raiseErrorIfNotExists = true) {
    const locatedPath = findUp.sync(name, {
        cwd,
    });
    if (!locatedPath && raiseErrorIfNotExists) {
        printCriticalError(`Can't locate ${name}`);
    }

    return locatedPath || "";
}

function printCriticalError(errorText) {
    // eslint-disable-next-line no-console
    console.error(chalk.red(errorText));
    process.exit(1);
}

function printAvailableCommands(availableCommands) {
    console.log("Available commands:"); // eslint-disable-line no-console
    // eslint-disable-next-line no-console
    console.log(availableCommands.reduce((buffer, _command) => `${buffer} - ${_command}\n`, ""));
}

function setupEnvVariables(_command) {
    process.env.PLATFORM = "web";
    process.env.NODE_ENV = getProfileForCommand(_command);

    if (analyzeMode) {
        process.env.FFBT_ANALYZE_MODE = true;
    }

    process.env.BUILD_WORKDIR = workdir;
}

function runCommand(_command) {
    setupEnvVariables(_command);

    let projectConfig = require(PROJECT_CONFIG_PATH);
    projectConfig = applyConfigDefaults(projectConfig);
    overrideConfigOptionsFromCli(projectConfig, argv);

    const BuildConfigGenerator = new WebpackConfigGenerator(projectConfig);
    const buildProfile = getProfileForCommand(_command);
    const buildWorkdir = workdir
        ? path.resolve(PROJECT_ROOT_PATH, workdir)
        : PROJECT_ROOT_PATH;

    const webpackConfig = BuildConfigGenerator.makeBuildConfig(
        buildProfile,
        buildWorkdir,
        PROJECT_NODE_MODULES_PATH,
    );

    const runBuildCommand = require(`./commands/${_command}.js`);
    runBuildCommand(webpackConfig, {
        projectName: PROJECT_PACKAGE_JSON.name,
    });
}

function overrideConfigOptionsFromCli(projectConfig, _argv) {
    // ability to override output path via cli option
    const outputPathOption = _argv.output;

    if (outputPathOption) {
        // eslint-disable-next-line no-param-reassign
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
    const projectConfig = require(PROJECT_CONFIG_PATH);
    const startLinter = require(`./commands/lint/${type}.js`);

    startLinter(FFBT_ROOT_PATH, path.resolve(PROJECT_ROOT_PATH, workdir), argv, projectConfig, PROJECT_ROOT_PATH);
}

function getProfileForCommand(_command) {
    switch (_command) {
    case "dev":
    case "dev-server":
        return "dev";
    case "build":
    default:
        return "production";
    }
}

const availableCommands = [
    "dev",
    "dev-server",
    "build",
    "lint-style",
    "lint-ts",
];

if (!availableCommands.includes(command)) {
    // eslint-disable-next-line no-console
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

const path = require("path");
const chalk = require("chalk");
const Karma = require("karma");
const Environment = require("../../environment");
const ConfigGenerator = require("../../karma/config-generator");


function printHeading(ciMode, workDir) {
    const profileName = ciMode ? "CI" : "dev";
    const absoluteWorkDir = path.resolve(workDir);
    const bigProfileName = profileName.toUpperCase();

    console.log(chalk.yellow.bold("Test profile:", chalk.green.bold(bigProfileName))); // eslint-disable-line no-console
    console.log(chalk.yellow("Working dir:"), chalk.green(absoluteWorkDir)); // eslint-disable-line no-console
    console.log(); // eslint-disable-line no-console
}

module.exports = (buildConfig) => {
    const karmaConfig = ConfigGenerator.makeEnvironmentConfig(buildConfig);

    const ciMode = Environment.ciModeEnabled();
    const workDir = Environment.getTestWorkingDir();

    printHeading(ciMode, workDir);

    const server = new Karma.Server(karmaConfig, ((exitCode) => {
        if (exitCode !== 0) {
            console.error(chalk.red( // eslint-disable-line no-console
                `\nKarma has exited with code ${exitCode}`,
            ));
        }

        process.exit(exitCode);
    }));

    server.start();
};

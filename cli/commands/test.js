const path = require("path"),
    chalk = require("chalk"),
    Environment = require("../../environment"),
    ConfigGenerator = require("../../karma/config-generator"),
    KarmaServer = require('karma').Server

function printHeading(ciMode, workDir) {
    const profileName = ciMode ? "CI" : "dev",
        absoluteWorkDir = path.resolve(workDir),
        bigProfileName = profileName.toUpperCase();

    console.log(chalk.yellow.bold('Test profile:', chalk.green.bold(bigProfileName)));
    console.log(chalk.yellow('Working dir:'), chalk.green(absoluteWorkDir));
    console.log();
}

module.exports = function(buildConfig) {
    const generator = new ConfigGenerator();
    const karmaConfig = generator.makeEnvironmentConfig(buildConfig);

    const ciMode = Environment.ciModeEnabled();
    const workDir = Environment.getTestWorkingDir();
    
    printHeading(ciMode, workDir);

    const server = new KarmaServer(karmaConfig, function(exitCode) {
        if (exitCode !== 0) {
            console.error(chalk.red(
                `\nKarma has exited with code ${exitCode}`
            ));
        }

        process.exit(exitCode);
    });

    server.start();
};

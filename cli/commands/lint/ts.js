const path = require("path");
const tslintRunner = require("tslint/lib/runner");

module.exports = (ffbtRoot, workDir, argv, projectConfig, PROJECT_ROOT_PATH) => {
    // eslint-disable-next-line no-param-reassign
    argv = argv || {};
    const fix = (typeof argv.fix === "undefined") ? false : Boolean(argv.fix);
    const force = (typeof argv.force === "undefined") ? false : Boolean(argv.force);
    let configPath = path.resolve(ffbtRoot, "./linters/tslint.json");

    if (projectConfig.tsLintConfigPath) {
        configPath = path.resolve(PROJECT_ROOT_PATH, projectConfig.tsLintConfigPath);
    }

    const runnerConfig = {
        config: configPath,
        exclude: "node_modules/**/*",
        files: path.resolve(workDir, "./**/*.ts?(x)"),
        fix,
        force,
        format: "stylish",
    };

    tslintRunner.run(runnerConfig, {
        log: console.log, // eslint-disable-line no-console
        error: m => console.error(m), // eslint-disable-line no-console
    })
        .then((rc) => {
            process.exitCode = rc;
        })
        .catch((e) => {
            console.error(e); // eslint-disable-line no-console
            process.exitCode = 1;
        });
};

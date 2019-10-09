import chalk from "chalk";

export function printCriticalError(errorText: string) {
    console.error(chalk.red(errorText));
    process.exit(1);
}

export function printDeprecationWarning(deprecatedName: string, newName: string) {
    console.warn(chalk.red(`WARN: ${deprecatedName} is deprecated. Use ${newName} instead`));
}

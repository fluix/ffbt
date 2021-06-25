import {Configuration, Stats} from "webpack/types";
import {bold, red} from "chalk";

function getTimeString(): string {
    const dateNow = new Date();
    const hoursString = String(dateNow.getHours()).padStart(2, "0");
    const minutesString = String(dateNow.getMinutes()).padStart(2, "0");
    const secondsString = String(dateNow.getSeconds()).padStart(2, "0");

    return `${hoursString}:${minutesString}:${secondsString}`;
}

export const printWebpackStats = (settings?: Configuration["stats"]) => {
    return (error?: Error, stats?: Stats) => {
        const startTime = stats?.startTime || NaN;
        const endTime = stats?.endTime || NaN;
        const buildDuration = endTime - startTime;
        const prettyBuildDuration = isNaN(buildDuration)
            ? bold(red("unknown"))
            : `${bold(buildDuration)}ms`;

        console.log();
        console.log(`🛠  Built at ${getTimeString()}`);

        if (settings === "minimal") {
            console.log(`   Time: ${prettyBuildDuration}`);
        }

        console.log(stats?.toString(settings));
        console.log();
    };
};

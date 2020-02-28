import * as webpack from "webpack";

function getTimeString(): string {
    const dateNow = new Date();
    const hoursString = String(dateNow.getHours()).padStart(2, "0");
    const minutesString = String(dateNow.getMinutes()).padStart(2, "0");
    const secondsString = String(dateNow.getSeconds()).padStart(2, "0");

    return `${hoursString}:${minutesString}:${secondsString}`;
}

export const printWebpackStats = (settings?: webpack.Stats.ToJsonOptions): webpack.ICompiler.Handler => {
    return (error, stats) => {
        console.log();
        console.log(`🛠  Built at ${getTimeString()}`);
        console.log(stats.toString(settings));
        console.log();
    };
};

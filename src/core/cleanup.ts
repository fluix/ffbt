export function cleanupIfError(cleanupCallback: Function) {
    const endSignals: Array<NodeJS.Signals> = ["SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"];
    endSignals.forEach((sig) => {
        process.on(sig, () => {
            cleanupCallback();
        });
    });

    process.on("uncaughtException", (error) => {
        console.log("Process stopped because of uncaught exception");
        console.log(error);
        cleanupCallback();
    });
}

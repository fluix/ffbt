import "./index.scss";
import {hello} from "./constants";

console.log(hello);
console.log(require("./test.html"));

setTimeout(() => {
    console.log("Start loading print.ts");
    import("./lazy/print").then((printModule) => {
        printModule.default();
    })
}, 1000);

// console.log(FFBT_BUILD_VERSION);

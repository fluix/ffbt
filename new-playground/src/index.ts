import "./index.scss";
import {hello} from "./constants";

console.log(hello);
console.log(require("./test.html"));

function USELESS_FUNCTION() {
    USELESS_FUNCTION_1();
}

function USELESS_FUNCTION_1() {
    console.log("I AM USELESS!!");
}

setTimeout(() => {
    console.log("Start loading print.ts");
    import("./lazy/print").then((printModule) => {
        printModule.default();
    })
}, 1000);

// console.log(FFBT_BUILD_VERSION);

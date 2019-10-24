import "./index.scss";
// import "./bad-styles.scss";
// import "./file-that-doesnt-exist.scss";
import {hello} from "./constants";
// @ts-ignore
import * as leftpad from "leftpad";

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

// Produce type error
// const a = 1;
// a = 2;

console.log(leftpad("hello", 20, "_"));

// console.log(FFBT_BUILD_VERSION);

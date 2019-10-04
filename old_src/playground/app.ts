import {FooText} from "./tsx/file";
import "./styles/root-style.scss";
import "./styles/style.css";

document.querySelector("#root").innerHTML = `${FooText} BAR`;

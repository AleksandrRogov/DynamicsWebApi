import { createRequire } from "module";
const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

// import packageJson from "../package.json" assert { type: "json" }; can't use this in node v15

export function getBanner() {
    return `${packageJson.name} v${packageJson.version} (c) ${new Date().getFullYear()} Aleksandr Rogov`;
}

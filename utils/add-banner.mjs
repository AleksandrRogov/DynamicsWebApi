import { readFileSync, writeFile } from "fs";

import { getBanner } from "./banner.mjs";
const banner = `/*! ` + getBanner() + " */\n";

const files = ["./dist/dynamics-web-api.d.ts"];

files.forEach((file) => {
    const data = readFileSync(file).toString();
    writeFile(file, banner + data, (error) => {
        if (error) console.error(error);
    });
});

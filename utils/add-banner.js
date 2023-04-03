const fs = require("fs");

const getBanner = require("./banner");
const banner = `/*! ` + getBanner() + " */\n";

const files = ["./dist/dynamics-web-api.d.ts"];

files.forEach((file) => {
    const data = fs.readFileSync(file).toString();
    fs.writeFile(file, banner + data, (error) => {
        if (error) console.error(error);
    });
});

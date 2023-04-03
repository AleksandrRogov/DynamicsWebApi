const pckgJson = require("../package.json");

module.exports = function () {
    return `${pckgJson.name} v${pckgJson.version} (c) ${new Date().getFullYear()} Aleksandr Rogov`;
};

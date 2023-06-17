var webpack = require("webpack");
var TerserPlugin = require("terser-webpack-plugin");
var path = require("path");
const getBanner = require("./utils/banner");

var configs = [];

const getFileData = (path) => {
    const pathSplit = path.split("/");
    const fileNameParts = pathSplit.length ? pathSplit[pathSplit.length - 1].split(".") : path.split(".");

    pathSplit.pop();

    return {
        name: fileNameParts[0],
        extension: fileNameParts[fileNameParts.length - 1],
        path: pathSplit.join("/"),
    };
};

const ifdefOptions = {
    node: false,
};

["dynamics-web-api.js", "dynamics-web-api.min.js"].forEach(function (name) {
    const file = getFileData(name);

    const plugins = [];
    const minimize = name.endsWith("min.js");
    const outputLibrary = name === "dwa.js" ? "DWA" : "DynamicsWebApi";

    plugins.push(
        new webpack.BannerPlugin({
            banner: getBanner(),
        })
    );

    configs.push({
        name: name,
        entry: `./lib/${file.name}.js`,
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: name,
            library: outputLibrary,
            libraryTarget: "umd",
            umdNamedDefine: true,
        },
        optimization: {
            minimize: minimize,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        format: {
                            comments: /^.+Aleksandr Rogov.+$/,
                        },
                    },
                    extractComments: false,
                }),
            ],
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: "pre",
                    exclude: /(node_modules|bower_components|\.spec\.js)/,
                    use: [{ loader: "ifdef-loader", options: ifdefOptions }],
                },
            ],
        },
        resolve: {
            fallback: {
                crypto: false,
            },
        },
    });
});

module.exports = configs;

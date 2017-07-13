var webpack = require('webpack');
var path = require('path');
var version = require('./package').version;

var configs = [];

[
    'dynamics-web-api.js',
    'dynamics-web-api-callbacks.js',
    'dynamics-web-api.min.js',
    'dynamics-web-api-callbacks.min.js',
    'dwa.js'
].forEach(function (name) {
    var minimize = name.endsWith('min.js');
    var packageName = name.split('.')[0];
    var plugins = [];
    var outputLibrary = name === 'dwa.js'
        ? 'DWA'
        : 'DynamicsWebApi'

    if (minimize) {
        plugins.push(new webpack.optimize.UglifyJsPlugin());
    }

    plugins.push(new webpack.BannerPlugin({
        banner: `${packageName} v${version} (c) ${new Date().getFullYear()} Aleksandr Rogov`
    }));

    configs.push({
        name: name,
        entry: `./lib/${packageName}.js`,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: name,
            library: outputLibrary,
            libraryTarget: "umd",
            umdNamedDefine: true
        },
        plugins: plugins,
        module: {
            loaders: [
                { test: /\.js$/, loader: 'webpack-strip-block' }
            ]
        },
    });
});

module.exports = configs;
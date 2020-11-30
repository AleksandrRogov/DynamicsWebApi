var webpack = require('webpack');
var TerserPlugin = require('terser-webpack-plugin');
var path = require('path');
var version = require('./package').version;

var configs = [];

[
    'dynamics-web-api.js',
    'dynamics-web-api-callbacks.js',
    'dynamics-web-api.min.js',
    'dynamics-web-api-callbacks.min.js'
    //'dwa.js'
].forEach(function (name) {
    var plugins = [];
    var packageName = name.split('.')[0];

    var minimize = name.endsWith('min.js');
    var outputLibrary = name === 'dwa.js'
        ? 'DWA'
        : 'DynamicsWebApi';

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
		optimization: {
			minimize: minimize,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: /^.+Aleksandr Rogov.+$/,
						},
					},
					extractComments: false
				})
			]
		},
		plugins: plugins,
        module: {
			rules: [
				{
					test: /\.js$/,
					enforce: 'pre',
					exclude: /(node_modules|bower_components|\.spec\.js)/,
					use: [
						{
							loader: 'webpack-strip-block'
						}
					]
				}
			]
		},
		resolve: {
			fallback: {
				"crypto": false
			}
		}
    });
});

module.exports = configs;
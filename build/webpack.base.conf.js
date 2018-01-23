'use strict';
const path = require('path')
const config = require('../config')

module.exports = {
	context: path.resolve(__dirname, '..'),
	entry: {
		app: './src/main.js',
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.build.assetsPublicPath,
	},
	module: {
		rules: [
			{test: /\.(?:jsx?)$/, use: 'babel-loader', exclude: [/node_modules/]},
			{test: /\.css$/, use: ['style-loader', 'css-loader']},
		]
	},
};

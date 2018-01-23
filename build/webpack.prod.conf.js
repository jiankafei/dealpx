'use strict';
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = require('../config/prod.env');

module.exports = merge(baseWebpackConfig, {
	output: {
		path: config.build.assetsRoot,
		filename: path.join(config.build.assetsSubDirectory, 'js/[name].[chunkhash].js'),
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env,
		}),
		new HtmlWebpackPlugin({
			template: './static/index.html',
			filename: path.resolve(__dirname, '../dist/pp.html'),
			inject: true,
			minify: {
			  removeComments: true,
			  collapseWhitespace: true,
			  removeAttributeQuotes: true,
			},
			title: '物理像素渲染',
			viewport: 'user-scalable=no',
		}),
		new HtmlWebpackPlugin({
			template: './static/index.html',
			filename: path.resolve(__dirname, '../dist/lp.html'),
			inject: true,
			minify: {
			  removeComments: true,
			  collapseWhitespace: true,
			  removeAttributeQuotes: true,
			},
			title: '逻辑像素渲染',
			viewport: 'width=device-width,user-scalable=no',
		})
	],
});

'use strict';
const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const htmlWebpackTemplate = require('html-webpack-template');
const env = require('../config/prod.env');

// HtmlWebpackPlugin 配置
const HWP = {
	inject: false,
	template: htmlWebpackTemplate,
	lang: 'zh-cmn-Hans',
	links: [],
	scripts: [],
	minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
	},
};

module.exports = merge(baseWebpackConfig, {
	output: {
		path: config.build.assetsRoot,
		filename: path.join(config.build.assetsSubDirectory, 'js/[name].[chunkhash].js'),
	},
	module: {
		rules: [
			{test: /\.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env,
		}),
		new UglifyJsPlugin({
			uglifyOptions: {
				compress: {
					warnings: false,
				},
			},
			parallel: true,
		}),
		new ExtractTextPlugin({
			filename: path.join(config.build.assetsSubDirectory, 'css/[name].[contenthash].css'),
		}),
		new HtmlWebpackPlugin(Object.assign({
			filename: path.resolve(__dirname, '../dist/pp.html'),
			title: '物理像素渲染',
			meta: [{name: 'viewport', content: 'user-scalable=no'}],
		}, HWP)),
		new HtmlWebpackPlugin(Object.assign({
			filename: path.resolve(__dirname, '../dist/lp.html'),
			title: '逻辑像素渲染',
			meta: [{name: 'viewport', content: 'width=device-width,user-scalable=no'}],
		}, HWP)),
	],
});

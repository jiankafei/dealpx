'use strict';
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackTemplate = require('html-webpack-template');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const env = require('../config/dev.env');

module.exports = merge(baseWebpackConfig, {
	devServer: {
		clientLogLevel: 'warning',
		hot: true,
		compress: true,
		host: HOST || config.dev.host,
		port: PORT || config.dev.port,
		open: config.dev.autoOpenBrowser,
		overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
		publicPath: config.dev.assetsPublicPath,
		proxy: config.dev.proxyTable,
		watchOptions: {
			poll: config.dev.poll,
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': env,
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
		new HtmlWebpackPlugin({
			inject: false,
			template: htmlWebpackTemplate,
			filename: 'index.html',
			title: '逻辑像素渲染',
			lang: 'zh-cmn-Hans',
			meta: [{name: 'viewport', content: 'width=device-width,user-scalable=no'}],
			links: [],
			scripts: [],
		}),
	]
});

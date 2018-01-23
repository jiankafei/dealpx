'use strict';

const path = require('path');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const rm = require('rimraf');

process.env.NODE_ENV = 'production';
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
	if (err) throw err;
	webpack(webpackConfig, (err, stats) => {
		if (err) throw err;
	});
});

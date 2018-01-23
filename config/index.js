'use strict';
const path = require('path');

module.exports = {
	dev: {
		 // Paths
		 assetsSubDirectory: 'static',
		 assetsPublicPath: '/',
		 proxyTable: {},

		 // Various Dev Server settings
		 host: 'localhost', // can be overwritten by process.env.HOST
		 port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
		 autoOpenBrowser: false,
		 errorOverlay: true,
		 notifyOnErrors: true,
		 poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

	},
	build: {
		// Template for index.html
		// index: path.resolve(__dirname, '../dist/index.html'),

		// Paths
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
	}
};

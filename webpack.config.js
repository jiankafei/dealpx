const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: path.join(__dirname, 'src', 'app'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
			{test: /\.(?:css|sss)$/, use: ['style-loader', 'css-loader', 'postcss-loader']}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './assets/index.html',
			title: '物理像素渲染',
			viewport: 'user-scalable=no',
			chunks: {
				head: {
					entry: './assets/flexible.js',
					css: ['reset.css']
				}
			}
		}),
		new HtmlWebpackPlugin({
			template: './assets/index.html',
			title: '逻辑像素渲染',
			viewport: 'width: device-width, user-scalable=no',
			chunks: {
				head: {
					entry: './assets/flexible.js',
					css: ['reset.css']
				}
			}
		})
	]
};

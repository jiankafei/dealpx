const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{test: /\.js$/, use: 'babel-loader', exclude: [/node_modules/, /static/]},
			{test: /\.css$/, use: ['style-loader', 'css-loader']}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './static/index.html',
			filename: './dist/pp.html',
			title: '物理像素渲染',
			viewport: 'user-scalable=no'
		}),
		new HtmlWebpackPlugin({
			template: './static/index.html',
			filename: './dist/lp.html',
			title: '逻辑像素渲染',
			viewport: 'width=device-width,user-scalable=no'
		})
	],
	devServer: {
		open: true,
		hot: true,
		inline: true,
		compress: true
	}
};

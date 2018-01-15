const path = require('path');
module.exports = {
	entry: path.join(__dirname, 'app', 'index'),
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: []
	},
	plugin: [
		new HtmlWebpackPlugin({
			title: '物理像素渲染',
			viewport: 'user-scalable=no'
		}),
		new HtmlWebpackPlugin({
			title: '逻辑像素渲染',
			viewport: 'width: device-width, user-scalable=no'
		})
	]
};

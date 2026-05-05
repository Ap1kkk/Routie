const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	devtool: 'eval-source-map',
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, './dist'),
		compress: true,
		port: 5000,
		open: true,
		hot: true,
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
		new Dotenv({
			path: '../.env',
			safe: false,
			systemvars: true,
		}),
	],
};

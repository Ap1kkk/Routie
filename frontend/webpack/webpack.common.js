const HTMLWebpackPlugins = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.resolve(__dirname, '..', './src/index.tsx'),
	output: {
		path: path.resolve(__dirname, '..', './dist'),
		filename: production
			? 'static/scripts/[name].[contenthash].js'
			: 'static/scripts/[name].js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.[tj]sx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|webp)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/images-123/[hash][ext][query]',
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack', 'url-loader'],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					production ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
								localIdentName:
									'[name]__[local]__[hash:base64:5]',
								auto: /\.module\.\w+$/i,
							},
							importLoaders: 2,
						},
					},
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							api: 'modern',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
		modules: [path.resolve(__dirname, '..', './src'), 'node_modules'],
		alias: {
			'@fonts': path.resolve(__dirname, '..', './src/assets/fonts'),
			'@icons': path.resolve(__dirname, '..', './src/assets/icons'),
			'@images': path.resolve(__dirname, '..', './src/assets/images'),
			'@components': path.resolve(__dirname, '..', './src/components'),
			'@pages': path.resolve(__dirname, '..', './src/pages'),
			'@ui': path.resolve(__dirname, '..', './src/ui'),
			'@selectors': path.resolve(
				__dirname,
				'..',
				'./src/services/selectors'
			),
			'@slices': path.resolve(__dirname, '..', './src/services/slices'),
			'@store': path.resolve(__dirname, '..', './src/services/store'),
			'@types': path.resolve(__dirname, '..', './src/types'),
			'@utils': path.resolve(__dirname, '..', './src/utils'),
		},
	},
	plugins: [
		new HTMLWebpackPlugins({
			template: path.resolve(__dirname, '..', './public/index.html'),
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: production
				? 'static/styles/[name].[contenthash].css'
				: 'static/styles/[name].css',
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),
	],
};

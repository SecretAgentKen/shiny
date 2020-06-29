const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		app: './src/index.js',
	},
	output: {
		path: path.join(__dirname,'dist'),
		publicPath: '/',
		filename: '[name].js'
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader'
			},
			{
				test: /\.(wav|ttf|woff|woff2|eot|svg)$/,
				use: 'file-loader'
			},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader','css-loader']
			}
		]
	},
	plugins: [
		new HtmlPlugin({
			template: './src/options.html',
			filename: './options.html',
			chunks: ['app']
		}),
		new VueLoaderPlugin(),
		new CopyPlugin({
			patterns: [
				{from: 'manifest.json'},
				{from: 'src/clean.js', flatten: true},
				{from: 'src/img/*.png', to: 'img', flatten: true}
			]
		})
	]
};
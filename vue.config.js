const LodashModuleReplacementPlugin = require("lodash-webpack-plugin")
const webpack = require('webpack')
module.exports = {
	publicPath: './',
	productionSourceMap: false,
	pages: {
		index: {
			entry: 'examples/main.js',
			template: 'public/index.html',
			filename: 'index.html'
		}
	},
	configureWebpack:{
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
    devtool: 'source-map'
  },
  chainWebpack(config) {
    if(process.env.analyzer) config.plugin('webpack-report').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    
    config.plugin("loadshReplace").use(new LodashModuleReplacementPlugin())
  }

}
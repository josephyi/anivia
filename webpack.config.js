var path = require('path')
var webpack = require('webpack')
var publicPath = 'http://0.0.0.0:4001/'

var env = process.env.MIX_ENV || 'dev'
var prod = env === 'prod'

var entry = './web/static/js/index.js'
var hot = 'webpack-hot-middleware/client?path=' +
    publicPath + '__webpack_hmr'

var ExtractTextPlugin = require('extract-text-webpack-plugin')

var plugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
]

if (env === 'dev') {
    plugins.push(new webpack.HotModuleReplacementPlugin())
    new webpack.DefinePlugin({
        __DEV: env === 'dev'
    })
}

if (prod) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.DefinePlugin({
            __PROD: prod,
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin('styles.css', {
            publicPath: path.resolve(__dirname) + '/priv/static/css',
            allChunks: true})
    )
}

module.exports = {
    devtool: prod ? null : 'cheap-module-eval-source-map',
    entry: prod ? entry : ['react-hot-loader/patch', hot, entry],
    output: {
        path: path.resolve(__dirname) + '/priv/static/js',
        filename: 'index.bundle.js',
        publicPath: publicPath
    },
    plugins: plugins,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            {
                test: /\.json?$/,
                loaders: ['json'],
                exclude: path.resolve(__dirname, 'node_modules')
            },
            { 
                test: /\.css$/,
                loader: prod ? ExtractTextPlugin.extract('style', 'css?modules') : 'style!css?modules'
            }
        ]
    }
}

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        path.resolve(__dirname, 'app/src/client')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/dist/',
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __PRODUCTION__: true, __DEV__: false}),
        new webpack.DefinePlugin({
          "process.env": {
            "NODE_ENV": JSON.stringify(process.env.NODE_ENV) || JSON.stringify('production'),
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {

        loaders: [{
            test: [/node_modules\/(?:boom|hawk|hoek|cryptiles|sntp)\/lib\/(?:.+).js/],
            loaders: ['babel-loader']
        },
        {
            test: /\.(js|jsx)?$/,
            exclude: /node_modules/,
            loaders: ['react-hot']
        }, {
            test: /\.(js|jsx)?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react', 'stage-2'],
                plugins: ['transform-decorators-legacy' ],
                compact: false
            }
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }, {
            test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
            loader: 'url?prefix=font/&limit=10000'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    }
};

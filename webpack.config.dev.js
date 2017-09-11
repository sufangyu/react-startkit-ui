'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 端口
const port = '8080';

// 判断当前运行环境是开发模式还是生产模式
console.log("process.env.NODE_ENV =>>>> ", process.env.NODE_ENV);
const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = nodeEnv === 'production';
console.log("当前运行环境：", isPro ? 'production' : 'development');

const plugins = [
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("development")
        },
        DEVELOPMENT: JSON.stringify(true),
    }),
    new HtmlWebpackPlugin({
        title: 'React Startkit UI',
        template: './src/index.html',
        shim: {
            fastclick: {
                src: './src/libs/fastclick.js',
            },
        }
    }),
    new ExtractTextPlugin({
        filename: 'css/[name].css',
        allChunks: true,
    }),
    new OpenBrowserPlugin({
        url: 'http://localhost:' + port,
    }),
    new webpack.HotModuleReplacementPlugin(),
];

module.exports = {
    // entry: './src/index.jsx',
    entry: {
        main: './src/index.jsx',
        vendor: ['react', 'react-dom', 'react-router', 'babel-polyfill'],
    },
    // 打包
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
        publicPath: '/',
    },
    // 解析
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.(scss|sass)$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                })),
            },
            {
                test: /\.css$/,
                use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'postcss-loader'],
                })),
            },
            {
                test: /\.(woff|woff2|eot|ttf)(\?.*$|$)/,
                use: ['url-loader'],
            },
            {
                test: /\.(gif|png|jpe?g)$/i,
                use: [
                    'url-loader?limit=1000&name=assets/images/[name].[ext]',
                    'image-webpack-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                include:  [
                    path.resolve(__dirname, 'src/assets/svg'),
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    // 插件
    plugins: plugins,
    // 启动dev source map，出错以后就会采用source-map的形式直接显示你出错代码的位置。
    devtool: 'eval-source-map',
    // enable dev server
    devServer: {
        port: port,
        host: '0.0.0.0',
        disableHostCheck: true,  // 解决配置 host: '0.0.0.0' 时, 出现 invalid host header
        historyApiFallback: true,
        hot: true,
        inline: true,
        // 代理请求
        proxy: {
        }
    },
};
const path = require('path')

const htmlWebpackPlugin = require('html-webpack-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpack = require('webpack')

// css代码
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devServer: {
        contentBase: './public',
        open: true,
        port: 3005,
        hot: true,
        proxy: {
            '/react/api': {
                // http://www.dell-lee.com/react/api/header.json
                target: 'http://www.dell-lee.com',
                "changeOrigin": true
            }
        }
    },
    module: {
        rules: [
            // js
            {
                // 配置js和jsx文件可以编译执行
                test: /\.(js|jsx)$/,
                // test: /\.js$/,
                // exclude忽略第三块模块node_modules，让打包更快
                exclude: /node_modules/,
                // 引用.babelrc配置文件
                loader: 'babel-loader'
            },
            // less
            {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.less$/,
                // 执行顺序：从下到上，从右到左
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
                
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     'style-loader',
                //     'css-loader',
                //     'less-loader',
                //     'postcss-loader'
                // ]
            },
            // file
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // placeholder 占位符
                        name: '[name].[ext]',
                        // 图片保存路径
                        outputPath: 'images/',
                        // 设置大小
                        limit: 2048
                    }
                }
            },
            // font
            {
                test: /\.(eot|ttf|svg|woff)$/,
                use: {
                    loader: 'file-loader'
                }
            },
            // css
            {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.css$/,
                // 执行顺序：从下到上，从右到左
                // use: [
                //     MiniCssExtractPlugin.loader,
                //     'style-loader',
                //     'css-loader',
                //     'postcss-loader'
                // ]
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    optimization: {
        usedExports: true,
    },
    plugins: [
        new htmlWebpackPlugin({ template: 'public/index.html' }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[name].[hash].css',
        }),
        new OptimizeCSSAssetsPlugin({})
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, './dist')
    }
}
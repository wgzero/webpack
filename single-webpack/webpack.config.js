const path = require('path')

//  打包生成html页面
const htmlWebpackPlugin = require('html-webpack-plugin')
// 清除打包生成的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// webpack热模块更新要和webpack-dev-server配合使用
const webpack = require('webpack')

module.exports = {
    // 模式
    // mode: 'development',
    mode: 'production',

    devServer: {
        contentBase: './public',
        open: true,
        port: 8081,
        hot: true
    },

    // 入口
    entry: './src/index.js',

    // module

    // 插件是一个数组形式
    plugins: [
        new htmlWebpackPlugin({template: 'public/index.html'}),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    // 出口
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    }
}
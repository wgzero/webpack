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
    module: {
        rules: [
            // 图片
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // 文件输出名字
                            name: '[name].[ext]',
                            // 文件输出路径
                            outputPath: 'images/',
                            // 文件输入大小
                            limit: 20480
                        }
                    }
                ]
            },
            {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.less$/,
                // 执行顺序：从下到上，从右到左
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            },
            {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.scss$/,
                // 执行顺序：从下到上，从右到左
                use: [
                    'style-loader',
                    {
                        // 这里表示从下往上执行过程中，无论sass加载多少个内嵌scss文件，都要执行下面两个
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            // 开启css模块化
                            modules: true
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            }, {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.css$/,
                // 执行顺序：从下到上，从右到左
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },

        ]
    },

    // 插件是一个数组形式
    plugins: [
        new htmlWebpackPlugin({ template: 'public/index.html' }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    // 出口
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    }
}
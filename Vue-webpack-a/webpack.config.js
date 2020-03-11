const path = require('path')

//打包生成html页面
const htmlWebpackPlugin = require('html-webpack-plugin')

// 清除dist目录下的文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// webpack开启热更新

const webpack = require('webpack')

// Vue
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// css代码拆分
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// css代码压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    // 模式
    mode: 'development',
    // 热更新
    devServer: {
        contentBase: './public',
        open: true,
        port: 8080,
        hot: true,
        proxy: {
            // '/vue/api': 'http://summer.wgzero.com'
            '/vue/api': {
                target: 'http://www.dell-lee.com'
            }
        }
    },
    // 入口 demo/src/main.js
    entry: './src/main.js',
    module: {
        rules: [
            // js
            {
                test: /\.js$/,
                // 好处：babel在做语法解析的时候，会忽略掉node_modules下的第三方模块，让我们打包的速度更快
                exclude: /node_modules/,
                // 这里用了babel-loader，在主目录下配置了.babelrc的文件
                loader: "babel-loader",
            },
            // Vue模块
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
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
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }, {
                        loader: "postcss-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                // 引入css模块打包编译：  style-loader 和 css-loader
                test: /\.css$/,
                // 执行顺序：从下到上，从右到左
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },

        ]
    },
    plugins: [
        new htmlWebpackPlugin({ template: './public/index.html' }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'css/[name].[hash].css'
        }),
        new CleanWebpackPlugin(),
        new VueLoaderPlugin()
    ],
    // webpack自带代码拆分功能
    optimization: {
        // // 开启tree shaking
        usedExports: true,
        // 压缩css样式，提高webpack打包速度
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        // 新webpack4和旧webpack4的文件单独联系
    },
    // 出口
    output: {
        filename: 'js/[name].[hash].js',
        // chunkFilename,会在打包后生成一个chunk.js的文件
        chunkFilename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, './dist')
    }
}
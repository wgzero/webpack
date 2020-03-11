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
        hot: true
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
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: [
                //         'style-loader',
                //         'css-loader',
                //         'postcss-loader'
                //     ]
                // }),
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
        // usedExports: true,
        // 压缩css样式，提高webpack打包速度
        minimizer: [new OptimizeCSSAssetsPlugin({})],
        // 新webpack4和旧webpack4的文件单独联系
        runtimeChunk: {
            name: 'runtime'
        },
        usedExports: true,
        // 代码分割
        // splitChunks: {
        //     chunks: 'all',
        //     // 通过这个设置将vendors~lodash.js文件设置成了lodash.js文件
        //     cacheGroups: {
        //         vendors: false,
        //         default: false
        //     }
        // }
        // 默认是async异步拆分
        splitChunks: {
            // all表示同步异步都可以, async表示异步
            chunks: "all",
            // 大于30kb才进行代码分割
            // 这里表示要大于多少才进行分割
            /*
            同步异步都和cacheGroups有所联系的
            */
            minSize: 30000,
            // // 对代码进一次拆分，分解多个模块，一般不用管的
            // maxSize: 0,
            minChunks: 1,
            // 最多加载异步5个数
            maxAsyncRequests: 5,
            // 入口处，执行多个js库，超过三个就不进行代码分割了
            maxInitialRequests: 3,
            // 文件生成中的连接符
            automaticNameDelimiter: '~',
            // 让名字生效
            name: true,
            // 缓存组
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    // 会打包到优先级高的里面  vendors>default,所以打包到vendors这里面
                    priority: -10,
                    name: 'zero'
                },
                default: {
                    priority: -20,
                    // 已经打包过的模块，再次打包就直接忽略掉，直接使用之前打包过的模块
                    reuseExistingChunk: true,
                    // lodash文件打包保存的名字叫什么：common.js
                    filename: 'common.js'
                }
            }
        }
    },
    // 出口
    output: {
        filename: 'js/[name].[hash].js',
        // chunkFilename,会在打包后生成一个chunk.js的文件
        chunkFilename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, './dist')
    }
}
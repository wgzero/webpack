# WebPack配置记录

## 1.sourcemap

```js
// 配置SourceMap  mode默认开启了sourceMap,是在development下
// devtool: 'none',
devtool: 'cheap-module-eval-source-map',
```

## 2.HMR热模块更新

```js
const webpack = require('webpack');
plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
```

## 3.babel： ES6,7语法翻译成ES5语法

```js
npm i @babel/polyfill @babel/runtime @babel/runtime-corejs2 -S
npm i @babel/core @babel/plugin-transformruntime @babel/preset-env babel-loader -D
```

```js
// 配置新建一个 .babelrc文件
{
    "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 2,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
          }
        ]
      ]
}
```



## 4.treeshaking就是设置detool

```js
/* 
     (1).cheap:  
        A.只对行产生信息，对列不产生信息
        B.不包含loader里面的source-map，对业务代码source-map的生成
     (2).module：对loader的代码也生成source-map
     (3).eval：是一种执行方式
     (4).source-map：帮我去生成一个.map的文件    
    */
    //    devtool: 'cheap-module-eval-source-map',
    devtool: 'cheap-module-source-map',
```



## 5.开发环境(development)和生成环境(production)

```js
//文件合并
npm i webpack-merge -D
```



```js
// common.js文件
const path = require('path');

//  plugin先定义  自动构建html
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
// clean-webpack-plugin是先删除目录下所有文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 1.在开发环境下打包，不被压缩
    mode: 'development',
    // mode: 'production',
 // 2.配置文件入口
    entry: {
        // 入口文件的路径
        main: './src/index.js',
    },

    // 4.当我们遇到一种文件类型的时候，遇到文件模块或打包
    module: {
        // A.规则
        rules: [
            { 
                test: /\.js$/, 
            // 好处：babel在做语法解析的时候，会忽略掉node_modules下的第三方模块，让我们打包的速度更快
            exclude: /node_modules/, 
            // 这里用了babel-loader，在主目录下配置了.babelrc的文件
            loader: "babel-loader", 
        },
        {
        // 6.2资源处理格式
        test: /\.(png|jpg|gif)$/,
        // 6.3使用什么url-loader
        use: {
            loader:'url-loader',
            // 6.4 额外配置
            options: {
                // 6.5  将打包之前的名字和打包之后的名字一样
                // placeholder  占位符
                name: '[name].[ext]',
                // 6.6将图片打包到固定路径
                outputPath: 'images/',
                // 6.7设置图片的大小： 超过了设置的limit的大小时，产生文件，小于时，就会以base64字符串的形式保存到js文件里面去  209525
                // 超过这个限制，就会在dist目录下生成该文件
                // 好处是：减少小图片对http请求数减少，从而提升网页加载速度
                limit: 2048
            }
        }
    },  {
        // 配置font字体文件
        test: /\.(eot|ttf|svg|woff)$/,
        use: {
            loader: 'file-loader'
        }
    }, {
        // 引入css模块打包编译：  style-loader 和 css-loader
        test: /\.scss$/,
        // 执行顺序：从下到上，从右到左
        use: [
            'style-loader', 
            {
                // 这里表示从下往上执行过程中，无论sass加载多少个内嵌scss文件，都要执行下面两个
                loader:'css-loader',
                options: {
                    importLoaders: 2,
                    // 开启css模块化
                    modules: true
                }
            },
            'sass-loader',
            'postcss-loader'
        ]
    },{
        // 引入css模块打包编译：  style-loader 和 css-loader
        test: /\.css$/,
        // 执行顺序：从下到上，从右到左
        use: [
            'style-loader',
            'css-loader', 
            'postcss-loader'
        ]
    }]
    },
    // 配置插件
    // 实例化html-webpack-plugin
            // 自动在src目录下生成一个index.html文件
    plugins: [new HtmlWebpackPlugin(
        {
        // 加载哪一个模板作为所使用的模板
        template: 'src/index.html'
        }
    ), 
        // 自动把dist目录下的文件清空
        new CleanWebpackPlugin(),
    ],

    // 3.配置文件出口
    output : {
        filename: '[name].js',
        // 5.生成的目录
        path: path.resolve(__dirname, 'dist')
    }
}
```

```js
// dev.js文件

const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const webpack = require('webpack');


// common.js的模块写法
const devConfig = {
    // 1.在开发环境下打包，不被压缩
    mode: 'development',
    // mode: 'production',
       devtool: 'cheap-module-eval-source-map',
    // devtool: 'cheap-module-source-map',

    // 3.监听文件发生的改变:  devServer：就是帮我们配置webpack-dev-server，可以调试我们的源代码
    devServer: {
        // 在那个目录下去启动这个服务器
        contentBase: './dist',
        // 每次服务器重启的时候，自动打开浏览器
        open: true,
        port: 8181,
        // 是否支持热更新：热模块替换
        hot: true,
        // 即使不支持html，或者html有问题也不帮你重新刷新浏览器
        // hotOnly: true
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    // 设置tree shaking： 在开发环境下，默认是不开启的，需要自己手动添加
    optimization: {
        usedExports: true
    },

}
// 分文件和本文件合并
module.exports = merge(commonConfig, devConfig);
```

```js
// prod.js文件
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

const proConfig = {
    // 1.在开发环境下打包，不被压缩
    // mode: 'development',
    mode: 'production',

    devtool: 'cheap-module-source-map',
}

module.exports = merge(commonConfig, proConfig);
```



## 6.code split(代码拆分)

```js
// webpack自带代码拆分功能
    optimization: {
        // 代码分割
        // splitChunks: {
        //     chunks: 'all',
        //     // 通过这个设置将vendors~lodash.js文件设置成了lodash.js文件
        //     cacheGroups: {
        //         vendors: false,
        //         default: false
        //     }
        // }
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
            // 表示导入 import _ from 'lodash' 一次，就可以执行代码拆分
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
                    filename: 'zero.js'
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
```



## 7.懒加载

```js
async function getComponent(){
    // webpack懒加载
    const { default: _ } =await import(/* webpackChunkName:"lodash" */'lodash');
    const div = document.createElement('div');
    div.innerHTML =_.join(['hello', 'zero'], '---');
    return div; 
}

document.addEventListener('click', () => {
    getComponent().then(div=>{
        document.body.appendChild(div);
    });    
});
```

## 8.css代码拆分

```js
npm i mini-css-extract-plugin optimize-css-assets-webpack-plugin -D
```

```js
// prod.js文件

const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

//css代码分割  分割要注意package，json文件中的"sideEffects": ["*.css"]要配置*.css格式
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css代码压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const proConfig = {
    // 1.在开发环境下打包，不被压缩
    // mode: 'development',
    mode: 'production',

    devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            // 引入css模块打包编译：  style-loader 和 css-loader
            test: /\.scss$/,
            // 执行顺序：从下到上，从右到左
            use: [
                MiniCssExtractPlugin.loader,
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
        },{
            // 引入css模块打包编译：  style-loader 和 css-loader
            test: /\.css$/,
            // 执行顺序：从下到上，从右到左
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 
                'postcss-loader'
            ]
        }]
    }, 
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 直接引用的话，就走filename这个文件，如果间接引用的话，就走chunkFilename这个文件
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        })
    ],
}

module.exports = merge(commonConfig, proConfig);
```



## 9.缓存cacheing

```js

const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

//css代码分割  分割要注意package，json文件中的"sideEffects": ["*.css"]要配置*.css格式
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css代码压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const proConfig = {
    // 1.在开发环境下打包，不被压缩
    // mode: 'development',
    mode: 'production',

    // devtool: 'cheap-module-source-map',
    module: {
        rules: [{
            // 引入css模块打包编译：  style-loader 和 css-loader
            test: /\.scss$/,
            // 执行顺序：从下到上，从右到左
            use: [
                MiniCssExtractPlugin.loader,
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
        },{
            // 引入css模块打包编译：  style-loader 和 css-loader
            test: /\.css$/,
            // 执行顺序：从下到上，从右到左
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader', 
                'postcss-loader'
            ]
        }]
    }, 
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 直接引用的话，就走filename这个文件，如果间接引用的话，就走chunkFilename这个文件
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        })
    ],
    output : {
        // 代码输出缓存
        filename: '[name].[contenthash].js',
        // chunkFilename,会在打包后生成一个chunk.js的文件
        chunkFilename: '[name].[contenthash].js',
    }
}

module.exports = merge(commonConfig, proConfig);
```



## 10.细粒度 shimming

```js

```

## 11.environment环境动态设置

```js
// webpack.common.js
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');

// 导入模块  传入参数env
module.exports = (env)=>{
    // 如果是线上环境
    if(env&&env.production){
        // 就合并commonConfig和prodConfig文件
        return merge(commonConfig, prodConfig);
    }else{
        // 不是，则合并commonConfig和devConfig文件
        return merge(commonConfig, devConfig);
    }
}
```



## 12.proxy代理设置

```js
devServer: {
        // 在那个目录下去启动这个服务器
        contentBase: './dist',
        // 每次服务器重启的时候，自动打开浏览器
        open: true,
        port: 8080,
        // 是否支持热更新：热模块替换
        hot: true,
        // 即使不支持html，或者html有问题也不帮你重新刷新浏览器
        hotOnly: true,
        // 这里可以联调，生产环境和线上环境
        // proxy指的是devServer开发环境下，线上环境下没有使用devServer
        // proxy: {
        //     // 网络代理
        //     '/react/api': 'http://summer.wgzero.com'
        // }

        // 这里只是方便生产环境下方便 
        proxy: {
            '/react/api': {
                // http://summer.wgzero.com
                target: 'http://summer.wgzero.com',
                // 这里写的目的是为了，不修改主路径，当后端真实地址是header.json，后端还没有做处理，
                // 后端给了一个假数据接口demo.json，这时把路径重写一下，当后端写好了时，把这段代码注释或删除即可
                // pathRewrite: {
                //     'header.json': 'demo.json'
                // }
            }
        }
    },
```



```jsx
import React, { Component } from 'react';
import ReactDom from 'react-dom';

// 导入axios请求
import axios from 'axios'; 

class App extends Component {
    // react的生命周期钩子
    componentDidMount(){
        // 线上环境下，就是这样的路径
        axios.get('/react/api/header.json').then((res)=>{
            console.log(res);
        });
    }
    render() {
        return (<div>hello zero</div>)
    }
}

ReactDom.render(<App />, document.getElementById('root'));
```

## 13.eslint配置

```
npm i eslint eslint-config-airbnb eslint-loader eslint-plugin-import -D
npm i eslint-plugin-jsx-ally eslint-plugin-webpack -D
```

```js
// 添加一个eslint效验文件
// .eslintrc.js文件
module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "rules": {
        "react/prefer-stateless-function": 0,
        "react/jsx-filename-extension": 0
    },
    globals:{
        document: false
    }
};
```

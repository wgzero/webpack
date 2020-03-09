# webpack
webpack学习记录

## I.基础知识点

#### 1.

#### 2.

#### 3.

#### 4.

#### 5.

#### 6.

#### 7.

## II.高级知识点

## III.webpack安装步骤：

#### 1.简单的webpack安装步骤：

A.先创建一个空文件夹demo，npm init -y 初始化node文件，空项目

B.npm i webpack webpack-cli -D  安装webpack模块和webpack-cli脚手架

C.建立src创建index.js文件，并写入伪代码

```j
const num = 25
console.log(num)
```

D.在demo目录下创建webpack.config.js文件

```js
// 简单的文件配置
const path = require('path')

module.exports = {
    // 文件入口
    entry: './src/index.js',
    // 文件出口
    output: {
        filename: '[name].js',
        // 生成dist目录
        path: path.resolve(__dirname, 'dist')
    }
}
```

E.运行项目： npx webpack,或者配置一下package.json文件,添加"dev": "npx webpack"

```js
"scripts": {
    "dev": "npx webpack",
  },
```

F.css模块配置: npm i css-loader style-loader -D

```js
 module: {
        rules: [
            // css模块 npm i css-loader style-loader -D
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          }
        ]

    },
```

G.less模块配置: npm i less less-loader -D

```js
 module: {
        rules: [
            // css模块
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          // less 模块 npm i less less-loader -D
          {
              test: /\.less$/,
              use: ['style-loader', 'css-loader', 'less-loader']
          }
        ]

    },
```

H.文件配置 npm i file-loader url-loader -D

```js
module: {
        rules: [
            // css模块
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          // less 模块
          {
              test: /\.less$/,
              use: ['style-loader', 'css-loader', 'less-loader']
          },
          // 文件配置file  npm i file-loader url-loader -D
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                    // 文件输出名字
                    name: '[name].[ext]',
                    // 文件输出路径
                    output: 'images/',
                    // 文件输入大小
                    limit: 20480
                }
              }
            ]
          }
        ]

    },
```

I.生成html页面： npm i html-webpack-plugin -D

```js
const HWP = require('html-webpack-plugin')
plugins: [
        new HWP({template: 'src/index.html'})
    ],
```

J.清除页面： npm i clean-webpack-plugin -D

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
plugins: [
        new HWP({template: 'src/index.html'}),
        new CleanWebpackPlugin()
    ],
```

K.热模块自动更新：需要和服务器一起用

```js
const webpack = require('webpack')
plugins: [
        new HWP({template: 'src/index.html'}),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
```

L.开启服务器 ： npm i webpack-dev-server -D

```js
devServer:{
    contentBase:'./public',
    open:true,
    port:8080,
    hot:true
}
```

配置运行脚本：package.json

```
"scripts": {
    "dev": "npx webpack",
    "serve": "webpack-dev-server"
  },
```

#### 2.React脚手架搭建

A.安装React需要运行的环境

```js
// react的项目依赖react和react-dom模块
npm i react react-dom -S
// react的项目中会编写jsx语法，这些语法是通过babel模块解析的，所以我们需要安装babel模块，
// 同时还需要安装babel的loader
npm i babel-loader @babel/core -D
// 需要安装babel针对react的预设
npm install --save-dev @babel/preset-react
```

B.文件配置webpack.config.js

```js
{ 
    test: /\.js$/, 
    // exclude是排除node_modules中的模块代码的解析，因为node_modules中的代码已经做了解析
    exclude: /node_modules/, 
    loader: "babel-loader",
    options:{
        "presets": ["@babel/preset-react"]
    }
}
```

C.添加一个.babelrc文件

```js
{
    "presets": ["@babel/preset-react"]
}
```

D.react组件类里面写箭头函数，通过箭头函数来帮我们绑定this，默认类里面定义方法是不能用箭头函数的，如果需要支持这种写法，需要安装对应的解析模块

```js
npm i @babel/plugin-proposal-class-properties -D
```

E. .babelrc文件中添加这个解析模块的预设

```js
{
    "presets": ["@babel/preset-react"],
    "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

#### 3.Vue脚手架搭建

A.安装vue，vuex,vue-router,core-js

```js
npm i vue vuex vue-router core-js -S
```

B.安装Vue环境下balel语法翻译和服务

```js
npm i @vue/cli-plugin-babel @vue/cli-service -D
```

C.安装Vue模板编译

```js
npm i vue-template-compiler vue-loader -D
```

D.vue-loader安装好了之后，需要配置一下webpack，也就是webpack.config.js文件

```js
// Vue模块
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module: {
    rules: [
          // Vue模块
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
    ]
}
```

E.运行项目即可

G.配置npm run start和npm run build

```js
"scripts": {
    "start": "webpack-dev-server",
    "build": "npx webpack"
  },
```

 
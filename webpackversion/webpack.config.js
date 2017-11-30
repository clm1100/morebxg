const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        main:'./app.js',
        tabmain:'./tabmain.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            // {
            //     test: /\.css/,
            //     loader: 'style-loader!css-loader'
            // },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: "css-loader"
                })
            },
            // { test: /\.ejs$/, loader: 'ejs-loader?variable=data' },,
            { //解析 .html
              test: /\.html$/,
              loader: 'html-loader'
            },
            {
              test: /\.(png|jpg|gif)$/,
              use: [
                      {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name][hash].[ext]',
                            outputPath: '/images/',
                            limit:8192
                            // publicPath: 'assets/'   //虚拟路径
                        }  
                      }
                    ]
            }
        ]
    },
    plugins: [
        // new UglifyJSPlugin()
        new HtmlWebpackPlugin({
             template:'index.ejs',
             chunks:['main'],
             filename:'./index.html'
        }),
        new HtmlWebpackPlugin({
            template:'test.html',
            chunks:['tabmain'],
            filename:'./test.html'
       }),
        new HtmlWebpackPlugin({
             template:'./tab/tab.html',
             chunks:['tabmain'],
             filename:'./tab/tab.html'
        }),
         new ExtractTextPlugin("[name][hash:8].css"),
    ],
    devServer: {
        // hot:true,
        contentBase:'/dist',
        // publicPath: '/',
        port: 3000,
        proxy: {
          '/a': {
            target: 'http://api.botue.com', 
            changeOrigin: true,
            pathRewrite: {
              '^/a' : '',     // rewrite path 
                  },
          }
        }
    } 
}

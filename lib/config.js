/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   config
 */

'use strict';

const project = foxtrel.project;

const util = require('./util');

const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");


const CleanWebpackPlugin = require('clean-webpack-plugin');

const ph = require('path');

//context
const context = project.getProjectRoot('src');

const publicPath = '/assets/';

const LocalNodeMoudles = ph.join(__dirname, "../");

let entryFile, envConfig;


/**
 * @description        默认配置
 * @type {{context: string, output: {path: *, publicPath: string}, externals: {jquery: string}, module: {rules: *[]}, resolve: {modules: string[], extensions: string[], mainFiles: string[]}}}
 */

let defalutConfig = {
    context: context,
    output: {
        path: foxtrel.cache.getCachePath(),
        publicPath: publicPath
    },
    externals: {
        jquery: 'jQuery'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                options: {
                    configFile: project.getProjectRoot('.eslintrc')
                },
                include: [context],
                enforce: 'pre'
            },
            {
                test: /\.less/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?importLoaders=1&modules&localIdentName=[name]__[local]___[chunkhash:base64:5]!postcss-loader!less-loader'
                })
            },
            {
                test: /\.(png|jpg|gif|woff|woff2)$/,
                use: 'url-loader?limit=8192'
            },
            {
                test: /\.(mp4|ogg|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    resolve: {
        modules: [context, "node_modules"],
        extensions: ['.js', '.jsx', '.json'],
        //为更好使用webpack tree shaking功能,先读取package中module字段
        mainFiles: ['module', 'main', 'index']
    },

    // 优先加载全局foxtrel包下的 loader
    resolveLoader: {
        modules: [
            LocalNodeMoudles,
            ph.join(context, "../node_modules")
        ]
    }
}


module.exports = function (options) {
    //entry
    entryFile = util.getEntryFile('**/app.js', {cwd: context});

    //环境判断
    if (options.env == 'dist') {
        envConfig = distConfig(options);
    } else {
        envConfig = devConfig(options);
    }

    envConfig.plugins.push(
        ...util.HtmlWebpackPlugin("**/**.html", {cwd: context}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
                //提取所有node_modules中模块到vendor
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        //为了避免vendor中hash改变
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    );

    return Object.assign({}, defalutConfig, envConfig, {
        entry: entryFile
    })
};


/**
 * @description          开发环境配置
 * @param options        cli的入参
 * @returns {{cache: boolean, devtool: string, plugins: *[]}}        出参配置
 */

function devConfig(options) {
    let base = {
        cache: true,
        devtool: 'eval-source-map',
        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.ProvidePlugin({$: 'jquery'}),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ]
    };

    //HMR
    for (let key in entryFile) {
        entryFile[key] = [].concat([
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            entryFile[key]
        ]);
    }

    defalutConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        use: {
            loader: 'babel-loader'
        },
    });

    defalutConfig.output.filename = '[name].js';

    return base;
}


/**
 * @description          生产环境配置
 * @param options        cli的入参
 * @returns {{cache: boolean, devtool: string, plugins: *[]}}        出参配置
 */

function distConfig(options) {
    let base = {
        cache: true,
        devtool: 'sourcemap',
        plugins: [
            new ExtractTextPlugin("[name].[chunkhash].css"),
            new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
            new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}}),
            //入口文件不在引入jquery,可以直接使用jquery
            new webpack.ProvidePlugin({$: 'jquery'})
        ]
    }

    //cleanwebpackplugin
    let arrfiles = [];
    for (let key in entryFile) {
        arrfiles.push(foxtrel.cache.getCachePath() + "/" + key + ".**" + ".**");
    }
    base.plugins.push(
        new CleanWebpackPlugin(arrfiles, {
                root: project.getProjectRoot(),    //根目录
                verbose: true,        　　　　　　　 //开启在控制台输出信息
                dry: false        　　　　　　　　　　//启用删除文件
            }
        )
    );

    defalutConfig.module.rules.push({
        test: /\.(js|jsx)$/,
        use: {
            loader: 'babel-loader',
            options: {
                "presets": [
                    [
                        ph.join(LocalNodeMoudles, "babel-preset-es2015"),
                        {"modules": false}
                    ],
                    ph.join(LocalNodeMoudles, "babel-preset-stage-0"),
                    ph.join(LocalNodeMoudles, "babel-preset-react")],
                "plugins": [
                    ["import", {libraryName: "antd-mobile", style: "css"}] // `style: true` 会加载 less 文件
                ],
                "babelrc": false,
            }
        },
    });
    defalutConfig.output.filename = '[name].[chunkhash].js';

    return base;
}

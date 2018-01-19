/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   config
 */

'use strict';

const project = foxtrel.project;

const util = require('./util');

const webpack = require('webpack');

//context
const context = project.getProjectRoot('src');

const merge = require('webpack-merge');


module.exports = function (options) {

    const config = options.env == 'dist' ?
        require('./webpack.prod.js') :
        require('./webpack.dev.js');

    //entry
    const entryFile = util.getEntryFile('**/app.js', {cwd: context});

    return merge(config, {
        entry: entryFile,
        plugins: [
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
        ]
    })
};

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

    //entry Object
    const entryFile = util.getEntryFile('**/app.js', {cwd: context});


    return merge(config, {
        entry: entryFile,
        plugins: [
            ...util.HtmlWebpackPlugin("**/**.html", {cwd: context}),
            new webpack.DllReferencePlugin({
                context:'.',
                manifest: `${foxtrel.cache.getCachePath()}/common/manifest${foxtrel.config.get('vendorVersion')}.json`,
            })
        ]
    })
};

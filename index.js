/**
 * @authors       qzhongyou
 * @date          2017-1-18
 * @description   create processor
 */

'use strict';

const webpack = require('webpack');

let config = require('./lib/config');

const dllConfig = require('./lib/webpack.config.dll');

const async = require('async');

const ph = require('path');

/**
 * @description 正常配置编译,返回编译对象
 * @param options
 * @param compilerConfigFun
 */
function processor(options, compilerConfigFun) {

    //处理器配置信息
    let webpackConfig = config(options);

    compilerConfigFun(webpackConfig);

    //返回 compilers
    return webpack(foxtrel.config.get('webpack'));
}


function hasNewstVendor() {
    let path = dllConfig.output.path,
        filename = dllConfig.output.filename.replace(/\[name\]/, 'vendor'),
        filePath = ph.join(path, filename);
    //是否存在
    if (foxtrel.util.exists(filePath)) {
        let pathInfo = foxtrel.util.pathInfo(filePath);
        let version = pathInfo.filename.match(/@\d+\.?\d+$/)[0];
        //是否为最新
        if (version == foxtrel.config.get('vendorVersion')) {
            return false;
        }
    }
    return true;
}

module.exports = function (callback) {
    let handler = [];
    //第三方模块编译
    if (hasNewstVendor()) {
        handler.push(function (cb) {
            webpack(dllConfig).run(function (error, stats) {
                if (error || stats.hasErrors()) {
                    foxtrel.log.error('compilation fails');
                }
                cb();
            })
        })
    }

    async.waterfall(handler, function () {
        callback(processor);
    })
}




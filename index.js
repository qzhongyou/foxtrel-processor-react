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

function processor(options, compilerConfigFun) {

    //处理器配置信息
    let webpackConfig = config(options);

    compilerConfigFun(webpackConfig);

    //返回 compilers
    return webpack(foxtrel.config.get('webpack'));
}


module.exports = function (callback) {
    let handler = [];
    //第三方模块编译
    if (foxtrel.config.get('resetCommon')) {
        handler.push(function (cb) {
            webpack(dllConfig).run(function (error, stats) {
                if (error || stats.hasErrors()) {
                    foxtrel.log.error('compilation fails');
                }
                cb();
            })
        })
    }

    async.waterfall(handler,function(){
        callback(processor);
    })
}



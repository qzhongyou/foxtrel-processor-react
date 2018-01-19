/**
 * @authors       qzhongyou
 * @date          2017-1-18
 * @description   create processor
 */

'use strict';

const webpack = require('webpack');

let config = require('./lib/config');

function processor(options, compilerConfigFun) {
    //处理器配置信息
    let webpackConfig = config(options);

    compilerConfigFun(webpackConfig);

    //返回 compilers
    return webpack(foxtrel.config.get('webpack'));
}

module.exports = processor;


/**
 * @authors       qzhongyou
 * @date          2017-11-06
 * @description   release
 */

'use strict';

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @description 入口文件读取
 * @param path
 * @param options
 * @returns {{}}
 */
module.exports.getEntryFile = function (path, options) {
    let files = glob.sync(path, options),
        entries = {};
    files.forEach(function (file) {
        let ext = foxtrel.util.pathInfo(file).ext,
            pathName = file.replace("." + ext, ''),
            filePath = "";
        if (options.cwd) {
            filePath = file;
        }
        entries[pathName] = filePath;
    })
    return entries;
}


module.exports.HtmlWebpackPlugin = function (ph, options) {
    if (!options.cwd) return;
    let hwplugins = [], files = glob.sync(ph, options);
    files.forEach(function (file) {
        hwplugins.push(
            new HtmlWebpackPlugin({
                filename: path.join(foxtrel.cache.getCachePath(), file),
                template: path.join(options.cwd, file),
                chunks: ["vendor"]
            })
        )
    });

    return hwplugins;
}

const path = require('path')
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = foxtrel.config;


config.get('vendorVersion') || config.set('vendorVersion', '@1.0');
config.get('vendor') || config.set('vendor', []);

const dllConf = {
    version: config.get('vendorVersion'),
    vendor: config.get('vendor')
}

module.exports = {
    entry: {
        vendor: dllConf.vendor,
    },
    output: {
        filename: `common/[name]${dllConf.version}.js`,
        path: foxtrel.cache.getCachePath(),
        library: `[name]${dllConf.version}`,
    },
    plugins: [
        new webpack.DllPlugin({
            context: '.',
            path: `${foxtrel.cache.getCachePath()}/common/manifest${dllConf.version}.json`,
            name: `[name]${dllConf.version}`,
        }),
        new CleanWebpackPlugin([path.join(foxtrel.cache.getCachePath(), 'common')], {
                root: foxtrel.project.getProjectRoot(),    //根目录
                verbose: true,        　　　　　　　         //开启在控制台输出信息
                dry: false,        　　　　　　　　　　        //启用删除文件
            }
        )
    ],
}

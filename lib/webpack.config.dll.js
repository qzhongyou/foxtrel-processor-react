const path = require('path')
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ['react'],
    },
    output: {
        filename: 'common/[name].js',
        path: foxtrel.cache.getCachePath(),
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            context:'.',
            path: `${foxtrel.cache.getCachePath()}/common/manifest.json`,
            name: '[name]',
        }),
    ],
}

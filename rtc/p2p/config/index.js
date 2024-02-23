// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        host: "0.0.0.0",
        env: require('./dev.env'),
        port: 8086,
        autoOpenBrowser: false,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api': {
                target: 'http://192.168.20.31:18080',     //服务器的接口地址
                secure: false,                           //如果是https，需要开启这个选项
                changeOrigin: true,                    //是否跨域请求？ture
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/debug/api': {
                target: 'http://192.168.20.31:18080',     //服务器的接口地址
                secure: true,                           //如果是https，需要开启这个选项
                changeOrigin: true,                    //是否跨域请求？ture
                pathRewrite: {
                    '^/debug/api': '/api'
                }
            },
            '/debug/video': {
                target: 'http://192.168.20.13:9043',     //服务器的接口地址
                secure: true,                           //如果是https，需要开启这个选项
                changeOrigin: true,                    //是否跨域请求？ture
                pathRewrite: {
                    '^/debug/video': '/'
                }
            },
            '/map': {
                target: 'http://192.168.20.13:7080',     //服务器的接口地址
                secure: false,                           //如果是https，需要开启这个选项
                changeOrigin: true,                    //是否跨域请求？ture
                pathRewrite: {
                    '^/map': '/'
                }
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}

const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require("path")
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        client: {
            overlay: false,
        },
        proxy: {
            '/api': {
                target: 'http://192.168.2.241:8888/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': 'api'
                }
            },
            '/imgv': {
                target: 'http://192.168.2.241:8888/',
                changeOrigin: true,
                pathRewrite: {
                    '^/imgv': 'img'
                }
            },
            '/file': {
                target: 'http://192.168.2.241:9043/',
                changeOrigin: true,
                pathRewrite: {
                    '^/file': ''
                }
            },
        },
        client: {
            progress: true,
            overlay: false,
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.resolve("src")
            }
        },
        plugins: [
            new webpack.ProvidePlugin({
                'THREE': require.resolve('three')
            })
        ]
    }
})

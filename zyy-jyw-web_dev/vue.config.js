const path = require('path');
const baseURL = process.env.VUE_APP_BASE_URL;
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    port: 9527,
    open: true,
    hot: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api': {
        target: baseURL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/common/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/common/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/common/styles/theme/handle.scss";`,
      },
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 1920,
            unitPrecision: 3,
            propList: [
              '*',
            ],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: [
              'el',
              'pure',
            ],
            mediaQuery: true,
            minPixelValue: 1,
            replace: true,
            exclude: [
              /(\/|\\)(node_modules)(\/|\\)/,
            ],
          }),
        ],
      },
    },
  },
};

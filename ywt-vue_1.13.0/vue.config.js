/*
  * @Author: Pure <305737824@qq.com>
  * @CreateTime: 2021-04-15 14:32:46
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-02-14 09:46:04
  * @Description: Vue 配置
  */

const path = require('path');
const moment = require('moment');
const defaultSettings = require('./src/settings');
const name = defaultSettings.title || '后勤管理系统';
const { version, } = require('./package.json');
const port = process.env.port || process.env.npm_config_port || 9527;
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  devServer: {
    port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      '/api': {
        // target: 'http://jinyiweikeji.com:8990/ywt',
        // 外网
        // target: 'https://jinyiweikeji.com/api',
        // 内网
        // target: 'https://jinyiweikeji.com/ywt',

        // target: 'http://192.168.1.38:8990/ywt',
        // target: 'http://192.168.2.10:8989/ywt',
        // 杨林
        // target: 'http://192.168.2.197:8989/ywt',
        // 李春江
        // target: 'http://192.168.2.18:8989/ywt',
        target: 'http://192.168.20.8:8989/ywt',

        // target: 'https://api.jinyiweikeji.com/ywt',
        // target: 'https://46zd085142.zicp.vip/api',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/minio': {
        target: 'http://192.168.2.19',
      },
    },
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined,
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'assets': resolve('src/assets'),
      },
    },
  },
  chainWebpack(config) {
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item.use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: './src/styles/pure/variables.scss',
        });
    });
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial',
      }
    ]);
    config.plugins.delete('prefetch');
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              inline: /runtime\..*\.js$/,
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial',
                },
                elementUI: {
                  name: 'chunk-elementUI',
                  priority: 20,
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'),
                  minChunks: 3,
                  priority: 5,
                  reuseExistingChunk: true,
                },
              },
            });
          config.optimization.runtimeChunk('single');
          config.plugin('filemanager-webpack-plugin')
            .use('filemanager-webpack-plugin', [{
              events: {
                onEnd: {
                  mkdir: ['./dist'],
                  archive: [
                    {
                      source: './dist',
                      destination: `./${process.env.VUE_APP_SPECIAL_HOSPITAL || ''}${moment().format('YYYYMMDDHHmm')}-v${version}-${process.env.NODE_ENV}.zip`,
                    }
                  ],
                },
              },
            }]);
        });
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/styles/pure/variables.scss";
        `,
        sassOptions: { outputStyle: 'expanded', },
      },
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px',
            viewportWidth: 1920,
            unitPrecision: 3,
            propList: [
              '*'
            ],
            viewportUnit: 'vw',
            fontViewportUnit: 'vw',
            selectorBlackList: ['el', 'pure'],
            mediaQuery: true,
            minPixelValue: 1,
            replace: true,
            exclude: [/(\/|\\)(node_modules)(\/|\\)/],
          })
        ],
      },
    },
  },

};

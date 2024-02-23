export default {
  install(Vue) {
    Vue.prototype.showLoading = function (config = {}) {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'transparent',
        ...config,
      });
      return loading;
    };
  },
};

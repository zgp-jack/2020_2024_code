/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-30 11:39:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-09 15:48:10
 * @Description:
 */
import Dialog from './Dialog';

let dialog;
let innerDialog;
function createInnerDialog(Vue, { store = {}, router = {}, }, options) {
  store.dispatch('app/openDialog');
  if (innerDialog) {
    innerDialog.options = {
      ...options,
    };

    innerDialog.$children[0].visible = true;
  } else {
    innerDialog = new Vue({
      name: 'RootInnerDialog',
      router,
      store,
      data() {
        return {
          options: { ...options, },
        };
      },
      render(h) {
        return h(Dialog, {
          props: this.options,
        });
      },
    });
    innerDialog.$mount();
    document.body.appendChild(innerDialog.$el);
  }

  // 暴露close方法
  return {
    close: () => innerDialog.$children[0].close(),
  };
}
function createDialog(Vue, { store = {}, router = {}, }, options) {
  store.dispatch('app/openDialog');
  if (dialog) {
    dialog.options = {
      ...options,
    };

    dialog.$children[0].visible = true;
  } else {
    dialog = new Vue({
      name: 'RootDialog',
      router,
      store,
      data() {
        return {
          options: { ...options, },
        };
      },
      render(h) {
        return h(Dialog, {
          props: this.options,
        });
      },
    });
    dialog.$mount();
    document.body.appendChild(dialog.$el);
  }

  // 暴露close方法
  return {
    close: () => dialog.$children[0].close(),
  };
}
export default {
  install(Vue, options = {}) {
    Vue.prototype.$dialog = createDialog.bind(this, Vue, options);
    Vue.prototype.$innerDialog = createInnerDialog.bind(this, Vue, options);
  },
};

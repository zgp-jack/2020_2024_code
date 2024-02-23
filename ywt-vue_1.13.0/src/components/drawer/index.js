/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-27 15:40:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-09 15:47:44
 * @Description: 抽屉弹窗组件
 */
import Drawer from './index.vue';
let drawer;
let innerDrawer;
let fuckDrawer;
function createFuckDrawer(Vue, { store = {}, router = {}, }, options) {
  store.dispatch('app/openDialog');
  if (fuckDrawer) {
    fuckDrawer.options = {
      ...options,
    };

    fuckDrawer.$children[0].visible = true;
  } else {
    fuckDrawer = new Vue({
      name: 'RootFuckDrawer',
      router,
      store,
      data() {
        return {
          options: { ...options, },
        };
      },
      render(h) {
        return h(Drawer, {
          props: this.options,
        });
      },
    });
    fuckDrawer.$mount();
    document.body.appendChild(fuckDrawer.$el);
  }

  // 暴露close方法
  return {
    close: () => fuckDrawer.$children[0].close(),
  };
}
function createInnerDrawer(Vue, { store = {}, router = {}, }, options) {
  store.dispatch('app/openDialog');
  if (innerDrawer) {
    innerDrawer.options = {
      ...options,
    };

    innerDrawer.$children[0].visible = true;
  } else {
    innerDrawer = new Vue({
      name: 'RootInnerDrawer',
      router,
      store,
      data() {
        return {
          options: { ...options, },
        };
      },
      render(h) {
        return h(Drawer, {
          props: this.options,
        });
      },
    });
    innerDrawer.$mount();
    document.body.appendChild(innerDrawer.$el);
  }

  // 暴露close方法
  return {
    close: () => innerDrawer.$children[0].close(),
  };
}
function createDrawer(Vue, {
  store = {},
  router = {},
},
options
) {
  store.dispatch('app/openDialog');
  if (drawer) {
    drawer.options = {
      ...options,
    };
    drawer.$children[0].visible = true;
  } else {
    drawer = new Vue({
      name: 'RootDrawer',
      router,
      store,
      data() {
        return {
          options: {
            ...options,
          },
        };
      },
      render(h) {
        return h(Drawer, {
          props: this.options,
        });
      },
    });
    drawer.$mount();
    document.body.appendChild(drawer.$el);
  }
  return {
    close: () => drawer.$children[0].close(),
  };
}
export default {
  install(Vue, options = {}) {
    Vue.prototype.$drawer = createDrawer.bind(this, Vue, options);
    Vue.prototype.$innerDrawer = createInnerDrawer.bind(this, Vue, options);
    Vue.prototype.$fuckDrawer = createFuckDrawer.bind(this, Vue, options);
  },
};

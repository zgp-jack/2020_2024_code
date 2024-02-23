
import Drawer from './index.vue';
let drawerIndex = 0;
function createDrawerInstance(Vue, { store = {}, router = {}, }, options) {
  drawerIndex++;
  const drawerName = `Drawer${drawerIndex}`;
  const drawer = new Vue({
    name: drawerName,
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
  drawer.$mount();
  document.body.appendChild(drawer.$el);
}

export default {
  install(Vue, options = {}) {
    Vue.prototype.$drawer = createDrawerInstance.bind(this, Vue, options);
  },
};

import Dialog from './index.vue';

let dialogIndex = 0;

function createDialogInstance(Vue, { store = {}, router = {}, }, options) {
  dialogIndex++;
  const dialogName = `Dialog${dialogIndex}`;
  const dialog = new Vue({
    name: dialogName,
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
export default {
  install(Vue, options = {}) {
    Vue.prototype.$dialog = createDialogInstance.bind(this, Vue, options);
  },
};

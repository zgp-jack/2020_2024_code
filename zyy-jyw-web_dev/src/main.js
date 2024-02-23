import Vue from 'vue';
import Element from 'element-ui';
import zhLang from 'element-ui/lib/locale/lang/zh-CN';
import locale from './assets/locale/cn';
import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/styles/index.scss';
import components from './common/components';
import PureDrawer from './common/components/drawer';
import PureDialog from './common/components/dialog';
import App from './App.vue';
import store from './store';
import router from './router';
import filter from './filter';
import directive from './directive/index';
import './navigationGuards';
import './common/icons';
import '@/assets/icons/iconfont.css';
import {
  vueErrorHandler,
  unhandledrejection,
} from '@/common/utils/errorHandler';
// bpmn绘图工具的样式
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

Vue.config.productionTip = false;
Vue.use(PureDrawer, { store, router, });
Vue.use(PureDialog, { store, router, });
Vue.use(Element, {
  locale: { ...zhLang,
    ...locale,
  },
  size: 'mini',
});
Vue.use(components);
// 引入自定义插件
import MyPlugin from '@/plugins/index.js';
Vue.use(MyPlugin);
// 注册全局过滤器
for (const i in filter) {
  Vue.filter(i, filter[i],);
}
Vue.use(directive);
window.document.documentElement.setAttribute('data-theme', 'green-theme');
Vue.config.errorHandler = vueErrorHandler;
window.addEventListener('unhandledrejection', unhandledrejection);
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

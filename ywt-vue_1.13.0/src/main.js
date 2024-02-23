/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 10:08:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 20:51:18
 * @LastEditTime: 2022-07-28 11:27:42
 * @Description:
 */
import Vue from 'vue';

import Element from 'element-ui';

import 'normalize.css/normalize.css';
import 'element-ui/lib/theme-chalk/base.css';
import '@/styles/element-variables.scss';
import '@/styles/index.scss';

import App from './App.vue';
import router from './router';
import store from './store';
import './icons'; // icon
import './permission';
import * as filters from './filters';
import PureDialog from '@/components/dialog';
import PureDrawer from '@/components/drawer';
import PureCard from '@/components/card';
import PureButton from '@/components/button/button.vue';
import PureTableArea from '@/views/components/common/tableArea.vue';
import Search from '@/components/input/search.vue';
import Retrieval from '@/components/input/retrieval.vue';
import QPasteUp from '@/components/pasteUp';
import Upload from '@/components/upload';
import CollapseItem from '@/components/collapseItem';
import Collapse from '@/components/collapse';
import './assets/font/iconfont.css';
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
import components from '@/components/index';
import VueClipboard from 'vue-clipboard2';

import table from '@/components/table';
import {
  vueErrorHandler,
  unhandledrejection,
} from './utils/error';
import ellipsis from '@hyjiacan/vue-ellipsis';
import { version, } from '../package.json';
import Cookies from 'js-cookie';
const localVersion = Cookies.get('version');
if (!localVersion) {
  window.localStorage.clear();
  window.sessionStorage.clear();
  Object.keys(Cookies.get()).forEach(key => Cookies.remove(key));
  Cookies.set('version', version);
} else {
  if (localVersion !== version) {
    const [localMain, localSecond] = localVersion.split('.');
    const [newMain, newSecond] = version.split('.');
    if (localMain !== newMain || localSecond !== newSecond) {
      Element.MessageBox.confirm(`
      检测到新版本，请重新登录系统!<br/>
      <span style="color:#1890ff;"><b>${localVersion}</b></span>
      <i class="el-icon-right"></i>
      <span style="color:red"><b>${version}</b></span>
      `,
      '提示',
      {
        confirmButtonText: '同意',
        center: true,
        dangerouslyUseHTMLString: true,
        type: 'warning',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false,
      }).then(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
        Object.keys(Cookies.get()).forEach(key => Cookies.remove(key));
        Cookies.set('version', version);
        location.reload();
      });
    } else {
      Cookies.set('version', version);
    }
  }
}

import {
  message,
} from '@/utils/resetMessage';
Vue.use(components);
Vue.component(ElCollapseTransition.name, ElCollapseTransition);
Vue.use(PureDialog, { store, router, });
Vue.use(PureDrawer, { store, router, });
Vue.use(ellipsis);
import preventReClick from './directive';
Vue.use(preventReClick);
Vue.component('pure-table-area', PureTableArea);
Vue.component('pure-card', PureCard);
Vue.component('pure-button', PureButton);
Vue.component('search', Search);
Vue.component('collapse-item', CollapseItem);
Vue.component('collapse', Collapse);
Vue.component('retrieval', Retrieval);
Vue.component('Q-table', table);
Vue.component('upload', Upload);
Vue.component('Q-paste-up', QPasteUp);
Vue.use(Element);
Vue.use(VueClipboard);

Vue.prototype.$message = message;
Vue.config.performance = true;
Vue.config.errorHandler = vueErrorHandler;
window.addEventListener('unhandledrejection', unhandledrejection);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

export default vm;


// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import Vant from 'vant'; 
import axiosHttp from './js/axiosHttp';

import 'vant/lib/index.css';
import './font/iconfont.css';

Vue.prototype.$axiosHttp = axiosHttp;
Vue.config.productionTip = false;
Vue.use(Vant);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});

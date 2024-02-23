import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/icon/iconfont.css'
import dayjs from "dayjs"
import md5 from 'js-md5'
import axios from 'axios'

import App from './App.vue'
import router from './router/index'
import store from './store'
import * as API from './api'
import './style/_style.scss'

import * as THREE from 'three';
import '../static/Detector';
import '../static/Stats';
import '../static/OrbitControls';
import '../static/KeyboardState';
import '../static/Projector';
const TWEEN = require('../static/tween.js')

Vue.config.productionTip = false
window.THREE = THREE;
window.TWEEN = TWEEN;
Vue.use(ElementUI)
axios.get('/config.json').then(res => {   
    store.commit('SETCONFIG', res.data);
})
new Vue({
    beforeCreate() {
        Vue.prototype.$bus = this;
        Vue.prototype.$API = API;
        Vue.prototype.dayjs = dayjs;
        Vue.prototype.$md5 = md5;
    },
    router,
    store,
    render: h => h(App),
}).$mount('#app')

import Vue from 'vue';
import axios from 'axios';
import { Notify } from 'vant';
import store from '../store';

// 添加一个新的axios实例
const axiosHttp = axios.create({})
// 添加请求拦截器 (请求发出前处理请求)

axiosHttp.defaults.timeout = 120000;

axiosHttp.interceptors.request.use(function (config) {
    if (store.state.createPkg) {
        config.url = store.state.host + config.url;
    }
    let token = sessionStorage.getItem('token')
    if (token != null && config.url !== "/api/user/login") {
        config.headers['access-token'] = `${token}`;
    }
    config.headers['Content-Type'] = 'application/json;charset=utf-8'

    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})
/**
 * 响应拦截器
 */
axiosHttp.interceptors.response.use(
    // 请求成功
    res => {
        if (res.data.status === -1) {
            Notify({ type: 'warning', message: '连接失败,请重新登录' });
            setTimeout(function () {
                // window.location.href = '/login'
            }, 3000);
        }
        return Promise.resolve(res)
    },
    // 请求失败
    err => {
        Notify({ type: 'danger', message: err.message });
        //  throw new Error('出错了tree:::')
        return Promise.reject(err)
    }
);
export default axiosHttp
import axios from "axios";
import Vue from 'vue'


axios.defaults.timeout = 12000;

axios.interceptors.request.use((config) => {
    let token = sessionStorage.getItem('token')
    if (token != null && config.url !== "/api/user/login") {
        config.headers['access-token'] = `${token}`;
    }
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config;
}, (error) => {
    // 对响应错误做点什么
    if (error.response.status === 401) {
        console.log("Received 401 Response")
        setTimeout(function () {
            window.location.href = '/login'
        }, 1000);
    }
    return Promise.reject(error);
})
axios.interceptors.response.use(response => {
    let token = response.headers['access-token'];
    if (token) {
        sessionStorage.setItem('token', token)
    }
    return response;
}, error => {
    
})

Vue.prototype.$axios = axios;
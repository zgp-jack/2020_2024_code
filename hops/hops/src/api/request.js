import axios from "axios";
import { Message } from 'element-ui';
import { getToken } from '@/utils/token'

const request = axios.create({
    baseURL: '/',
    timeout: 12000
})
request.interceptors.request.use(config => {
    let token = getToken()
    if (token != null && config.url.indexOf('login') == -1) {
        config.headers['token'] = `${token}`;
    }
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    return config;
})
request.interceptors.response.use(
    res => {
        if (res.data.status === -1) {
            if (document.getElementsByClassName('el-message').length == 0) {
                Message.error('登陆失效,三秒后跳转登陆页')
            }
            setTimeout(function () {
                window.location.href = '/login'
                sessionStorage.clear();
            }, 3000);
        }
        return Promise.resolve(res.data)
    },
    // 请求失败
    err => {
        if (err.response.data.message.indexOf('JWT expired') != -1) {
            if (document.getElementsByClassName('el-message').length == 0) {
                Message.error('登陆失效,三秒后跳转登陆页')
            }
            setTimeout(function () {
                window.location.href = '/login'
                sessionStorage.clear();
            }, 3000);
        }
        if (!err.message) {
            err.message = '请求已取消';
        }
        return Promise.reject(err)
    }
)

export default request;
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 16:32:55
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 17:34:24
 * @Description: Axios封装
 */
import Axios from 'axios';
import Flat from 'flat';
import { notification as Notification, } from './resetNotification';
import store from '@/store';
import {
  omitBy,
  isNil,
  isArray,
} from 'lodash';
const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000,
});

service.interceptors.request.use(
  config => {
    if (store.state['login'].accessToken) {
      config.headers['token'] = store.state['login'].accessToken;
    }

    config.transformRequest = [function (data) {
      if (data instanceof FormData) {
        return data;
      }
      let flatData = Flat(data, { maxDepth: 2, safe: true, });
      flatData = omitBy(flatData, isNil);
      const formData = new FormData();
      for (const key in flatData) {
        if (isArray(flatData[key])) {
          formData.append(key, JSON.stringify(flatData[key]));
        } else {
          formData.append(key, flatData[key]);
        }
      }
      return formData;
    }];
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  response => {
    const res = response.data;
    const env = response.headers['X-Env'];
    if (env && store.state['login'].env !== env) {
      store.state['login'].env = env;
    }
    if (res.code === 0) {
      // store.dispatch('dictionary/FETCH_DEPARTMENT_LIST', res.edition.unit);
      // store.dispatch('department/index/FETCH_DEPARTMENT_LIST', res.edition.unit);
      store.dispatch('systemDepartment/FETCH_DEPARTMENT_LIST', res.edition.unit);
      store.dispatch('dictionary/FETCH_ENGINEER_LIST', res.edition.user);
      store.dispatch('dictionary/FETCH_DIC_LIST', res.edition.dic);
      return res.body;
    } else if (res.code === -100) {
      return store.dispatch('login/REFRESH', store.state['login'].refreshToken).then(
        () => {
          return service(response.config);
        }, () => {
          Notification({
            title: '登录异常',
            message: res.msg,
            type: 'error',
          });
          // location.reload();
        }
      );
    } else {
      return Promise.reject(res.msg);
    }
  },
  error => {
    if (error?.code === 'ECONNABORTED') {
      Notification({
        title: '失败',
        message: '网络超时',
        type: 'error',
      });
      return Promise.reject();
    }
    if (error?.response?.status === 404) {
      Notification({
        title: '接口错误',
        message: '访问了一个后台不支持的接口:' + error.config.url,
        type: 'error',
      });
      return Promise.reject();
    }
    if (error?.response?.status === 500) {
      Notification({
        title: '失败',
        message: '网络错误',
        type: 'error',
      });
      return Promise.reject();
    } else {
      Notification({
        title: '失败',
        message: error,
        type: 'error',
      });
      return Promise.reject();
    }
  }
);
export default service;

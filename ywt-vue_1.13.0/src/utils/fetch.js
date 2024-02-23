/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-19 10:53:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:44:14
 * @Description: http 请求封装
 */
import Axios from 'axios';
import Flat from 'flat';
import {
  omitBy,
  isNil,
  isArray,
} from 'lodash';

import Store from '@/store';
import HttpError from './httpError';
import ClientError from './clientError';
import ServerError from './serverError';
import MD5 from 'blueimp-md5';
const RESPONSE_CODE = {
  // 请求成功
  SUCCESS: 0,
  // 登录过期
  ACCESS_TOKEN_EXPIRED: -100,
};

const service = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000 * 60,
});
const requestList = [];
const CancelToken = Axios.CancelToken;
// 生成md5
const md5 = (params) => {
  const {
    data,
    method,
    url,
  } = params;
  const paramsStr = `${JSON.stringify(data)}${method}${url}`;
  const md5Str = MD5(paramsStr);
  return md5Str;
};
service.interceptors.request.use(
  config => {
    const accessToken = Store.state['login'].accessToken;
    if (accessToken) {
      config.headers['token'] = accessToken;
    }
    if (config.method === 'post') {
      config.transformRequest = [function (data) {
        if (data instanceof FormData) {
          return data;
        }
        let flatData = Flat(data, {
          maxDepth: 2,
          safe: true,
        });
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
    }

    config.cancelToken = new CancelToken((cancel) => {
      const requestId = md5(config);
      config.headers['requestId'] = requestId;
      if (requestList.includes(requestId)) {
        cancel(config.url);
      } else {
        requestList.push(requestId);
      }
    });
    return config;
  },
  error => {
    return Promise.reject(new ClientError({ message: error.message, error, }));
  }
);
let isRefreshing = false;
let retryRequests = [];
service.interceptors.response.use(
  async response => {
    const requestId = md5(response.config);
    requestList.splice(requestList.indexOf(requestId), 1);
    const res = response.data;
    const env = response.headers['X-Env'] || response.headers['x-env'];
    if (env && Store.state['login'].env !== env) {
      Store.state['login'].env = env;
    }
    // 下载接口处理
    if (res instanceof Blob) {
      return res;
      // if (response.headers['content-type'] === 'application/vnd.ms-excel') {
      // } else if (response.headers['content-type'] === 'application/octet-stream') {
      //   return res;
      // } else {
      //   return Promise.reject(new ServerError({ message: '下载失败', }));
      // }
    }
    // 普通接口处理
    if (response.config.method === 'get') {
      return res;
    }
    switch (res.code) {
      case RESPONSE_CODE.SUCCESS:
        if (Store.state['login'].accessToken) {
          Store.dispatch('systemDepartment/FETCH_DEPARTMENT_LIST', res.edition.unit);
          Store.dispatch('dictionary/FETCH_ENGINEER_LIST', res.edition.user);
          Store.dispatch('dictionary/FETCH_DIC_LIST', res.edition.dic);
        }
        return res.body;
      case RESPONSE_CODE.ACCESS_TOKEN_EXPIRED:
        if (!isRefreshing) {
          isRefreshing = true;
          return Store.dispatch('login/REFRESH', Store.state['login'].refreshToken).then(
            () => {
              retryRequests.forEach(retryRequest => {
                retryRequest(Store.state['login'].accessToken);
              });
              retryRequests = [];
              return service(response.config);
            },
            () => {
              return Promise.reject(new ServerError({ code: RESPONSE_CODE.ACCESS_TOKEN_EXPIRED, }));
            }
          ).catch(() => {
            return Promise.reject(new ServerError({ code: RESPONSE_CODE.ACCESS_TOKEN_EXPIRED, }));
          }).finally(() => {
            isRefreshing = false;
          });
        } else {
          if (response.config.url.includes('refresh')) {
            return Promise.reject(new ServerError({ code: RESPONSE_CODE.ACCESS_TOKEN_EXPIRED, }));
          }
          return new Promise((resolve) => {
            retryRequests.push(accessToken => {
              response.config.headers['token'] = accessToken;
              resolve(service(response.config));
            });
          });
        }
      default:
        return Promise.reject(new ServerError({ message: res.msg, }));
    }
  },
  error => {
    requestList.length = 0;
    if (error.response) { // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      return Promise.reject(new HttpError({ code: error.response.status, data: error.response.data, error, }));
    } else if (error.request) { // 请求已发出，但服务器无响应
      return Promise.reject(new HttpError({ code: 1000, error, }));
    } else { // 处理请求时出现的错误
      if (Axios.isCancel(error)) {
        return Promise.reject(`url: ${error.message}`);
      }
      return Promise.reject(new ClientError({ message: error.message, error, }));
    }
  }
);
export default service;

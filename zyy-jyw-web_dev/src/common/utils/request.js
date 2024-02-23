import Axios from 'axios';
import ServerError from './errorHandler/serverError';
import ClientError from './errorHandler/clientError';
import Store from '@/store';
import qs from 'qs';
import MD5 from 'blueimp-md5';
import { Message, } from 'element-ui';

Axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// Axios.defaults.headers['Authorization'] = Store.state['APP_LOGIN'].accessToken;
const instance = Axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 15000,
});
const requestList = [];
const whiteList = [
  '/system/user/cache',
  '/system/team/cache',
  '/system/dict/data/cache',
  '/system/dept/cache',
  '/logout',
  '/login',
];
const CancelToken = Axios.CancelToken;
// 生成md5
const md5 = (config) => {
  const {
    data,
    method,
    url,
    params,
  } = config;
  // 将请求参数对象转换为查询字符串
  let queryString = '';
  if (params) {
    queryString = Object.keys(params)
      .sort() // 对参数按字母顺序排序
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    queryString = '?' + queryString;
  }
  const paramsStr = `${JSON.stringify(data)}${method}${url}${queryString}`;
  const md5Str = MD5(paramsStr);
  return md5Str;
};
// 不同的请求方式配置
const requestConfig = {
  get: (config) => {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, { arrayFormat: 'repeat', });
    };
  },
  post: (data, headers) => {
    if (data) {
      if (data?.file instanceof FileList) {
        const formData = new FormData();
        const files = Array.from(data.file);
        files.forEach((item) => {
          formData.append('file', item);
        });
        headers['Content-Type'] = 'multipart/form-data';
        return formData;
      }
      return JSON.stringify(data);
    }
  },
  put: (data, headers) => {
    if (data) {
      return JSON.stringify(data);
    }
  },
  delete: (data, headers) => {
    if (data) {
      return JSON.stringify(data);
    }
  },
};

// 请求拦截
instance.interceptors.request.use((config) => {
  if (config.method === 'get') {
    requestConfig.get(config);
  } else {
    if (requestConfig[config.method]) {
      config.data = requestConfig[config.method](config.data, config.headers);
    }
  }
  if (Store.state['APP_LOGIN'].accessToken) {
    config.headers['Authorization'] = Store.state['APP_LOGIN'].accessToken;
    // config.headers['Authorization'] = Store.state['APP_LOGIN'].accessToken;
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
}, (error) => {
  return Promise.reject(new ClientError({ message: error.message, error, }));
});
instance.interceptors.response.use((response) => {
  const requestId = md5(response.config);
  requestList.splice(requestList.indexOf(requestId), 1);
  // 配置了blob，不处理直接返回文件流
  if (response.config.responseType === 'blob') {
    if (response.status === 200) {
      return response.data;
    } else {
      return Promise.reject('文件下载失败或此文件不存在');
    }
  }
  const res = response.data;
  switch (res.code) {
    case 200:
      if (!whiteList.includes(response.config.url)) {
        Store.dispatch('SYSTEM_DIC/FETCH_CACHED_LIST', res?.version.dict);
        Store.dispatch('SYSTEM_DEPT/FETCH_CACHED_LIST', res?.version.dept);
        Store.dispatch('SYSTEM_TEAM/FETCH_CACHED_LIST', res?.version.team);
        Store.dispatch('SYSTEM_USER/FETCH_CACHED_LIST', res?.version.user);
      }
      return res.data;
    case 500:
      return Promise.reject(res.msg || '服务端异常');
    case 205:
      return Promise.reject(res.msg);
    case 401:
      Store.dispatch('APP_LOGIN/LOGOUT').then(() => {
        location.reload();
      });
      return Promise.reject(new ServerError({ code: 401, }));
    case 403:
      return Promise.reject(res.msg);
    case 601:
      Message({ message: res.msg, type: 'warning', });
      return Promise.reject('error');
  }
}, (error) => {
  requestList.length = 0;
  if (error?.response?.status === 404) {
    return Promise.reject('404');
  }
  return Promise.reject(error);
});

export default instance;

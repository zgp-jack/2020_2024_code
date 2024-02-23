/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-18 10:55:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-22 18:29:52
 * @Description:登录VUEX
 */
import LoginApi from './api';
import {
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from '@/utils/auth';
import {
  getJSON,
  setJSON,
} from '@/utils/localStorageUtil';
const UserInfoKey = 'userInfo';
const UriConfigKey = 'uriConfig';
const TemplateConfig = 'templateConfig';
const state = {
  refreshToken: getRefreshToken(),
  accessToken: getAccessToken(),
  userInfo: getJSON(UserInfoKey) || {},
  uriConfig: getJSON(UriConfigKey) || {},
  env: null,
  templateConfig: getJSON(TemplateConfig) || {},
  // 加密的key
  encryptionKey: '',
};
const mutations = {
  SET_URI_CONFIG: (state, info) => {
    if (state.env === 'INTRANET') {
      state.uriConfig = {
        baseUri: info.INTRANET_ADDR,
        fileBaseUri: info.INTRANET_FILE_BASE_URL,
        wsUri: info.INTRANET_WS_ADDR,
        bigScreenWsUri: info.INTRANET_WS_ORDERWARNING,
      };
    } else {
      state.uriConfig = {
        baseUri: info.INTERNET_ADDR,
        fileBaseUri: info.INTERNET_FILE_BASE_URL,
        wsUri: info.INTERNET_WS_ADDR,
        bigScreenWsUri: info.INTRANET_WS_ORDERWARNING,

      };
    }

    setJSON(UriConfigKey, state.uriConfig);
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token;
    setRefreshToken(token);
  },
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token;
    setAccessToken(token);
  },
  REMOVE_ALL_TOKEN: (state) => {
    state.initialToken = null;
    state.refreshToken = null;
    state.accessToken = null;
    removeRefreshToken();
    removeAccessToken();
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = Object.assign({}, state.userInfo, userInfo);
    setJSON(UserInfoKey, state.userInfo);
  },
  SET_TEMPLATE_CONFIG: (state, info) => {
    state.templateConfig = {
      excel: info.ITEM_WORK_TEMPLATE,
    };
    setJSON(TemplateConfig, state.templateConfig);
  },
  SET_ENCRYPTION_KEY: (state, key) => {
    state.encryptionKey = key;
  },
};
const actions = {
  LOGIN_WITH_PWD: async ({ commit, }, { userName, password, uuid, verCode, }) => {
    const { deptRoles, token, INTERNET_ADDR, INTERNET_FILE_BASE_URL, INTERNET_WS_ADDR, INTRANET_ADDR, INTRANET_FILE_BASE_URL, INTRANET_WS_ADDR, ITEM_WORK_TEMPLATE, INTRANET_WS_ORDERWARNING, } = await LoginApi.loginWithPWD({ password, userName, uuid, verCode, });
    commit('SET_URI_CONFIG', { INTERNET_ADDR, INTERNET_FILE_BASE_URL, INTERNET_WS_ADDR, INTRANET_ADDR, INTRANET_FILE_BASE_URL, INTRANET_WS_ADDR, INTRANET_WS_ORDERWARNING, });
    commit('SET_TEMPLATE_CONFIG', { ITEM_WORK_TEMPLATE, });
    return { deptRoles, refreshToken: token, };
  },
  LOGIN_WITH_DEPT: async ({ commit, }, { id, refreshToken, }) => {
    const userInfo = await LoginApi.loginWithDept({ id, refreshToken, });
    commit('SET_REFRESH_TOKEN', userInfo.token);
    commit('SET_ACCESS_TOKEN', userInfo.accessToken);

    if (!userInfo.menus.includes('faultReportWorkloadList')) {
      userInfo.menus.push('faultReportWorkloadList');
    }
    commit('SET_USER_INFO', userInfo);
  },
  REFRESH: async ({ commit, }, refreshToken) => {
    try {
      const { token: newRefreshToken, accessToken, } = await LoginApi.refresh(refreshToken);
      commit('SET_REFRESH_TOKEN', newRefreshToken);
      commit('SET_ACCESS_TOKEN', accessToken);
    } catch (error) {
      commit('REMOVE_ALL_TOKEN');
      throw new Error('登录失效，请重新登录');
    }
  },
  RESET_TOKEN({ commit, }) {
    return new Promise(resolve => {
      commit('REMOVE_ALL_TOKEN');
      resolve();
    });
  },
  // 获取加密的key
  GET_ENCRYPTION_KEY: async ({ commit, }) => {
    const res = await LoginApi.getEncryptionKey();
    commit('SET_ENCRYPTION_KEY', res?.value || '');
  },
};
export default {
  namespaced: true,
  namespace: 'login',
  state,
  mutations,
  actions,
};

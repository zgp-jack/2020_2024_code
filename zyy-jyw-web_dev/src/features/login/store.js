import Cookies from 'js-cookie';

import LoginApi from './api';
import { setJSON, } from '@/common/utils/localStorage';

const NAMESPACE = 'APP_LOGIN';
const state = {
  accessToken: Cookies.get(`${NAMESPACE}_ACCESS_TOKEN`) || null,
  userInfo: null,
};
const mutations = {
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token;
    Cookies.set(`${NAMESPACE}_ACCESS_TOKEN`, token);
  },
  SET_USER_INFO: (state, data) => {
    if (data != null) {
      setJSON('USER_INFO', data.user);
      state.userInfo = Object.assign({}, data.user);
    } else {
      setJSON('USER_INFO', null);
      state.userInfo = Object.assign({}, null);
    }
  },
};
const actions = {
  LOGIN: async ({ commit, dispatch, }, { username, password, }) => {
    const token = await LoginApi.login({ username, password, });
    commit('SET_ACCESS_TOKEN', token);
    await dispatch('FETCH_USER_INFO');
  },
  FETCH_USER_INFO: async ({ commit, }) => {
    const data = await LoginApi.getUserInfo();
    commit('SET_USER_INFO', data);
  },
  LOGOUT: ({ commit, }) => {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', null);
      commit('SET_USER_INFO', null);
      resolve();
    });
  },
};
export default {
  namespaced: true,
  namespace: NAMESPACE,
  state,
  mutations,
  actions,
};

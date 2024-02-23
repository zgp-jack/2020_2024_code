import Cookies from 'js-cookie';
import {
  setJSON,
  getJSON,
} from '@/common/utils/localStorage';

import DeptApi from './api';
const NAMESPACE = 'SYSTEM_DEPT';
const CACHED_LIST_KEY = `${NAMESPACE}_CACHED_LIST`;
const state = {
  accessToken: Cookies.get(`${NAMESPACE}_ACCESS_TOKEN`) || null,
  version: Cookies.get(`${NAMESPACE}_VERSION`) || '0.0.0',
  list: getJSON(CACHED_LIST_KEY) || [],
};
const mutations = {
  UPDATE_CACHED_LIST: (state, { data, version, }) => {
    state.list = data;
    setJSON(CACHED_LIST_KEY, data);
    state.version = version;
    Cookies.set(`${NAMESPACE}_VERSION`, version);
  },
};
const actions = {
  FETCH_CACHED_LIST: async ({ commit, }, version) => {
    if (state.version !== version) {
      const data = await DeptApi.getCachedList();
      commit('UPDATE_CACHED_LIST', { data, version, });
    }
  },
};
export default {
  namespaced: true,
  namespace: NAMESPACE,
  state,
  mutations,
  actions,
};

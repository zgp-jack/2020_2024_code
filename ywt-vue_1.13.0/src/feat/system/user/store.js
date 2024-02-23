/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-05-13 10:42:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-17 15:50:37
 * @Description:用户VUEX
 */
import EngineerApi from './api';
import EngineerApiV2 from './apiV2';

const state = () => ({
  list: [],
  listV2: [],
});
const getters = {};
const mutations = {
  SET_ENGINEER_LIST(state, list) {
    state.list = list;
  },
  SET_ENGINEER_LIST_V2(state, list) {
    state.listV2 = list;
  },
};
const actions = {
  FETCH_ENGINEER_LIST: async ({ commit, }, params) => {
    const { list, } = await EngineerApi.list({ state: '1', });
    commit('SET_ENGINEER_LIST', list);
  },
  FETCH_ENGINEER_LIST_V2: async ({ commit, }, params) => {
    const list = await EngineerApiV2.list();
    commit('SET_ENGINEER_LIST_V2', list);
  },
};
export default {
  namespaced: true,
  namespace: 'systemEngineer',
  state,
  getters,
  mutations,
  actions,
};

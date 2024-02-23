/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:40:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 16:40:05
 * @Description:
 */
const state = {
  logs: [],
};

const mutations = {
  ADD_ERROR_LOG: (state, log) => {
    state.logs.push(log);
  },
  CLEAR_ERROR_LOG: (state) => {
    state.logs.splice(0);
  },
};

const actions = {
  addErrorLog({ commit, }, log) {
    commit('ADD_ERROR_LOG', log);
  },
  clearErrorLog({ commit, }) {
    commit('CLEAR_ERROR_LOG');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

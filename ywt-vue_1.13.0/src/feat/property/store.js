/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-12-08 17:39:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 17:40:34
 * @Description:
 */
import DepartmentApi from '@/feat/system/department/api';
const state = {
  // 厂家列表
  manufacturerList: [],
};
const mutations = {
  UPDATE_MANUFACTURER_LIST: (state, { list, }) => {
    state.manufacturerList = list;
  },
};
const actions = {
  UPDATE_MANUFACTURER_LIST: async ({ commit, }) => {
    const { list, } = await DepartmentApi.list({ pageNum: 0,
      state: 0,
      pageSize: 9999, operationGroup: 1, });
    commit('UPDATE_MANUFACTURER_LIST', { list, });
  },
};
export default {
  namespaced: true,
  namespace: 'property',
  state,
  mutations,
  actions,
};

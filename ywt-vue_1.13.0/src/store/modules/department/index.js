/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-19 15:33:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-01 11:09:04
 * @Description: 部门数据管理
 */
import Cookies from 'js-cookie';
import DepartmentApi from '@/apis/system/department';
import {
  cloneDeep,
} from 'lodash';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import {
  toTree,
} from '@/utils/dataConvert';

const DepartmentKey = 'DepartmentV2';
const DepartmentVersionKey = 'Department-Version2';

const state = {
  list: getJSON(DepartmentKey) || [],
  originList: getJSON(`Origin-${DepartmentKey}`) || [],
  version: Cookies.get(DepartmentVersionKey),
};
const mutations = {
  UPDATE_DEPARTMENT_LIST: (state, { list, version, }) => {
    state.originList = list;
    state.list = toTree(cloneDeep(list), 0, { parentIdKey: 'parentId', labelKey: 'deptName', });

    setJSON(DepartmentKey, state.list);
    setJSON(`Origin-${DepartmentKey}`, state.originList);
    state.version = version;
    Cookies.set(DepartmentVersionKey, version);
  },
};
const actions = {
  FETCH_DEPARTMENT_LIST: async ({ commit, }, version) => {
    if (state.version !== version) {
      const { list, } = await DepartmentApi.list({ state: 1, });
      commit('UPDATE_DEPARTMENT_LIST', { list, version, });
    }
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

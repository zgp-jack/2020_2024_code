/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-17 15:11:20
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 15:38:27
 * @Description:科室VUEX
 */
import DepartmentApi from './api';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import {
  toTree,
} from '@/utils/dataConvert';
import {
  cloneDeep,
} from 'lodash';
import Cookie from 'js-cookie';
const DepartmentKey = 'DepartmentV3';
const DepartmentVersionKey = 'Department-Version3';
const state = () => ({
  list: getJSON(DepartmentKey) || [],
  originList: getJSON(`Origin-${DepartmentKey}`) || [],
  version: Cookie.get(DepartmentVersionKey),
  normalTableColumn: [
    {
      label: '科室名称',
      prop: 'deptName',
      width: 143,
      minWidth: 118,
    }, {
      label: '科室编号',
      prop: 'deptCode',
      width: 143,
      minWidth: 118,
    }, {
      label: '科室地址',
      prop: 'deptPlace',
      width: 'auto',
      minWidth: 118,
    }, {
      label: '科室电话',
      prop: 'contacts',
      width: 'auto',
      minWidth: 118,
    }, {
      label: '院区',
      prop: 'hospitalName',
      width: 150,
      minWidth: 118,
    }, {
      label: '科室启停',
      prop: 'state',
      width: 100,
    }
  ],
});
const getters = {};
const types = {
  SET_DEPARTMENT_LIST: 'SET_DEPARTMENT_LIST',
};
const mutations = {
  [types.SET_DEPARTMENT_LIST](state, { list, version, }) {
    state.originList = list;
    state.list = toTree(cloneDeep(list), 0, { parentIdKey: 'parentId', labelKey: 'deptName', });

    setJSON(DepartmentKey, state.list);
    setJSON(`Origin-${DepartmentKey}`, state.originList);
    state.version = version;
    Cookie.set(DepartmentVersionKey, version);
  },
};
const FetchState = {
  Pending: 0,
  Fulfilled: 1,
  Rejected: 2,
};
let fetchState = null;
const actions = {
  FETCH_DEPARTMENT_LIST: async ({ commit, }, version) => {
    if (state().version !== version && fetchState !== FetchState.Pending) {
      fetchState = FetchState.Pending;
      const { list, } = await DepartmentApi.list({ state: 1, });
      fetchState = FetchState.Fulfilled;
      commit(types.SET_DEPARTMENT_LIST, { list, version, });
    }
  },

};

export default {
  namespaced: true,
  namespace: 'systemDepartment',
  state,
  getters,
  mutations,
  actions,
};

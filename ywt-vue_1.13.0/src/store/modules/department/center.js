import { getAllDepartmentList, getTreeDepartmentList, } from '@/apis/department/center';

const state = {
  treeList: [],
  allList: [],
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
};
const mutations = {
  SET_TREE_LIST: (state, d) => {
    state.treeList = d;
  },
  SET_ALL_LIST: (state, d) => {
    state.allList = d;
  },
};
const actions = {
  FETCH_TREE_LIST: async ({ commit, }, d) => {
    const rs = await getTreeDepartmentList();
    commit('SET_TREE_LIST', rs);
  },
  FETCH_ALL_LIST: async ({ commit, }, d) => {
    const rs = await getAllDepartmentList();
    commit('SET_ALL_LIST', rs);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

const state = {
  normalTableColumn: [
    {
      label: '名称',
      prop: 'name',
      width: 118,
      minWidth: 118,
    }, {
      label: '值',
      prop: 'value',
      width: 118,
      minWidth: 118,
    }
  ],
  treeInfo: {},
};
const mutations = {
  SET_TREE_INFO: (s, d) => {
    s.treeInfo = d;
  },
};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

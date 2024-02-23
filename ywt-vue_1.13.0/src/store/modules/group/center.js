const state = {
  normalTableColumn: [
    {
      label: '小组名',
      prop: 'name',
      width: 180,
      minWidth: 118,
    },
    {
      label: '小组组长',
      prop: 'leader',
      width: 200,
      minWidth: 118,
    },
    {
      label: '小组成员',
      prop: 'users',
      width: 'auto',
      minWidth: 118,
    }
  ],
};
const mutation = {};
const actions = {};
export default {
  namespaced: true,
  state,
  mutation,
  actions,
};

import EngineerApi from '@/apis/system/engineer';
import { uniqBy, } from 'lodash';

const state = {
  // 用户列表
  userList: [],
  normalTableColumn: [
    {
      label: '姓名',
      prop: 'name',
      width: 200,
      fixed: true,
    },
    {
      label: '用户名',
      prop: 'userName',
      width: 200,
      fixed: true,
    }, {
      label: '角色',
      prop: 'roleName',
      width: 200,
      minWidth: 118,
    }, {
      label: '科室',
      prop: 'deptName',
      width: 200,
      minWidth: 118,
    },
    {
      label: '运维小组',
      prop: 'team',
      width: 200,
      minWidth: 118,
    }, {
      label: '电话',
      prop: 'mblNo',
      width: 200,
      minWidth: 118,
    }, {
      label: '公众号绑定',
      prop: 'mpBind',
      width: 200,
      minWidth: 59,
    }, {
      label: '小程序绑定',
      prop: 'miniProgramBind',
      width: 200,
      minWidth: 59,
    }, {
      label: '组长',
      prop: 'leader',
      width: 200,
      minWidth: 59,
    }, {
      label: '帐号启停',
      prop: 'state',
      width: 200,
      minWidth: 254,
    }, {
      label: '最近登录',
      prop: 'lastVisit',
      width: 200,
      minWidth: 200,
    }
  ],
};
const mutations = {
  SET_USER_LIST: (state, data) => {
    state.userList = data;
  },
};
const actions = {
  DISPATCHT_GET_USER_LIST: async ({ commit, state, }, data) => {
    const rs = await EngineerApi.groupedList();
    commit('SET_USER_LIST', rs);
  },
};
const getters = {
  // 获取被去重之后的人员列表
  uniqUserList: state => {
    return uniqBy(state['userList'], 'userId');
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

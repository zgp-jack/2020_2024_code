import OtherSettingApi from '@/feat/system/otherSetting/api.js';
import { Message, } from 'element-ui';

// 自动派单
const state = {
  tableDeptData: [],
  tableDicData: [],
  tabActivedValue: 1,
  treeDeptId: null,
  treeFaultTypeId: null,
  deptId: null,
  faultTypeId: null,
  // 是否自动派单
  isAutoDispatch: false,
  // 派单规则数据
  dispatchModeData: {
    // 抢单时间配置 0-720
    acceptOrderTime: '',
    // 未接单数累计是否开启 1是 0否
    notAccept: 0,
    // 未接单数累计类型 1可为负数 0不可为负数
    notAcceptType: '',
    // 是否开启自动派单 1是 0否
    open: 0,
    // 是否开启每日重置派单 1是 0否
    reset: 0,
    // 排班派单是否开启 1是 0否
    schedule: 0,
    // 接单阈值(他人可接)
    scheduleOrderNum: '',
    // 排班派单类型 1值班人员接单 2非值班人员接单 3值班人员末位接单 4值班人员优先接单
    scheduleType: '',
    // 是否开启去向派单跳过 1是 0否
    skipWhereabouts: 0,
    // 跳过的去向数据
    whereaboutsList: '',
  },
};
const mutations = {

  setDeptId(state, data) {
    state.deptId = data;
  },
  setFaultTypeId(state, data) {
    state.faultTypeId = data;
  },
  // tab切换
  setTabActivedValue(state, data) {
    state.tabActivedValue = data;
  },
  // 设置tree
  setTreeDeptId(state, data) {
    state.treeDeptId = data;
  },
  setTreeFaultTypeId(state, data) {
    state.treeFaultTypeId = data;
  },
  // 设置table
  setTableData(state, data) {
    if (state.tabActivedValue === 1) {
      state.tableDeptData = data;
    } else {
      state.tableDicData = data;
    }
  },
  // 设置派单规则数据
  setDispatchModeData(state, data) {
    state.dispatchModeData = data;
  },
};
const getters = {
  isAutoDispatch(state) {
    return Boolean(state.dispatchModeData.open);
  },
  isDeptChecked(state) {
    return Boolean(state.dispatchModeData.orderRuleDept);
  },
  isFaultTypeChecked(state) {
    return Boolean(state.dispatchModeData.orderRuleType);
  },
};

const actions = {
  // 获取派单模式下的table数据
  GET_DISPATCH_MODE_TABLE_DATA: async ({ commit, state, },) => {
    const params = {
      mode: state.tabActivedValue,
      parentDeptId: state.tabActivedValue === 1 ? state.treeDeptId : null,
      parentTypeId: state.tabActivedValue === 2 ? state.treeFaultTypeId : null,
    };
    const res = await OtherSettingApi.getDispatchMode(params);
    commit('setTableData', res || []);
  },
  // 设置接单小组/人
  SET_TEAM_USER: async ({ commit, dispatch, }, params) => {
    await OtherSettingApi.setDispatchMode({
      deptId: state.tabActivedValue === 1 ? state.deptId : null,
      faultType: state.tabActivedValue === 2 ? state.faultTypeId : null,
      // 派单类型(1用户 2小组)
      sendType: params.isTeam ? 2 : 1,
      sendTeam: params.teamId,
      sendUser: params.engineerId,
    });
    dispatch('GET_DISPATCH_MODE_TABLE_DATA');
  },
  // 获取派单规则数据
  GET_DISPATCH_MODE_DATA: async ({ commit, dispatch, },) => {
    const res = await OtherSettingApi.getAutoDispatchConfig();
    commit('setDispatchModeData', res);
  },
  // 设置派单数据
  SET_DISPATCH_MODE_DATA: async ({ commit, dispatch, }, params) => {
    await OtherSettingApi.setAutoDispatchConfig(params);
    dispatch('GET_DISPATCH_MODE_DATA');
    Message.success('设置成功');
  },

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

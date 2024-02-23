
import TicketApi from '@/feat/ticket/api.js';
const state = {
  mode: {
    //  报修科室
    deptId: null,
    // 故障分类
    faultType: null,
    type: 1,
  },
  send: {
    engineerId: null,
    isTeam: false,
    name: null,
    teamId: null,
  },

};
const mutations = {
  setDeptId(state, data) {
    state.mode.deptId = data;
  },
  setFaultType(state, data) {
    state.mode.faultType = data;
  },
  setSendTeamUser(state, data) {
    if (data) {
      state.send = Object.assign({}, {
        engineerId: data.sendUser,
        name: data.sendUserName || data.sendTeamName || '',
        isTeam: !data.sendUser,
        teamId: data.sendTeam,
      });
      // state.send.engineerId = data.sendUser;
      // state.send.name = data.sendUserName || data.sendTeamName || '';
      // state.send.isTeam = !data.sendUser;
      // state.send.teamId = data.sendTeam;
    } else {
      state.send = {};
    }
  },
};

const actions = {
  GET_MODE_TEAM_USER: async ({ commit, rootGetters, getters, }, data) => {
    if (rootGetters['systemOtherSetting/autoOrder/isAutoDispatch'] && (rootGetters['systemOtherSetting/autoOrder/isDeptChecked'] || rootGetters['systemOtherSetting/autoOrder/isFaultTypeChecked'])) {
      const res = await TicketApi.getMode(data);
      commit('setSendTeamUser', res);
    }
  },

};
const getters = {
  modeValue(state) {
    return state.mode;
  },
  modeSendValue(state) {
    return state.send;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

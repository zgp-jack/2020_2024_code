import { getOperationsTeam, } from '@/apis/group';

const state = {
  list: [],
};
const mutations = {
  SET_TEAM_LIST: (state, d) => {
    state.list = d;
  },
};
const actions = {
  FETCH_TEAM_LIST: async ({ commit, }, d) => {
    const rs = await getOperationsTeam();
    commit('SET_TEAM_LIST', rs);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};


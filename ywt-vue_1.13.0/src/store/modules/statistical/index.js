
const state = {
  queryData: {
    title: '',
  },
};

const mutations = {
  SET_QUERY_DATA: (state, queryData) => {
    state.queryData = queryData;
  },

};
const getters = {
  routeTitle: state => state.queryData?.title,

};

export default {
  namespaced: true,
  state,
  mutations,
  getters,

};

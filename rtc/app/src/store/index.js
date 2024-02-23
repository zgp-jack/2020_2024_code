import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    users: [],
    active: 0,
    host: 'http://10.132.103.46:18080',
    createPkg: true
  },
  mutations: {
    setUserList (state, payload) {
      state.users = payload.data;
    },
    setActive (state, val) {
      state.active = val;
    }
  }
})
export default store
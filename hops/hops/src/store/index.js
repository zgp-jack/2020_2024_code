import Vue from 'vue'
import Vuex from 'vuex'

import { getToken, removeToken, setToken } from '@/utils/token'
import { getTree } from '@/utils/util.js'
import { getRuleType } from '@/api'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: getToken(),
        navAction: sessionStorage.getItem('navAction') || 'index',
        openListArr: JSON.parse(sessionStorage.getItem('openListArr')) || [],
        navOpends: [],
        companyTree: [],
        roleList: [],
        wxUser: [],
        orderUser: [],
        orderUserNormal: [],
        permissions: [],
        ruleType: JSON.parse(sessionStorage.getItem('RuleType')) || [],
        config: {
            name: '',
            department: '',
            bigScreenCycle: 10
        },
        alarmTableReload: false
    },
    getters: {
    },
    mutations: {
        SETTOKEN(state, token) {
            state.token = token
            setToken(token)
        },
        CLEARDATA(state) {
            state.token = ''
            removeToken()
        },
        SETCOMPANYTREE(state, data) {
            state.companyTree = data;
        },
        SETROLELIST(state, data) {
            state.roleList = data;
        },
        SETWXUSER(state, data) {
            state.wxUser = data;
        },
        SETORDERUSER(state, data) {
            state.orderUser = data;
        },
        SETORDERUSERNORMAL(state, data) {
            state.orderUserNormal = data;
        },
        SETPERMISSIONS(state, data) {
            state.permissions = data;
        },
        updateRuleType(state, ruleTypeData) {
            state.ruleType = ruleTypeData
        },
        updateNavAction(state, navAction) {
            state.navAction = navAction
        },
        updateOpenListArr(state, openListArr) {
            state.openListArr = openListArr
        },
        updateOldList(state, reload) {
            state.alarmTableReload = reload;
        },
        SETCONFIG(state, data) {
            state.config = data;
        }
    },
    actions: {
        getRuleTypeAction(context) {
            getRuleType().then(res => {
                if (res.status == 1) {
                    let treeTule = res.data
                    sessionStorage.setItem('RuleType', JSON.stringify(treeTule))
                    context.commit('updateRuleType', treeTule)
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.message,
                    });
                }
            })
        },
    }
})

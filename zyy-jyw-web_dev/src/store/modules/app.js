import Cookies from 'js-cookie';
const NAMESPACE = 'APP';
import {
  constantRoutes,
  asyncRoutes,
} from '@/router';
import { getRouters, } from '@/features/system/menu/api';
import { getMsgCount, } from '@/common/layout/components/api';
import { setJSON, getJSON, } from '@/common/utils/localStorage';
const state = {
  visitedTagViews: [],
  cachedTagViews: [],
  msgValue: 0,
  sidebar: {
    opened: Cookies.get(`${NAMESPACE}_SIDEBAR_STATUS`) ? !!+Cookies.get(`${NAMESPACE}_SIDEBAR_STATUS`) : true,
    withoutAnimation: false,
  },
  a: getJSON('APP_MENU_A') || [
    ...constantRoutes,
    ...asyncRoutes,
  ],
};
const mutations = {
  ADD_VISITED_TAG_VIEW: (state, view) => {
    if (state.visitedTagViews.some(v => v.path === view.path)) {
      return;
    }
    const visitedTagView = Object.assign(
      {},
      view,
      {
        title: view.meta.title || 'no-name',
      });
    state.visitedTagViews.push(visitedTagView);
  },
  ADD_CACHED_TAG_VIEW: (state, view) => {
    if (state.cachedTagViews.includes(view.name)) {
      return;
    }
    if (!view.meta.noCache) {
      state.cachedTagViews.push(view.name);
    }
  },
  DEL_VISITED_TAG_VIEW: (state, view) => {
    /* eslint-disable */
    for (const [i, v] of state.visitedTagViews.entries()) {
      if (v.path === view.path) {
        state.visitedTagViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_TAG_VIEW: (state, view) => {
    const index = state.cachedTagViews.indexOf(view.name);
    index > -1 && state.cachedTagViews.splice(index, 1);
  },
  DEL_OTHERS_VISITED_TAG_VIEWS: (state, view)=>{
    state.visitedTagViews = state.visitedTagViews.filter(v=>{
      return v.meta.affix || v.path === view.path;
    });
  },
  DEL_OTHERS_CACHED_VIEWS: (state, view)=>{
    const index = state.cachedTagViews.indexOf(view.name);
    if(index>-1) {
      state.cachedTagViews = state.cachedTagViews.slice(index, index+1);
    }else {
      state.cachedTagViews = [];
    }
  },
  DEL_ALL_VISITED_TAG_VIEWS: state=>{
    const affixTags = state.visitedTagViews.filter(tag => tag.meta.affix);
    state.visitedTagViews = affixTags;
  },
  DEL_ALL_CACHED_TAG_VIEWS: state => {
    state.cachedTagViews = [];
  },

  UPDATE_VISITED_TAG_VIEW: (state, view) => {
    for (let v of state.visitedTagViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  },
  TOGGLE_SIDEBAR: state=>{
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    Cookies.set(`${NAMESPACE}_SIDEBAR_STATUS`,+state.sidebar.opened);
  },
  UPDATE_MENU_A: (state, data) => {
    state.a = data;
  },
  UPDATE_MSGVALUE: (state, data) => {
    state.msgValue = data;
  },
};
const actions = {
  async UPDATE_MSGVALUE_ACTION({commit}) {
    const res = await getMsgCount();
    commit('UPDATE_MSGVALUE', res || 0);
  },
  async ADD_MENU_A(context) {
    const res = await getRouters();
    context.commit('UPDATE_MENU_A', res);
    setJSON('APP_MENU_A', res);
  },
  ADD_TAG_VIEW({dispatch}, view) {
    dispatch('ADD_VISITED_TAG_VIEW',view);
    dispatch('ADD_CACHED_TAG_VIEW',view);
  },
  ADD_VISITED_TAG_VIEW({commit},view) {
    commit('ADD_VISITED_TAG_VIEW',view);
  },
  ADD_CACHED_TAG_VIEW({commit},view) {
    commit('ADD_CACHED_TAG_VIEW',view);
  },
  DEl_TAG_VIEW: async ({dispatch,state},view) =>{
    await dispatch('DEL_VISITED_TAG_VIEW',view);
    await dispatch('DEL_CACHED_TAG_VIEW',view);
    return {
      visitedTagViews: [...state.visitedTagViews],
      cachedTagViews: [...state.cachedTagViews],
    }
  },
  DEL_VISITED_TAG_VIEW: async ({commit,state},view) =>{
    await commit('DEL_VISITED_TAG_VIEW',view);
    return [...state.visitedTagViews];
  },
  DEL_CACHED_TAG_VIEW: async({commit, state},view)=>{
    await commit('DEL_CACHED_TAG_VIEW',view);
    return [...state.cachedTagViews];
  },
  DEL_OTHERS_TAG_VIEWS: async ({dispatch,state},view)=>{
    await dispatch('DEL_OTHERS_VISITED_TAG_VIEWS',view);
    await dispatch('DEL_OTHERS_CACHED_TAG_VIEWS',view);
    return {
      visitedTagViews: [...state.visitedTagViews],
      cachedTagViews: [...state.cachedTagViews],
    }
  },
  DEL_OTHERS_VISITED_TAG_VIEWS: async({commit, state}, view) =>{
    await commit('DEL_OTHERS_VISITED_TAG_VIEWS',view);
    return [...state.visitedTagViews];
  },
  DEL_OTHERS_CACHED_TAG_VIEWS: async({commit, state}, view) =>{
    await commit('DEL_OTHERS_CACHED_TAG_VIEWS',view);
    return [...state.cachedTagViews];
  },
  DEL_ALL_TAG_VIEWS: async ({dispatch,state},view)=>{
    await dispatch('DEL_ALL_VISITED_TAG_VIEWS',view);
    await dispatch('DEL_ALL_CACHED_TAG_VIEWS',view);
    return {
      visitedTagViews: [...state.visitedTagViews],
      cachedTagViews: [...state.cachedTagViews],
    }
  },
  DEL_ALL_VISITED_TAG_VIEWS: async({commit, state}, view) =>{
    await commit('DEL_ALL_VISITED_TAG_VIEWS',view);
    return [...state.visitedTagViews];
  },
  DEL_ALL_CACHED_TAG_VIEWS: async({commit, state}, view) =>{
    await commit('DEL_ALL_CACHED_TAG_VIEWS',view);
    return [...state.cachedTagViews];
  },
  UPDATE_VISITED_TAG_VIEW({commit},view) {
    commit('UPDATE_VISITED_TAG_VIEW',view);
  },
  TOGGLE_SIDEBAR({commit}) {
    commit('TOGGLE_SIDEBAR');
  }

};
export default {
  namespaced: true,
  namespace: NAMESPACE,
  state,
  mutations,
  actions,
};

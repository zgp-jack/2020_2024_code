/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:44:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-11-09 15:56:25
 * @Description:
 */
import Cookies from 'js-cookie';

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  openedDrawerOrDialogCount: 0,
  unrecivedPanelVisible: true,
  unrevivedData: [],
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set('size', size);
  },
  OPEN_DIALOG: (state) => {
    state.openedDrawerOrDialogCount++;
  },
  CLOSE_DIALOG: (state) => {
    if (state.openedDrawerOrDialogCount > 0) {
      state.openedDrawerOrDialogCount--;
    } else {
      console.warn('弹窗数量统计有点问题！');
    }
  },
};

const actions = {
  toggleSideBar({ commit, }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit, }, { withoutAnimation, }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit, }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setSize({ commit, }, size) {
    commit('SET_SIZE', size);
  },
  openDialog({ commit, }) {
    commit('OPEN_DIALOG');
  },
  closeDialog({ commit, }) {
    commit('CLOSE_DIALOG');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

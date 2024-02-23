/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-10-13 16:29:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-13 16:29:42
 * @Description:
 */
import variables from '@/styles/element-variables.scss';
import defaultSettings from '@/settings';

const { showSettings, tagsView, fixedHeader, sidebarLogo, } = defaultSettings;

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value, }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit, }, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

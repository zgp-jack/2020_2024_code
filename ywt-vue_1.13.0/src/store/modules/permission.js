/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 21:45:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 11:22:23
 * @Description: 菜单权限
 */
import {
  constantRoutes,
  asyncRoutes,
} from '@/router';
import store from '@/store';
const state = {
  routes: [],
  addRoutes: [],
};
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};
const actions = {
  GENERATE_ROUTES({ commit, }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = [];
      accessedRoutes = asyncRoutes || [];
      const menus = store.state['login'].userInfo.menus;
      accessedRoutes = filterAsyncRoutes(asyncRoutes, menus?.length > 0 ? menus : ['/home']);

      console.log(accessedRoutes, 'accessedRoutes');
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  },
};
function filterAsyncRoutes(routes, permission) {
  const res = [];
  routes.forEach(route => {
    const tmp = { ...route, };
    if (permission.includes(tmp.path)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permission);
      }
      res.push(tmp);
    }
  });
  return res;
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

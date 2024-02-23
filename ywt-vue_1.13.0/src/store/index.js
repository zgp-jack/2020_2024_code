/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:09:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 15:49:48
 * @Description:
 */
import Vue from 'vue';
import Vuex from 'vuex';

import getters from './getters';

Vue.use(Vuex);

const modulesFiles = require.context('./modules', true, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
  const value = modulesFiles(modulePath);

  modules[moduleName] = value.default;
  return modules;
}, {});
const genModule = () => {
  const storeFiles = require.context('../feat', true, /store\.js$/);
  const stores = storeFiles.keys().reduce((stores, storePath) => {
    const storeObj = storeFiles(storePath).default;
    if (storeObj?.namespace) {
      stores[storeObj.namespace] = storeObj;
    }

    return stores;
  }

  , {});
  return stores;
};
const store = new Vuex.Store({
  modules: { ...modules, ...genModule(), },
  getters,
});
export default store;

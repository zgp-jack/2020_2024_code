import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
Vue.use(Vuex);

const globalStoreFiles = require.context('./modules', true, /\.js$/);
const globalStores = globalStoreFiles.keys().reduce((stores, storePath) => {
  const storeObj = globalStoreFiles(storePath).default;
  if (storeObj?.namespace) {
    stores[storeObj.namespace] = storeObj;
  }
  return stores;
}, {});
const genModule = () => {
  const storeFiles = require.context('../features', true, /store\.js$/);
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
  modules: {
    ...globalStores,
    ...genModule(),
  },
  getters,
});
export default store;

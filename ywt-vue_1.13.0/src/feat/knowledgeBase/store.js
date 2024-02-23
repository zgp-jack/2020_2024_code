/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 15:15:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 18:29:28
 * @Description:知识库数据管理
 */
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
import {
  deleteEmptyChildrenProperty,
} from '@/utils/common';
import KnowledgeBaseApi from './retrieval/api';
import { version, } from '../../../package.json';
const KnowledgeClassification = `knowledge-classification-${version}`;
const state = () => ({
  // 知识分类
  knowledgeClassification: getJSON(KnowledgeClassification) || [],
});
const getters = {};
const mutations = {
  UPDATE_KNOWLEDGE_CLASSIFICATION(state, data) {
    state.knowledgeClassification = data;
    setJSON(KnowledgeClassification, data);
  },
};
const actions = {
  FETCH_KNOWLEDGE_CLASSIFICATION: async ({ commit, }) => {
    const list = await KnowledgeBaseApi.classificationList();
    const data = deleteEmptyChildrenProperty(list);
    commit('UPDATE_KNOWLEDGE_CLASSIFICATION', data);
    return data;
  },
};
export default {
  namespaced: true,
  namespace: 'knowledgeBase',
  state,
  getters,
  mutations,
  actions,
};

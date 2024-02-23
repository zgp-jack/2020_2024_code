
import DepartmentApi from '@/feat/system/department/api';
import BigNumber from 'bignumber.js';

import _ from 'lodash';
const state = {
  itemList: [],
  // 操作模式
  optionsModel: 'add',
  // 企业列表
  enterpriseList: [],
  // 详情数据
  detailData: {
    payPlanList: [],
    receiptList: [],
    contractPrice: '',
  },
};

const mutations = {
  SET_ITEMLIST: (state, data) => {
    state.itemList = data;
  },
  SET_OPTIONS_MODEL: (state, data) => {
    state.optionsModel = data;
  },
  SET_ENTERPRISE_LIST: (state, data) => {
    state.enterpriseList = data;
  },
  SET_ENTERPISE_LIST: (state, data) => {
    state.enterpriseList = data;
  },
  SET_DETAIL_DATA: (state, data) => {
    state.detailData = data;
  },

};

const actions = {
  DISPATHCH_ENTERPRISE_LIST: async ({ commit, }) => {
    // 获取企业数据
    const { list, } = await DepartmentApi.list({ pageNum: 0,
      state: 0,
      pageSize: 9999, operationGroup: 1, });
    console.log(list, 'list');
    commit('SET_ENTERPISE_LIST', list);
  },
};
const getters = {
  classPrice: state => {
    // 合同总金额
    const countPrice = state.detailData.contractPrice || 0;
    //  计算 金额  => 已开金额
    const amountOpend = _.sum(state?.detailData.receiptList.map((e) => e.receiptPrice || 0));
    const num = new BigNumber(countPrice);
    //  待开金额
    const prescribedAmount = num.minus(amountOpend).toNumber();
    return {
      countPrice,
      prescribedAmount,
      amountOpend,
    };
  },

};
export default {
  namespaced: true,
  actions,
  state,
  mutations,
  getters,
};

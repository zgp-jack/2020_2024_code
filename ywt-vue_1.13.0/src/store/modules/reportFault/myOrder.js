/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-23 15:52:51
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-06 17:38:55
 * @Description:我的工单
 */

import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';
// 默认排序规则
const ORDER_RULE = [
  {
    name: '工单紧急程度',
    id: 1,
    order: 1,
    label: 'degree',
  }, {
    name: '故障影响范围',
    id: 2,
    order: 2,
    label: 'rangeType',
  }, {
    name: '报修时间',
    id: 3,
    order: 3,
    label: 'infoTime',
  }, {
    name: '建单时间',
    id: 4,
    order: 4,
    label: 'createTime',
  }
];
const OrderRuleKey = 'Reportfault-my-order-rule';

// 默认复杂表头
const COMPLEX_TABLE_COLUMN = [{
  name: '紧急程度',
  label: '紧急程度',
  prop: 'degree',
  id: 1,
  order: 1,
  checked: true,
  width: 119,
  fixed: true,
}, {
  name: '状态',
  label: '状态',
  prop: 'currState',
  id: 2,
  order: 2,
  checked: true,
  width: 119,
  fixed: true,
}, {
  name: '影响范围',
  label: '影响范围',
  prop: 'rangeType',
  id: 3,
  order: 3,
  checked: true,
  width: 137,
  fixed: true,
}, {
  name: '报修时间',
  label: '报修时间',
  prop: 'createTime',
  id: 5,
  order: 5,
  checked: true,
  width: 227,
  fixed: true,
}, {
  name: '报修电话',
  label: '报修电话',
  prop: 'phone',
  id: 4,
  order: 4,
  checked: true,
  width: 200,
  fixed: false,
}, {
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 6,
  order: 6,
  checked: true,
  width: 200,
  fixed: false,
}, {
  name: '工单来源',
  label: '工单来源',
  prop: 'source',
  id: 7,
  order: 7,
  checked: true,
  width: 200,
  fixed: false,
}, {
  name: '建单人',
  label: '建单人',
  prop: 'createUserToName',
  id: 8,
  order: 8,
  checked: true,
  width: 200,
  fixed: false,
}, {
  name: '处理人',
  label: '处理人',
  prop: 'makeUserToName',
  id: 9,
  order: 9,
  checked: true,
  width: 200,
  fixed: false,
}, {
  name: '故障描述',
  label: '故障描述',
  prop: 'faultRemark',
  id: 10,
  order: 10,
  checked: true,
  width: 387,
  fixed: 'right',
}];
const ComplexTableColumnKey = 'Reportfault-my-order-complex-table-column';
const state = {
  complexTableColumn: getJSON(ComplexTableColumnKey) || COMPLEX_TABLE_COLUMN,
  orderRule: getJSON(OrderRuleKey) || ORDER_RULE,
};
const mutations = {
  UPDATE_ORDER_RULE: (state, { orderRule, }) => {
    state.orderRule = orderRule;
    setJSON(OrderRuleKey, orderRule);
  },

  UPDATE_COMPLEX_TABLE_COLUMN: (state, { complexTableColumn, }) => {
    state.complexTableColumn = complexTableColumn;
    setJSON(ComplexTableColumnKey, complexTableColumn);
  },
};
const actions = {
  UPDATE_ORDER_RULE: async ({ commit, }, orderRule) => {
    commit('UPDATE_ORDER_RULE', { orderRule, });
  },
  UPDATE_COMPLEX_TABLE_COLUMN: async ({ commit, }, complexTableColumn) => {
    commit('UPDATE_COMPLEX_TABLE_COLUMN', { complexTableColumn, });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

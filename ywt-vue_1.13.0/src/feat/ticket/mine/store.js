/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-07 14:49:03
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-07 14:51:21
 * @Description:我的工单Vuex
 */

import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';

// 默认排序规则
const TICKET_RULE = [
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
const TicketRuleKey = 'Ticket-mine-ticket-rule';

// 工单表头
const TICKET_TABLE_COLUMN = [{
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
  width: 102,
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
  width: 140,
  fixed: false,
}, {
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 6,
  order: 6,
  checked: true,
  width: 124,
  fixed: false,
}, {
  name: '工单来源',
  label: '工单来源',
  prop: 'source',
  id: 7,
  order: 7,
  checked: true,
  width: 120,
  fixed: false,
}, {
  name: '建单人',
  label: '建单人',
  prop: 'createUserToName',
  id: 8,
  order: 8,
  checked: true,
  width: 120,
  fixed: false,
}, {
  name: '处理人',
  label: '处理人',
  prop: 'makeUserToName',
  id: 9,
  order: 9,
  checked: true,
  width: 120,
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
const TicketTableColumnKey = 'Ticket-mine-ticket-table-column';
const state = {
  ticketTableColumn: getJSON(TicketTableColumnKey) || TICKET_TABLE_COLUMN,
  ticketRule: getJSON(TicketRuleKey) || TICKET_RULE,
};
const mutations = {
  UPDATE_TICKET_RULE: (state, { ticketRule, }) => {
    state.ticketRule = ticketRule;
    setJSON(TicketRuleKey, ticketRule);
  },
  UPDATE_TICKET_TABLE_COLUMN: (state, { ticketTableColumn, }) => {
    state.ticketTableColumn = ticketTableColumn;
    setJSON(TicketTableColumnKey, ticketTableColumn);
  },
};
const actions = {
  UPDATE_TICKET_RULE: async ({ commit, }, ticketRule) => {
    commit('UPDATE_TICKET_RULE', { ticketRule, });
  },
  UPDATE_TICKET_TABLE_COLUMN: async ({ commit, }, ticketTableColumn) => {
    commit('UPDATE_TICKET_TABLE_COLUMN', { ticketTableColumn, });
  },
};

export default {
  namespaced: true,
  namespace: 'ticketMine',
  state,
  mutations,
  actions,
};

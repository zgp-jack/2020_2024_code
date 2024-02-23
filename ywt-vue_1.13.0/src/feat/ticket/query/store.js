/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-08 17:03:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-23 15:09:59
 * @Description:工单查询VUEX
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
const TicketRuleKey = 'Ticket-query-ticket-rule';

// 工单表头
const TICKET_TABLE_COLUMN = [
  {
    name: '故障描述',
    label: '故障描述',
    prop: 'faultRemark',
    id: 1,
    order: 1,
    checked: true,
    width: 245,
    fixed: true,
  },
  {
    name: '报修科室',
    label: '报修科室',
    prop: 'deptIdToName',
    id: 2,
    order: 2,
    checked: true,
    width: 245,
    fixed: true,
  },
  {
    name: '报修时间',
    label: '报修时间',
    prop: 'createTime',
    id: 3,
    order: 3,
    checked: true,
    width: 144,
    fixed: true,
  },
  {
    name: '故障分类',
    label: '故障分类',
    prop: 'faultTypeToName',
    id: 4,
    order: 4,
    checked: true,
    width: 144,
    fixed: false,
  },
  {
    name: '工单号',
    label: '工单号',
    prop: 'orderNum',
    id: 5,
    order: 5,
    checked: true,
    width: 226,
    fixed: false,
  },
  {
    name: '报修电话',
    label: '报修电话',
    prop: 'phone',
    id: 6,
    order: 6,
    checked: true,
    width: 144,
    fixed: false,
  },

  {
    name: '建单人',
    label: '建单人',
    prop: 'createUserToName',
    id: 7,
    order: 7,
    checked: true,
    width: 200,
    fixed: false,
  },
  {
    name: '处理人',
    label: '处理人',
    prop: 'makeUserToName',
    id: 8,
    order: 8,
    checked: true,
    width: 120,
    fixed: 'right',
  },
  {
    name: '状态',
    label: '状态',
    prop: 'currState',
    id: 9,
    order: 9,
    checked: true,
    width: 120,
    fixed: 'right',
  },
  {
    name: '运维小组',
    label: '运维小组',
    prop: 'teamIds',
    id: 10,
    order: 10,
    checked: true,
    width: 120,
    fixed: false,
  },
  {
    name: '建单日期',
    label: '建单日期',
    prop: 'createTime',
    id: 11,
    order: 11,
    checked: true,
    width: 148,
    fixed: false,
  },
  {
    name: '故障来源',
    label: '故障来源',
    prop: 'source',
    id: 13,
    order: 13,
    checked: true,
    width: 120,
    fixed: false,
  }
];
const TicketTableColumnKey = 'Ticket-query-ticket-table-column';
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

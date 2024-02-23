/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-29 10:40:44
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 09:28:30
 * @Description:其他导入工单VUEX
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
const TicketRuleKey = 'Ticket-third-part-ticket-rule';

// 工单表头
const TICKET_TABLE_COLUMN = [
  {
    name: '报修时间',
    label: '报修时间',
    prop: 'createTime',
    id: 1,
    order: 1,
    checked: true,
    width: 200,
    fixed: true,
  },
  {
    name: '报修科室',
    label: '报修科室',
    prop: 'deptName',
    id: 2,
    order: 2,
    checked: true,
    width: 174,
    fixed: true,
  },
  {
    name: '联系电话',
    label: '联系电话',
    prop: 'phone',
    id: 3,
    order: 3,
    checked: true,
    width: 162,
    fixed: true,
  },
  {
    name: '故障描述',
    label: '故障描述',
    prop: 'faultRemark',
    id: 4,
    order: 4,
    checked: true,
    width: 593,
    fixed: false,
  },
  {
    name: '建单人',
    label: '建单人',
    prop: 'createUser',
    id: 5,
    order: 5,
    checked: true,
    width: 120,
    fixed: false,
  },
  {
    name: '处理人',
    label: '处理人',
    prop: 'sendUser',
    id: 6,
    order: 6,
    checked: true,
    width: 120,
    fixed: false,
  },
  {
    name: '状态',
    label: '状态',
    prop: 'state',
    id: 9,
    order: 9,
    checked: true,
    width: 120,
    fixed: 'right',
  }
];
const TicketTableColumnKey = 'Ticket-third-part-ticket-table-column';
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
  namespace: 'ticketThirdPart',
  state,
  mutations,
  actions,
};

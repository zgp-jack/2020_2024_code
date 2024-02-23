/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 18:20:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 09:41:57
 * @Description:服务台vuex
 */
import ServiceDeskApi from './api';
import {
  setJSON,
  getJSON,
} from '@/utils/localStorageUtil';

import {
  staffId,
} from '@/filters';
import * as sessionStorageUtil from '@/utils/sessionStorageUtil';
import {
  transform,
  mapKeys,
  omit,
  keys,
} from 'lodash';
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
const TicketRuleKey = 'Ticket-service-desk-ticket-rule';
// 通话记录表头
const CALL_RECORD_COLUMN = [{
  name: '类型',
  label: '类型',
  prop: 'type',
  id: 1,
  order: 1,
  checked: true,
  width: 86,
}, {
  name: '通话时间',
  label: '通话时间',
  prop: 'createTime',
  id: 2,
  order: 2,
  checked: true,
  width: 211,
}, {
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 3,
  order: 3,
  checked: true,
  width: 158,
},
{
  name: '报修人',
  label: '报修人',
  prop: 'user',
  id: 4,
  order: 4,
  checked: true,
  width: 103,
},
{
  name: '通话号码',
  label: '通话号码',
  prop: 'phone',
  id: 5,
  order: 5,
  checked: true,
  width: 146,
}, {
  name: '服务台',
  label: '服务台',
  prop: 'receptionToName',
  id: 6,
  order: 6,
  checked: true,
  width: 103,
},
{
  name: '关联工单',
  label: '关联工单',
  prop: 'linkedType',
  id: 7,
  order: 7,
  checked: true,
  width: 119,
},
{
  name: '录音',
  label: '录音',
  prop: 'recording',
  id: 8,
  order: 8,
  checked: true,
  width: 288,
}, {
  name: '处置类型',
  label: '处置类型',
  prop: 'dealType',
  id: 9,
  order: 9,
  checked: true,
  width: 103,
}
];
const CallRecordTableColumnKey = 'Ticket-service-desk-call-record-table-column';
// 通话记录-电话找人表头
const CALL_RECORD_PHONE_FIND_COLUMN = [
  {
    name: '类型',
    label: '类型',
    prop: 'type',
    id: 1,
    order: 1,
    checked: true,
    width: 102,
  }, {
    name: '通话时间',
    label: '通话时间',
    prop: 'createTime',
    id: 2,
    order: 2,
    checked: true,
    width: 227,
  }, {
    name: '报修科室',
    label: '报修科室',
    prop: 'deptIdToName',
    id: 3,
    order: 3,
    checked: true,
    width: 420,
  },
  {
    name: '报修人',
    label: '报修人',
    prop: 'user',
    id: 4,
    order: 4,
    checked: true,
    width: 119,
  },
  {
    name: '通话号码',
    label: '通话号码',
    prop: 'phone',
    id: 5,
    order: 5,
    checked: true,
    width: 162,
  }, {
    name: '服务台',
    label: '服务台',
    prop: 'receptionToName',
    id: 6,
    order: 6,
    checked: true,
    width: 119,
  },
  {
    name: '所找人员',
    label: '所找人员',
    prop: 'findUserToName',
    id: 7,
    order: 7,
    checked: true,
    width: 119,
  },
  {
    name: '录音',
    label: '录音',
    prop: 'recording',
    id: 8,
    order: 8,
    checked: true,
    width: 'auto',
  }
];
const CallRecordPhoneFindTableColumnKey = 'Ticket-service-desk-call-record-phone-find-table-column';
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
const TicketTableColumnKey = 'Ticket-service-desk-ticket-table-column';
const state = {
  callRecordTableColumn: getJSON(CallRecordTableColumnKey) || CALL_RECORD_COLUMN,
  callRecordPhoneFindTableColumn: getJSON(CallRecordPhoneFindTableColumnKey) || CALL_RECORD_PHONE_FIND_COLUMN,
  ticketTableColumn: getJSON(TicketTableColumnKey) || TICKET_TABLE_COLUMN,
  ticketRule: getJSON(TicketRuleKey) || TICKET_RULE,
  // 在线坐席人员信息
  onlineList: '暂未设置坐席人员',
  // 当前用户监听的电话列表
  phoneList: [],
  // websocket实例
  ws: null,
  // websocket连接状态 0-连接中 1-连接成功 2-断开连接 3-连接失败
  socketStatus: 0,
  // 坐席类型 人工坐席 ARTIFICIAL_SEAT 呼叫转移-CALL_DIVERT
  seatType: 'ARTIFICIAL_SEAT',
};
const mutations = {
  UPDATE_TICKET_RULE: (state, { ticketRule, }) => {
    state.ticketRule = ticketRule;
    setJSON(TicketRuleKey, ticketRule);
  },
  UPDATE_CALL_RECORD_COLUMN: (state, { callRecordTableColumn, }) => {
    state.callRecordTableColumn = callRecordTableColumn;
    setJSON(CallRecordTableColumnKey, callRecordTableColumn);
  },
  UPDATE_CALL_RECORD_PHONE_FIND_COLUMN: (state, { callRecordPhoneFindTableColumn, }) => {
    state.callRecordPhoneFindTableColumn = callRecordPhoneFindTableColumn;
    setJSON(CallRecordPhoneFindTableColumnKey, callRecordPhoneFindTableColumn);
  },
  UPDATE_TICKET_TABLE_COLUMN: (state, { ticketTableColumn, }) => {
    state.ticketTableColumn = ticketTableColumn;
    setJSON(TicketTableColumnKey, ticketTableColumn);
  },
  UPDATE_ONLINE_INFO: (state, onlineInfo) => {
    const { onlineInfoStr, selfPhone, } = onlineInfo;
    sessionStorageUtil.setJSON('mySeatPhone', selfPhone);
    state.onlineList = onlineInfoStr;
    state.phoneList = selfPhone;
  },
  UPDATE_CURRENT_PHONE_LIST: (state, phoneList) => {
    state.phoneList = phoneList;
  },
};
const actions = {
  UPDATE_TICKET_RULE: async ({ commit, }, ticketRule) => {
    commit('UPDATE_TICKET_RULE', { ticketRule, });
  },
  UPDATE_CALL_RECORD_COLUMN: async ({ commit, }, callRecordTableColumn) => {
    commit('UPDATE_CALL_RECORD_COLUMN', { callRecordTableColumn, });
    await ServiceDeskApi.updateTableColumn({ columns: JSON.stringify(callRecordTableColumn), type: 'callRecord', });
  },
  UPDATE_CALL_RECORD_PHONE_FIND_COLUMN: async ({ commit, }, callRecordPhoneFindTableColumn) => {
    commit('UPDATE_CALL_RECORD_PHONE_FIND_COLUMN', { callRecordPhoneFindTableColumn, });
    await ServiceDeskApi.updateTableColumn({ columns: JSON.stringify(callRecordPhoneFindTableColumn), type: 'callRecordPhoneFind', });
  },
  UPDATE_TICKET_TABLE_COLUMN: async ({ commit, }, ticketTableColumn) => {
    commit('UPDATE_TICKET_TABLE_COLUMN', { ticketTableColumn, });
    await ServiceDeskApi.updateTableColumn({ columns: JSON.stringify(ticketTableColumn), type: 'ticket', });
  },
  // 当前坐席变更
  UPDATE_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const onlineInfo = convertOnlineInfo(onlineInfoMap, rootState.login.userInfo.id);
    commit('UPDATE_ONLINE_INFO', onlineInfo);
  },
  // 初始化当前坐席
  INIT_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const { otherPhone, } = convertOnlineInfo(onlineInfoMap, rootState.login.userInfo.id);
    const storePhone = sessionStorageUtil.getJSON('mySeatPhone') || [];
    const selfPhone = storePhone.filter(item => !otherPhone.includes(item));
    return new Promise((resolve, reject) => {
      resolve(selfPhone);
    });
  },

};
function convertOnlineInfo(onlineInfoMap, selfId) {
  const mergedSamePhone = transform(onlineInfoMap, (result, value, key) => {
    (result[value] || (result[value] = [])).push(key);
  }, {});
  // 其它用户上线的坐席
  let otherPhone = [];
  // 自己的坐席
  let selfPhone = [];
  const onlineInfo = mapKeys(omit(mergedSamePhone, ['']), (value, key) => {
    if (Number(key) !== selfId) {
      otherPhone = [...otherPhone, ...value];
    } else {
      selfPhone = value || [];
    }
    return `${staffId(key)}(${value.join(', ')})`;
  });
  return { onlineInfoStr: keys(onlineInfo).join(', ') || '暂无在线坐席', otherPhone, selfPhone, };
}

export default {
  namespaced: true,
  namespace: 'ticketServiceDesk',
  state,
  mutations,
  actions,
};

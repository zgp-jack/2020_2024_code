/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 20:16:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-22 19:31:06
 * @Description:
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
const OrderRuleKey = 'Reportfault-center-order-rule';
// 默认简单表头
const NORMAL_TABLE_COLUMN = [{
  name: '类型',
  label: '类型',
  prop: 'type',
  id: 1,
  order: 1,
  checked: true,
  width: 164,
}, {
  name: '通话时间',
  label: '通话时间',
  prop: 'createTime',
  id: 2,
  order: 2,
  checked: true,
  width: 288,
}, {
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 3,
  order: 3,
  checked: true,
  width: 234,
},
{
  name: '报修人',
  label: '报修人',
  prop: 'user',
  id: 4,
  order: 4,
  checked: true,
  width: 164,
},
{
  name: '通话号码',
  label: '通话号码',
  prop: 'phone',
  id: 5,
  order: 5,
  checked: true,
  width: 183,
}, {
  name: '服务台',
  label: '服务台',
  prop: 'receptionToName',
  id: 6,
  order: 6,
  checked: true,
  width: 164,
},
{
  name: '关联工单',
  label: '关联工单',
  prop: 'linkedType',
  id: 7,
  order: 7,
  checked: true,
  width: 144,
},
{
  name: '录音',
  label: '录音',
  prop: 'recording',
  id: 8,
  order: 8,
  checked: true,
  width: 366,
}, {
  name: '处置类型',
  label: '处置类型',
  prop: 'dealType',
  id: 9,
  order: 9,
  checked: true,
  width: 144,
}];
const NormalTableColumnKey = 'Reportfault-center-normal-table-column';
const PhoneFindTableColumnKey = 'Reportfault-center-phone-find-table-column';
// 电话找人表头
const PhoneFindTableColumn = [{
  name: '类型',
  label: '类型',
  prop: 'type',
  id: 1,
  order: 1,
  checked: true,
  width: 164,
}, {
  name: '通话时间',
  label: '通话时间',
  prop: 'createTime',
  id: 2,
  order: 2,
  checked: true,
  width: 288,
}, {
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 3,
  order: 3,
  checked: true,
  width: 234,
},
{
  name: '报修人',
  label: '报修人',
  prop: 'user',
  id: 4,
  order: 4,
  checked: true,
  width: 164,
},
{
  name: '通话号码',
  label: '通话号码',
  prop: 'phone',
  id: 5,
  order: 5,
  checked: true,
  width: 183,
}, {
  name: '服务台',
  label: '服务台',
  prop: 'receptionToName',
  id: 6,
  order: 6,
  checked: true,
  width: 164,
},
{
  name: '所找人员',
  label: '所找人员',
  prop: 'findUserToName',
  id: 7,
  order: 7,
  checked: true,
  width: 144,
},
{
  name: '录音',
  label: '录音',
  prop: 'recording',
  id: 8,
  order: 8,
  checked: true,
  width: 366,
}];
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
const ComplexTableColumnKey = 'Reportfault-center-complex-table-column';
const state = {
  normalTableColumn: getJSON(NormalTableColumnKey) || NORMAL_TABLE_COLUMN,
  complexTableColumn: getJSON(ComplexTableColumnKey) || COMPLEX_TABLE_COLUMN,
  PhoneFindTableColumn: getJSON(PhoneFindTableColumnKey) || PhoneFindTableColumn,
  examineTableColumn: [{
    label: '紧急程度',
    prop: 'degree',
    width: 140,
    minWidth: 140,
    fixed: true,
  }, {
    label: '报修电话',
    prop: 'phone',
    width: 200,
    minWidth: 134,
    fixed: false,
  }, {
    label: '报修时间',
    prop: 'createTime',
    width: 249,
    minWidth: 122,
    fixed: false,
  }, {
    label: '报修科室',
    prop: 'deptIdToName',
    width: 200,
    minWidth: 135,
    fixed: false,
  }, {
    label: '故障分类',
    prop: 'faultType',
    width: 200,
    minWidth: 134,
    fixed: false,
  },
  {
    label: '故障描述',
    prop: 'faultRemark',
    width: 369,
    minWidth: 169,
    fixed: 'right',
  }],
  orderRule: getJSON(OrderRuleKey) || ORDER_RULE,
};
const mutations = {
  UPDATE_ORDER_RULE: (state, { orderRule, }) => {
    state.orderRule = orderRule;
    setJSON(OrderRuleKey, orderRule);
  },
  UPDATE_NORMAL_TABLE_COLUMN: (state, { normalTableColumn, }) => {
    state.normalTableColumn = normalTableColumn;
    setJSON(NormalTableColumnKey, normalTableColumn);
  },
  UPDATE_COMPLEX_TABLE_COLUMN: (state, { complexTableColumn, }) => {
    state.complexTableColumn = complexTableColumn;
    setJSON(ComplexTableColumnKey, complexTableColumn);
  },
  UPDATE_PHONE_FIND_TABLE_COLUMN: (state, { PhoneFindTableColumn, }) => {
    state.PhoneFindTableColumn = PhoneFindTableColumn;
    setJSON(PhoneFindTableColumnKey, PhoneFindTableColumn);
  },
};
const actions = {
  UPDATE_ORDER_RULE: async ({ commit, }, orderRule) => {
    commit('UPDATE_ORDER_RULE', { orderRule, });
  },
  UPDATE_NORMAL_TABLE_COLUMN: async ({ commit, }, normalTableColumn) => {
    commit('UPDATE_NORMAL_TABLE_COLUMN', { normalTableColumn, });
  },
  UPDATE_COMPLEX_TABLE_COLUMN: async ({ commit, }, complexTableColumn) => {
    commit('UPDATE_COMPLEX_TABLE_COLUMN', { complexTableColumn, });
  },
  UPDATE_PHONE_FIND_TABLE_COLUMN: async ({ commit, }, PhoneFindTableColumn) => {
    commit('UPDATE_PHONE_FIND_TABLE_COLUMN', { PhoneFindTableColumn, });
  },

};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};


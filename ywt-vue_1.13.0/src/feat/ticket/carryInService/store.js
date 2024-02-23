/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 14:15:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-23 17:06:05
 * @Description:
 */

import {
  getJSON,
} from '@/utils/localStorageUtil';
import DepartmentApi from '@/feat/system/department/api';

const CARRY_IN_SERVICE_COLUMN = [{
  name: '送修时间',
  label: '送修时间',
  prop: 'createTime',
  id: 1,
  order: 1,
  checked: true,
  width: 205,
},
{
  name: '报修科室',
  label: '报修科室',
  prop: 'deptIdToName',
  id: 2,
  order: 2,
  checked: true,
  width: 174,
},
{
  name: '设备名称',
  label: '设备名称',
  prop: 'deviceName',
  id: 3,
  order: 3,
  checked: true,
  width: 210,
},
{
  name: '序列号(S/N)',
  label: '序列号(S/N)',
  prop: 'deviceSerialNum',
  id: 4,
  checked: true,
  width: 170,
},
{
  name: '故障描述',
  label: '故障描述',
  prop: 'faultRemark',
  id: 5,
  checked: true,
  width: 174,
},
{
  name: '处理人',
  label: '处理人',
  prop: 'createUserToName',
  id: 6,
  checked: true,
  width: 119,
},
{
  name: '费用(元)',
  label: '费用(元)',
  prop: 'cost',
  id: 7,
  checked: true,
  width: 137,
},
{
  name: '状态',
  label: '状态',
  prop: 'currStateToName',
  id: 8,
  checked: true,
  width: 137,
}
];
const carryInServiceColumnKey = 'Ticket-carry-in-service-table-column';

const state = {
  carryInServiceColumn: getJSON(carryInServiceColumnKey) || CARRY_IN_SERVICE_COLUMN,
  // 厂家列表
  manufacturerList: [],
};

const mutations = {
  UPDATE_MANUFACTURER_LIST: (state, { list, }) => {
    state.manufacturerList = list;
  },
};
const actions = {
  UPDATE_MANUFACTURER_LIST: async ({ commit, }) => {
    const { list, } = await DepartmentApi.list({ pageNum: 0,
      state: 0,
      pageSize: 9999, operationGroup: 1, });
    commit('UPDATE_MANUFACTURER_LIST', { list, });
  },
};

export default {
  namespaced: true,
  namespace: 'ticketCarryInService',
  state,
  mutations,
  actions,
};

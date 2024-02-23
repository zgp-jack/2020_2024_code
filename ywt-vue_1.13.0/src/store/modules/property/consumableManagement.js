/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 15:48:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-22 16:09:15
 * @Description:耗材管理
 */
// 耗材入库表头
const DEPOSIT_TABLE_COLUMN = [{
  name: '入库单号',
  prop: 'serialNum',
}, {
  name: '入库时间',
  prop: 'createTime',
}, {
  name: '入库科室',
  prop: 'inDeptToName',
}, {
  name: '操作人',
  prop: 'createUserToName',
}, {
  name: '状态',
  prop: 'state',
}, {
  name: '审批人',
  prop: 'reviewUserToName',
}, {
  name: '审批时间',
  prop: 'reviewTime',
}, {
  name: '审批意见',
  prop: 'reviewRemark',
}];
// 耗材出库表头
const WITHDRAW_TABLE_COLUMN = [{
  name: '出库单号',
  prop: 'serialNum',
}, {
  name: '申请时间',
  prop: 'createTime',
}, {
  name: '转出科室',
  prop: 'outDeptToName',
}, {
  name: '转入科室',
  prop: 'inDeptToName',
}, {
  name: '申请人',
  prop: 'createUserToName',
}, {
  name: '状态',
  prop: 'state',
}, {
  name: '审批人',
  prop: 'reviewUserToName',
}, {
  name: '审批时间',
  prop: 'reviewTime',
}, {
  name: '审批意见',
  prop: 'reviewRemark',
}];
// 耗材申领表头
const RECEIVE_TABLE_COLUMN = [{
  name: '申领单号',
  prop: 'serialNum',
}, {
  name: '申请时间',
  prop: 'createTime',
}, {
  name: '申请科室',
  prop: 'applyDeptToName',
}, {
  name: '提供科室',
  prop: 'outDeptToName',
}, {
  name: '申请人',
  prop: 'createUserToName',
}, {
  name: '状态',
  prop: 'state',
}, {
  name: '审批人',
  prop: 'reviewUserToName',
}, {
  name: '审批时间',
  prop: 'reviewTime',
}, {
  name: '审批意见',
  prop: 'reviewRemark',
}];
const state = {
  depositTableColumn: DEPOSIT_TABLE_COLUMN,
  withdrawTableColumn: WITHDRAW_TABLE_COLUMN,
  receiveTableColumn: RECEIVE_TABLE_COLUMN,
};
const mutations = {};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};


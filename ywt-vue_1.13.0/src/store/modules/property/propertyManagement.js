/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-13 16:04:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-03 09:42:48
 * @Description: 资产管理
 */
// 台账管理表头
const LEDGER_TABLE_COLUMN = [{
  name: '资产编号',
  prop: 'assetsCode',
}, {
  name: '资产类型',
  prop: 'assetsTypeToName',
}, {
  name: '名称',
  prop: 'name',
}, {
  name: '规格型号',
  prop: 'model',
}, {
  name: '制作商',
  prop: 'manufacturerToName',
}, {
  name: '使用科室',
  prop: 'useDeptToName',
}, {
  name: '维护科室',
  prop: 'patrolDeptToName',
}, {
  name: '巡检模板',
  prop: 'patrolTemp',
}, {
  name: '巡检单元',
  prop: 'pertainUnitToName',
}];
// 资产转移表头
const TRANSFER_TABLE_COLUMN = [{
  name: '单号',
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
// 资产借用表头
const BORROW_TABLE_COLUMN = [{
  name: '单号',
  prop: 'serialNum',
}, {
  name: '申请时间',
  prop: 'createTime',
}, {
  name: '申请科室',
  prop: 'applyDeptToName',
},
{
  name: '申请人',
  prop: 'createUserToName',
},
{
  name: '联系电话',
  prop: 'phone',
}, {
  name: '预计归还时间',
  prop: 'backTime',
},
{
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
// 资产处置表头
const DISPOSALS_TABLE_COLUMN = [{
  name: '单号',
  prop: 'serialNum',
}, {
  name: '申请时间',
  prop: 'createTime',
}, {
  name: '申请科室',
  prop: 'applyDeptToName',
},
{
  name: '申请人',
  prop: 'createUserToName',
},
{
  name: '联系电话',
  prop: 'phone',
}, {
  name: '处置类型',
  prop: 'assetsMakeType',
},
{
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
  ledgerTableColumn: LEDGER_TABLE_COLUMN,
  transferTableColumn: TRANSFER_TABLE_COLUMN,
  borrowTableColumn: BORROW_TABLE_COLUMN,
  disposalsTableColumn: DISPOSALS_TABLE_COLUMN,
};
const mutations = {};
const actions = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

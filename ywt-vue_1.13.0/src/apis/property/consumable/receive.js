/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 11:08:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-22 16:52:27
 * @Description:耗材申领
 */

import Fetch from '@/utils/fetch';
/**
 * 耗材申领列表
 * @param {
 * state 状态筛选
 * outDept 转出科室
 * inDept 转入科室
 * applyDept 申请科室
 * isReview 是否是审核
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  state,
  outDept,
  inDept,
  applyDept,
  isReview,
} = {}) => Fetch.post('/bus/consumables/apply/page', {
  pageSize,
  pageNum,
  query,
  state,
  outDept,
  inDept,
  applyDept,
  isReview,
});
/**
 * 耗材申领保存
 * @param {
 *
 *  id 转移ID
 *  applyDept 申请科室
 *  outDept 提供科室
 *  phone 联系电话
 *  thingList 耗材列表(id:资产ID，num:数量)
 * } param0
 * @returns
 */
const save = ({
  id,
  applyDept,
  outDept,
  phone,
  thingList,
} = {}) => Fetch.post('/bus/consumables/apply/save', {
  id,
  applyDept,
  outDept,
  phone,
  thingList,
});
/**
 * 耗材出库提交
 * @param {
 *
 *  id 转移ID
 *  applyDept 申请科室
 *  outDept 提供科室
 *  phone 联系电话
 *  thingList 耗材列表(id:资产ID，num:数量)
 * } param0
 * @returns
 */
const submit = ({
  id,
  applyDept,
  outDept,
  phone,
  thingList,
}) => Fetch.post('/bus/consumables/apply/confirm', {
  id,
  applyDept,
  outDept,
  phone,
  thingList,
});
export default {
  list,
  save,
  submit,
};

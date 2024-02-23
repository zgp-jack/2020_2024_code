/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-17 17:37:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-22 16:50:48
 * @Description:入库管理
 */
import Fetch from '@/utils/fetch';
/**
 * 耗材入库列表
 * @param {
 *
 * isReview 是否是审核
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  state,
  inDept,
  applyDept,
  isReview,
} = {}) => Fetch.post('/bus/consumables/in/page', {
  pageSize,
  pageNum,
  query,
  state,
  inDept,
  applyDept,
  isReview,
});
/**
 * 耗材入库保存
 * @param {
 *
 *  id 转移ID
 *  applyDept 申请科室
 *  inDept 入库科室
 *  phone 联系电话
 *  thingList 耗材列表(id:资产ID，num:数量)
 * } param0
 * @returns
 */
const save = ({
  id,
  applyDept,
  inDept,
  phone,
  thingList,
} = {}) => Fetch.post('/bus/consumables/in/save', {
  id,
  applyDept,
  inDept,
  phone,
  thingList,
});
/**
 * 耗材入库提交
 * @param {
 *
 *  id 转移ID
 *  applyDept 申请科室
 *  inDept 入库科室
 *  phone 联系电话
 *  thingList 耗材列表(id:资产ID，num:数量)
 * } param0
 * @returns
 */
const submit = ({
  id,
  applyDept,
  inDept,
  phone,
  thingList,
}) => Fetch.post('/bus/consumables/in/confirm', {
  id,
  applyDept,
  inDept,
  phone,
  thingList,
});
export default {
  list,
  save,
  submit,
};

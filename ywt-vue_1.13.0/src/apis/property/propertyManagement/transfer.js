/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-13 10:48:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-16 16:56:15
 * @Description:资产转移
 */
import Fetch from '@/utils/fetch';
/**
 * 资产转移列表
 *
 * @param {
 *  isReview 是否是审核列表（1：是，0【默认】：否）
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  isReview = 0,
} = {}) => Fetch.post('/bus/assets/transfer/page', {
  pageSize,
  pageNum,
  query,
  isReview,
});
/**
 * 资产转移保存
 * @param {
 *
 * id 转移ID
 * transferReason 转移原因（字典：transferReason）
 * outDept 转出科室
 * inDept 转入科室
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * } param0
 * @returns
 */
const save = ({
  id,
  transferReason,
  outDept,
  inDept,
  phone,
  thingList,
} = {}) => Fetch.post('/bus/assets/transfer/save', {
  id,
  transferReason,
  outDept,
  inDept,
  phone,
  thingList,
});
/**
 * 资产转移提交
 * @param {
 *
 * id 转移ID
 * transferReason 转移原因（字典：transferReason）
 * outDept 转出科室
 * inDept 转入科室
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * applyDept 申请科室
 * } param0
 * @returns
 */
const submit = ({
  id,
  transferReason,
  outDept,
  inDept,
  phone,
  thingList,
  applyDept,
} = {}) => Fetch.post('/bus/assets/transfer/confirm', {
  id,
  transferReason,
  outDept,
  inDept,
  phone,
  thingList,
  applyDept,
});

export default {
  list,
  save,
  submit,
};

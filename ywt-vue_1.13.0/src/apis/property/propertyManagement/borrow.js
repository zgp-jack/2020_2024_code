/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-15 13:52:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-17 10:31:59
 * @Description:资产借用
 */
import Fetch from '@/utils/fetch';
/**
 * 资产借用列表
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
} = {}) => Fetch.post('/bus/assets/rent/page', {
  pageSize,
  pageNum,
  query,
  isReview,
});
/**
 * 资产借用保存
 * @param {
 *
 * id 借用ID
 * applyDept 申请科室
 * backTime 预计归还时间
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * outDept 来源，借出科室
 * } param0
 * @returns
 */
const save = ({
  id,
  applyDept,
  backTime,
  phone,
  outDept,
  thingList,
} = {}) => Fetch.post('/bus/assets/rent/save', {
  id,
  applyDept,
  backTime,
  phone,
  outDept,
  thingList,
});
/**
 * 资产借用提交
 * @param {
 *
 * id 借用ID
 * applyDept 申请科室
 * backTime 预计归还时间
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * outDept 来源，借出科室
 * } param0
 * @returns
 */
const submit = ({
  id,
  applyDept,
  backTime,
  phone,
  outDept,
  thingList,
} = {}) => Fetch.post('/bus/assets/rent/confirm', {
  id,
  applyDept,
  backTime,
  phone,
  outDept,
  thingList,
});

export default {
  list,
  save,
  submit,
};


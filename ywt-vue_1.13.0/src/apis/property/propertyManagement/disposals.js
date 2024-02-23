/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-15 15:10:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-15 16:59:48
 * @Description:资产处置
 */

import Fetch from '@/utils/fetch';
/**
 * 资产处置列表
 * @param {*
 *  isReview 是否是审核列表（1：是，0【默认】：否）
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  isReview = 0,
} = {}) => Fetch.post('/bus/assets/make/page', {
  pageSize,
  pageNum,
  query,
  isReview,
});
/**
 * 资产处置保存
 * @param {
 *
 * id 处置ID
 * applyDept 申请科室
 * assetsMakeType 处置类型（字典：assetsMakeType）
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * } param0
 * @returns
 */
const save = ({
  id,
  applyDept,
  assetsMakeType,
  phone,
  thingList,
} = {}) => Fetch.post('/bus/assets/make/save', {
  id,
  applyDept,
  assetsMakeType,
  phone,
  thingList,
});
/**
 * 资产处置提交
 * @param {
 *
 * id 借用ID
 * applyDept 申请科室
 * assetsMakeType 处置类型（字典：assetsMakeType）
 * phone 联系电话
 * thingList 资产列表(id:资产ID)
 * } param0
 * @returns
 */
const submit = ({
  id,
  applyDept,
  assetsMakeType,
  phone,
  thingList,
} = {}) => Fetch.post('/bus/assets/make/confirm', {
  id,
  applyDept,
  assetsMakeType,
  phone,
  thingList,
});

export default {
  list,
  save,
  submit,
};

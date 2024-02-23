/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-09 16:24:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-28 17:10:42
 * @Description:耗材管理
 */
import Fetch from '@/utils/fetch';
/**
 * 添加耗材
 * @param {
 * name 耗材名称（限定长度：50）
 * model 规格型号（限定长度：50）
 * unit 耗材单位（限定长度：20）
 * securityNum 安全库存（值域范围：0 - 1000000）
 * price 单价（值域范围：0 - 1000000，保留两位小数）
 * deptId 所在科室
 * supplier 供应商
 * remark 备注（限定长度：50）
 * } param0
 * @returns
 */
const create = ({
  name,
  model,
  unit,
  securityNum,
  price,
  deptId,
  supplier,
  remark,
} = {}) => Fetch.post('/bus/consumables/create', {
  name,
  model,
  unit,
  securityNum,
  price,
  deptId,
  supplier,
  remark,
});
/**
 * 添加耗材
 * @param {
 * id 耗材ID
 * name 耗材名称（限定长度：50）
 * model 规格型号（限定长度：50）
 * unit 耗材单位（限定长度：20）
 * securityNum 安全库存（值域范围：0 - 1000000）
 * price 单价（值域范围：0 - 1000000，保留两位小数）
 * deptId 所在科室
 * supplier 供应商
 * remark 备注（限定长度：50）
 * state 是否启用（0：否，1【默认】：是）
 * } param0
 * @returns
 */
const update = ({
  id,
  name,
  model,
  unit,
  securityNum,
  price,
  deptId,
  supplier,
  remark,
  state,
} = {}) => Fetch.post('/bus/consumables/update', {
  id,
  name,
  model,
  unit,
  securityNum,
  price,
  deptId,
  supplier,
  remark,
  state,
});
/**
 * 删除耗材
 */
const del = (id) => Fetch.post('/bus/consumables/delete', {
  id,
});
/**
 * 耗材列表(无数量)
 * @param {
 *  pageSize 每页显示条数
 *  pageNum 页码
 *  query 模糊查询
 *  deptId
 *  isShowReview 是否显示审核进行中的数据(1【默认】：是，0：否)
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  deptId,
  isShowReview,
  filterId,
} = {}) => Fetch.post('/bus/consumables/page', {
  pageSize,
  pageNum,
  query,
  deptId,
  isShowReview,
  filterId,
});
/**
 * 耗材列表(有数量)
 * @param {
 *  pageSize 每页显示条数
 *  pageNum 页码
 *  query 模糊查询
 *  deptId
 *  isShowReview 是否显示审核进行中的数据(1【默认】：是，0：否)
 * } param0
 * @returns
 */
const listWithNum = ({
  pageSize,
  pageNum,
  query,
  deptId,
  isShowReview,
} = {}) => Fetch.post('/bus/consumables/search', {
  pageSize,
  pageNum,
  query,
  deptId,
  isShowReview,
});
/**
 * 耗材详情
 * @param {*} id
 * @returns
 */
const detail = (id) => Fetch.post('/bus/consumables/get', {
  id,
});
/**
 * 入库申请-保存
 * @param {
 *
 *  id 转移ID
 *  applyDept 申请科室
 *  inDept 入库科室
 *  phone 联系电话
 *  thingList 耗材列表(id:资产ID，num:数量)
 * } param0
 */
const depositSave = ({
  id,
  applyDept,
  inDept,
  phone,
  thingList,
} = {}) => Fetch.post('', {
  id,
  applyDept,
  inDept,
  phone,
  thingList,
});
/**
 * 耗材变更详情
 * @param {*} id
 * @returns
 */
const changedDetail = (id) => Fetch.post('/bus/consumables/get/info', {
  id,
});
export default {
  create,
  update,
  del,
  list,
  listWithNum,
  detail,
  depositSave,
  changedDetail,

};

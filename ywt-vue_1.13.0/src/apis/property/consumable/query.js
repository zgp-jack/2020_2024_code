/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-22 14:06:29
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-22 14:32:03
 * @Description:库存查询
 */
import Fetch from '@/utils/fetch';
/**
 * 耗材库存查询列表
 * @param {
 *
 * deptId  所在科室
 * isShowReview 是否显示审核进行中的数据(1【默认】：是，0：否)
 * supplier 供应商
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
  deptId,
  supplier,
  isShowReview,
} = {}) => Fetch.post('/bus/consumables/search', {
  pageSize,
  pageNum,
  query,
  deptId,
  supplier,
  isShowReview,
});
export default {
  list,
};

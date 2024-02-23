/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-21 21:15:37
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-21 22:06:10
 * @Description:巡检记录
 */
import Fetch from '@/utils/fetch';
/**
 * 资产/部门类型分页
 * @param {
 *
 * assetsType
 * deptId
 * query
 * pageSize
 * pageNum
 * } param0
 * @returns
 */
const listByPropOrDept = ({
  assetsType,
  deptId,
  query,
  pageSize,
  pageNum,
  sortField,
  sort,
  frequencyUnit,
  sendUser,
}) => Fetch.post('/bus/inspection/history/assets/page', {
  assetsType,
  deptId,
  query,
  pageSize,
  pageNum,
  sortField,
  sort,
  frequencyUnit,
  sendUser,
});
/**
 * 巡检单元分页
 * @param {
 * unitFolder
*  unit
 * query
 * pageSize
 * pageNum
 * } param0
 * @returns
 */
const listByinspectionUnit = ({
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
  sortField,
  sort,
  frequencyUnit,
  sendUser,
} = {}) => Fetch.post('/bus/inspection/history/unit/page', {
  unitFolder,
  unit,
  query,
  pageSize,
  pageNum,
  sortField,
  sort,
  frequencyUnit,
  sendUser,
});

// 巡检记录导出
const exportList = (data) => Fetch.post('/bus/inspection/history/list/export', data);

export default {
  listByinspectionUnit,
  listByPropOrDept,
  exportList,
};

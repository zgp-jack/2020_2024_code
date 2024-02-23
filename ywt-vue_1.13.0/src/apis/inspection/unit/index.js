/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-17 16:42:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-28 18:57:50
 * @Description:单元
 */

import Fetch from '@/utils/fetch';
/**
 * 单元父级维护列表
 */
const parentList = () => Fetch.post('/bus/inspection/unit/list', {});
/**
 * 创建单元父级
 * @param {
 * name 单元名称
 * order 排序（数值越小越排在前面）
 * remark 备注
 *
 * } param0
 * @returns
 */
const createParent = ({
  name,
  order,
  remark,
} = {}) => Fetch.post('/bus/inspection/unit/save', {
  name,
  order,
  remark,
});
/**
 * 修改单元父级
 * @param {
 * id
 * name 单元名称
 * order 排序（数值越小越排在前面）
 * remark 备注
 * state 状态
 *
 * } param0
 * @returns
 */
const updateParent = ({
  id,
  name,
  state,
  order,
  remark,
} = {}) => Fetch.post('/bus/inspection/unit/update', {
  id,
  name,
  state,
  order,
  remark,
});
/**
 * 删除单元父级
 * @param {*} id
 * @returns
 */
const delParent = (id) => Fetch.post('/bus/inspection/unit/delete', {
  id,
});
/**
 * 单元树列表
 * @returns
 */
const tree = () => Fetch.post('/bus/inspection/unit/tree', {});
/**
 * 删除巡检单元
 * @param {*} id
 * @returns
 */
const deleleUnit = (id) => Fetch.post('/bus/inspection/plan/unit/delete', {
  id,
});
/**
 * 巡检单元解绑模板
 * @param {*} id
 * @returns
 */
const unbindTemp = (id) => Fetch.post('/bus/inspection/plan/unit/unbind', {
  inspectionUnit: id,
});
/**
 * 获取巡检单元详情
 * @param {*} id
 * @returns
 */
const detail = (id) => Fetch.post('/bus/inspection/plan/unit/info', {
  id,
});
/**
 * 新增巡检单元
 * @param {
 *
 * }
 * @returns
 */
const create = ({
  code,
  name,
  parentId,
  useDept,
  useUser,
  state,
  maintainDept,
  maintainUser,
  remark,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/bus/inspection/plan/unit/save', {
  code,
  name,
  parentId,
  useDept,
  useUser,
  state,
  maintainDept,
  maintainUser,
  remark,
  sendUser,
  sendTeam,
});
/**
 * 修改巡检单元
 */
const update = ({
  id,
  code,
  name,
  parentId,
  useDept,
  useUser,
  state,
  maintainDept,
  maintainUser,
  remark,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/bus/inspection/plan/unit/update', {
  id,
  code,
  name,
  parentId,
  useDept,
  useUser,
  state,
  maintainDept,
  maintainUser,
  remark,
  sendUser,
  sendTeam,
});
/**
 * 巡检单元绑定模板
 * @param {*} param0
 * @returns
 */
const bindInspTemp = ({
  inspectionUnit,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/bus/inspection/plan/unit/bind', {
  inspectionUnit,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendUser,
  sendTeam,
});
/**
 * 巡检单元绑定模板修改
 * @param {*} param0
 * @returns
 */
const updateBindedInspTemp = ({
  id,
  inspectionUnit,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/bus/inspection/plan/unit/bindUpdate', {
  id,
  inspectionUnit,
  tempId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  errorMake,
  isAllowance,
  allowanceTime,
  skipWeek,
  skipHoliday,
  startTime,
  endTime,
  details,
  sendDept,
  sendUser,
  sendTeam,
});
export default {
  parentList,
  createParent,
  updateParent,
  delParent,
  tree,
  deleleUnit,
  unbindTemp,
  detail,
  create,
  update,
  bindInspTemp,
  updateBindedInspTemp,
};

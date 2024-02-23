/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 10:46:28
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-30 17:05:36
 * @Description:科室管理API
 */
import Fetch from '@/utils/fetch';

/**
 * 获取科室列表
 * @param {*} {
 *  pageNum
 *  pageSize
 *  state
 *  parentId
 *  deptType 1代表院区 null 为普通科室包含院区
 *  isHideHospital 是否隐藏院区，（1、是，0,、否（默认））
 *  query 查询字段
 * operationGroup 是否厂家
 * }
 * @returns
 */
const departmentList = ({
  pageNum = 0,
  pageSize = 9999,
  state = null,
  parentId = null,
  deptType = null,
  isHideHospital = 0,
  query = null,
  operationGroup,
} = {}) => Fetch.post('/sysDept/getPage', {
  pageNum,
  pageSize,
  state,
  parentId,
  deptType,
  isHideHospital,
  query,
  operationGroup,
});
/**
 *  修改科室信息
 * @param {*} param0
 * @returns
 */
const update = ({
  id,
  deptName,
  deptPlace,
  hospital,
  deptCode,
  parentId,
  abbreviation,
  defaultUser,
  teamId,
  state,
  contacts,
} = {}) => Fetch.post('/sysDept/saveOrUpdate', {
  id,
  deptName,
  deptPlace,
  hospital,
  deptCode,
  parentId,
  abbreviation,
  defaultUser,
  teamId,
  state,
  contacts,
});
/**
 * 获取科室详情
 * @param {*} id
 * @returns
 */
const detail = (id) => Fetch.post('/sysDept/get', {
  id,
});
/**
 * 新增科室
 * @returns
 */
const create = ({
  contacts,
  deptName,
  deptPlace,
  deptCode,
  parentId,
  hospital,
  state,
}) => Fetch.post('/sysDept/saveOrUpdate', {
  contacts,
  deptName,
  deptPlace,
  deptCode,
  parentId,
  hospital,
  state,
});
/**
 * 删除科室
 */
const deleteDepartment = (id) => Fetch.post('/sysDept/delete', {
  id,
});

/** ** 院区管理 *******/
/**
 * 创建院区
 */
const createHospital = ({
  deptName,
  abbreviation,
  state,
  orderNum,
  operationGroup,
} = {}) => Fetch.post('/sysDept/hospital/saveOrUpdate', {
  deptName,
  abbreviation,
  state,
  orderNum,
  operationGroup,
});
/**
 * 更新院区
 */
const updateHospital = ({
  id,
  deptName,
  abbreviation,
  state,
  orderNum,
  operationGroup,
} = {}) => Fetch.post('/sysDept/hospital/saveOrUpdate', {
  id,
  deptName,
  abbreviation,
  state,
  orderNum,
  operationGroup,
});
const qrcode = (deptId) => Fetch.post('/sysDept/qrcode', {
  deptId,
});
/**
 * 查询有运维小组的科室
 */
const deptsHasTeam = () => Fetch.post('/web/v2/get/system/department/has-team', {});
export default {
  list: departmentList,
  update,
  detail,
  create,
  delete: deleteDepartment,
  createHospital,
  updateHospital,
  qrcode,
  deptsHasTeam,
};

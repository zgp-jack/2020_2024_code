/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-27 19:11:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-15 13:58:03
 * @Description:用户管理API
 */
import Fetch from '@/utils/fetch';

/**
 * 创建用户
 */
const create = ({
  name,
  userName,
  mblNo,
  state,
  password,
} = {}) => Fetch.post('/sysManager/saveOrUpdate', {
  name,
  userName,
  mblNo,
  state,
  password,
});
/**
 * 更新用户
 */
const update = ({
  id,
  name,
  userName,
  mblNo,
  state,
  password,
} = {}) => Fetch.post('/sysManager/saveOrUpdate', {
  id,
  name,
  userName,
  mblNo,
  state,
  password,
});
/**
 * 删除用户
 */
const deleteEngineer = (id) => Fetch.post('/sysManager/delete', {
  id,
});
/**
 * 停用用户
 */
const lock = (id) => Fetch.post('/sysManager/lock', {
  id,
});
/**
 * 启用用户
 */
const unlock = (id) => Fetch.post('/sysManager/unlock', {
  id,
});
/**
 * 重置密码
 */
const resetPwd = (id) => Fetch.post('/sysManager/resetPwdByAdmin', {
  id,
});

/**
 * 用户添加权限
 * @param {*}
 * @returns
 */
const addRole = ({
  roleId,
  userId,
  deptId,
  state,
  startDate,
  endDate,
  orderNum,
  primary,
} = {}) => Fetch.post('/sysManager/saveRole', {
  roleId,
  userId,
  state,
  deptId,
  startDate,
  endDate,
  primary,
  orderNum,
});
/**
 *  用户删除权限
 * @param {} id 权限id
 * @returns
 */
const deleteRole = (id) => Fetch.post('/sysManager/deleteRole', {
  id,
});
/**
 * 用户详情
 */
const detail = (id) => Fetch.post('/sysManager/get', {
  id,
});
/**
 * 通过电话号码获取用户详情
 * @param {String} phone
 */
const detailByPhone = (phone) => Fetch.post('/sysPhone/getInfoByPhoneNum', {
  phoneNum: phone,
});
/**
 * 用户修改权限
 * @param {*}
 * @returns
 */
const updateRole = ({
  id,
  roleId,
  userId,
  deptId,
  state,
  startDate,
  endDate,
  orderNum,
  primary,
} = {}) => Fetch.post('/sysManager/updateRole', {
  id,
  roleId,
  userId,
  deptId,
  state,
  startDate,
  endDate,
  orderNum,
  primary,
});
/**
 * 查询用户拥有的权限列表
 * @param {*} id
 * @returns
 */
const roleList = (id) => Fetch.post('/sysManager/get', {
  id,
});
/**
 * 获取用户列表
 * @param
 * @returns
 */
const list = ({
  pageNum = 0,
  pageSize = 9999,
  deptId = null,
  deptNo = null,
  states = '1,0,-1',
  query = null,

} = {}) => Fetch.post('/sysManager/getPage', {
  pageNum,
  pageSize,
  deptId,
  states,
  deptNo,
  query,
});
/**
 * 获取用户列表-建单数据
 * 主要用于渲染下拉组件
 */
const simpleList = ({
  pageNum = 0,
  pageSize = 9999,

} = {}) => Fetch.post('/sysDept/getUser2', {
  pageNum,
  pageSize,
});
/**
 *
 * @returns 获取所有用户标注在岗
 */
const groupedList = () => Fetch.post('/sysManager/list/teamUser', {});
/**
 * 用户电话维护(新增或修改)
 * @param  {
 *  deptId 所在科室
 *  phone 报修人电话
 *  name 报修人姓名
 * }
 */
const maintainPhone = ({
  deptId,
  phone,
  name,
}) => Fetch.post('/sysManager/phoneManager', {
  deptId,
  phone,
  name,
});
// 查询报修信息必填项配置
const getRepairConfig = ({
  parentType = 'mandatory', // 后端让写死
}) => Fetch.post('/sys/sysconfiguration/selectByParentType', {
  parentType,
});

export default {
  create,
  update,
  delete: deleteEngineer,
  detail,
  detailByPhone,
  lock,
  unlock,
  resetPwd,
  addRole,
  deleteRole,
  updateRole,
  list,
  simpleList,
  roleList,
  groupedList,
  maintainPhone,
  getRepairConfig,
};

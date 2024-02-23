/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-27 16:25:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-18 11:09:52
 * @Description: 角色管理API
 */
import Fetch from '@/utils/fetch';
/**
 * 创建角色
 * orderNum 排序号
 * roleName 角色名
 * deptId 所属科室
 * actions 操作权限，逗号分割
 * menus 菜单权限，逗号分割
 * subscriptions 订阅权限，逗号分割
 */
const create = ({
  orderNum,
  roleName,
  deptId,
  actions,
  menus,
  subscriptions,
} = {}) => Fetch.post('/sysRole/save', {
  orderNum,
  roleName,
  deptId,
  actions,
  menus,
  subscriptions,
});
/**
 * 更新角色
 * id
 * orderNum 排序号
 * roleName 角色名
 * deptId 所属科室
 * actions 操作权限，逗号分割
 * menus 菜单权限，逗号分割
 * subscriptions 订阅权限，逗号分割
 */
const update = ({
  id,
  orderNum,
  roleName,
  deptId,
  actions,
  menus,
  subscriptions,
} = {}) => Fetch.post('/sysRole/update', {
  id,
  orderNum,
  roleName,
  deptId,
  actions,
  menus,
  subscriptions,
});
/**
 * 删除角色
 */
const deleteRole = (id) => Fetch.post('/sysRole/delete', {
  id,
});
/**
 * 获取角色详情
 */
const detail = (id) => Fetch.post('/sysRole/get', {
  id,
});
/**
 * 获取角色列表
 * @param {*} {
 *  state
 *  pageNum
 *  pageSize
 *  parentId
 *  query
 * }
 */
const list = ({
  state = 1,
  pageNum = 0,
  pageSize = 9999,
  deptNo = null,
  query = null,
  deptId = null,
} = {}) => Fetch.post('/sysRole/getPage', {
  state,
  pageNum,
  pageSize,
  deptNo,
  query,
  deptId,
});
/**
 * 获取操作权限列表
 */
const permissionList = () => Fetch.post('/security/permission/list', {});
export default {
  create,
  update,
  delete: deleteRole,
  detail,
  list,
  permissionList,
};

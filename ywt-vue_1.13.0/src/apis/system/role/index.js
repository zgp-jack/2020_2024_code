/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-19 14:38:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-08 18:06:13
 * @Description: 角色
 */
import Fetch from '@/utils/fetch';
import request from '@/utils/request';
// 新增或修改角色
export function createOrUpdateRole(data) {
  return request({
    url: '/sysRole/saveOrUpdate',
    method: 'post',
    data,
  });
}
// 新增角色
export function createRole(data) {
  return request({
    url: '/sysRole/save',
    method: 'post',
    data,
  });
}
// 修改角色
export function updateRole(data) {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data,
  });
}
// 删除角色
export function deleteRole(id) {
  return request({
    url: '/sysRole/delete',
    method: 'post',
    data: {
      id,
    },
  });
}
// 通过科室id获取角色分页列表
export function getRoleListByDeptId(deptNo, pageSize, pageNum) {
  return request({
    url: '/sysRole/getPage',
    method: 'post',
    data: {
      deptNo,
      pageSize,
      pageNum,
    },
  });
}
// 获取菜单列表
export function getMenuList() {
  return request({
    url: '/sysMenu/getList',
    method: 'post',
    data: {},
  });
}

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
const getRoleList = ({
  state = 1,
  pageNum = 0,
  pageSize = 9999,
  deptNo = null,
  query = null,
} = {}) => Fetch.post('/sysRole/getPage', {
  state,
  pageNum,
  pageSize,
  deptNo,
  query,
});
/**
 * 获取角色信息
 * @param {*} id
 * @returns
 */
const getRole = (id) => Fetch.post('/sysRole/get', { id, });
/**
 * 获取按钮权限列表
 * @returns
 */
const permissionList = () => Fetch.post('/security/permission/list', {});
export default {
  list: getRoleList,
  role: getRole,
  permissionList,
};

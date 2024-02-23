import request from '@/utils/request';

// 获取所有菜单树状列表
export function getTree() {
  return request({
    url: '/sysDept/getDeptTreeForAdm',
    method: 'post',
    data: {},
  });
}

// 获取所有菜单树状列表 超级管理员用
export function getDeptTreeForAdmin({ id, }) {
  return request({
    url: '/sysDept/getDeptTreeForAdmin',
    method: 'post',
    data: { id, },
  });
}

// 获取指定父部门下的菜单树状列表
export function getPage({ parentId, pageNum, pageSize, }) {
  return request({
    url: '/sysDept/getPage',
    method: 'post',
    data: { parentId, pageNum, pageSize, },
  });
}

// 删除部门
export function deleteDept({ id, }) {
  return request({
    url: '/sysDept/delete',
    method: 'post',
    data: { id, },
  });
}

// 获取单个部门信息
export function getDept({ id, }) {
  return request({
    url: '/sysDept/get',
    method: 'post',
    data: { id, },
  });
}
// 保存部门信息
export function saveOrUpdate(data) {
  return request({
    url: '/sysDept/saveOrUpdate',
    method: 'post',
    data,
  });
}

// 获取部门中的用户
export function getUser(pageNum, pageSize, deptId,) {
  return request({
    url: '/sysDept/getUser',
    method: 'post',
    data: { pageNum, pageSize, deptId, },
  });
}

/**
 * 获取所有部门列表
 */
export function getAllDepartmentList(parentId) {
  return request({
    url: '/sysDept/getList',
    method: 'post',
    data: {
      // parentId: parentId,
    },
  });
}
/**
 * 获取部门的树形菜单
 */
export function getTreeDepartmentList(id) {
  return request({
    url: 'sysDept/getDeptTree',
    method: 'post',
    data: { id, } || {},
  });
}

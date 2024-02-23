import request from '@/common/utils/request';

export function logout() {
  return request.get(`/logout`);
}
/* 获取部门角色 */
export function getDeptRoleList() {
  return request.get(`/system/user/profile/dept/role`);
}
/* 修改密码 */
export function updatePwd(data) {
  return request.put('/system/user/profile/updatePwd', data);
}
/* 修改部门角色 */
export function updateDeptRole(id) {
  return request.put(`/system/user/profile/role/${id}`);
}

// 获得消息
export function getMsgCount() {
  return request.get(`/system/message/getCount`);
}

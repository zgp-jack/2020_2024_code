import request from '@/common/utils/request';

const getList = ({
  userName,
  nickName,
  phonenumber,
  deptName,
  beginTime,
  endTime,
  pageSize,
  pageNum,
  status,
  deptId,
} = {}) => request.get('/system/user/list', {
  params: {
    userName,
    nickName,
    phonenumber,
    deptName,
    beginTime,
    endTime,
    pageSize,
    pageNum,
    status,
    deptId,
  },
});

/* 查询用户授权角色 */
export const getUserRoleSelect = ({
  pageSize,
  pageNum,
  userId,
  roleName,
  roleKey,
} = {}) => request.get('/system/user/authRole/getUserRoleList', {
  params: {
    pageSize,
    pageNum,
    userId,
    roleName,
    roleKey,
  },
});

/* 查询用户授权角色 */
export const getUserRoles = (userId) => request.get('/system/user/userRoles', {
  params: {
    userId,
  },
});

const changeStatus = (data) => request.put('/system/user/changeStatus', data);

const add = (data = {}) => request.post('/system/user', data);

const edit = (data = {}) => request.put('/system/user', data);

/* 重置密码 */
const resetPwd = (data = {}) => request.put('/system/user/resetPwd', data);

const del = (userIds) => request.delete(`/system/user/${userIds}`, {});

const getUserDetail = (userId) => request.get(`/system/user/${userId}`);

/**
 * 获取用户缓存
 */
const getCachedList = () => request.get('/system/user/cache');
/**
 * 获取分组人员信息
 */
const getTeamUserList = () => request.get('/system/team/getSysTeamUser');

/**
 * 获取部门小组用户数据
 */
const getDepTeamUserList = () => request.get('/sys/common/dept/team/user');

/**
 * 根据电话获取用户信息
 */
const phoneGetUserInfo = (phoneNum) => request.get(`/system/user/info/${phoneNum}`);

/**
 * 用户导入
 */
const userImport = '/system/user/import/data';
/**
 * 用户导入模版
 */
const userImportTemplate = () => request.get('/system/user/import/template', {
  responseType: 'blob',
});

/**
 * 获取基础用户列表
 */
const getUserAllList = () => request.get('/system/user/list/all');

/**
 * 查询授权角色
 */
const getAuthRole = (userId) => request.get(`/system/user/authRole/${userId}`);

const updateAuthRole = (data) => request.put('/system/user/authRole', data);

const unBind = (data) => request.put('/system/user/unbind', data);

export default {
  getList,
  getUserDetail,
  changeStatus,
  add,
  edit,
  del,
  getCachedList,
  getTeamUserList,
  getDepTeamUserList,
  phoneGetUserInfo,
  userImport,
  userImportTemplate,
  getUserAllList,
  resetPwd,
  getAuthRole,
  updateAuthRole,
  unBind,
};

import request from '@/common/utils/request';

/**
 * 角色管理列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
const getRoleList = ({
  admin,
  createBy,
  createTime,
  // 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限）
  dataScope,
  // 删除标志（0代表存在 2代表删除）
  delFlag,
  // 部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ）
  deptCheckStrictly,
  deptIds,
  flag,
  // 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）
  menuCheckStrictly,
  menuIds,
  permissions,
  remark,
  // 角色ID
  roleId,
  // 角色权限
  roleKey,
  // 角色名称
  roleName,
  // 角色排序
  roleSort,
  searchValue,
  // 角色状态（0正常 1停用）
  status,
  updateBy,
  updateTime,
  beginTime,
  endTime,
  pageNum,
  pageSize,
} = {}) => request.get('/system/role/list', {
  params: {
    admin,
    createBy,
    createTime,
    dataScope,
    delFlag,
    deptCheckStrictly,
    deptIds,
    flag,
    menuCheckStrictly,
    menuIds,
    permissions,
    remark,
    roleId,
    roleKey,
    roleName,
    roleSort,
    searchValue,
    status,
    updateBy,
    updateTime,
    beginTime,
    endTime,
    pageNum,
    pageSize,
  },
});

// 修改角色
const updateRole = (params = {
  createBy: '',
  createTime: '',
  /**
   * 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限）
   */
  dataScope: '',
  /**
   * 删除标志（0代表存在 2代表删除）
   */
  delFlag: '',
  /**
   * 部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ）
   */
  deptCheckStrictly: '',
  deptIds: '',
  flag: '',
  /**
   * 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）
   */
  menuCheckStrictly: '',
  menuIds: '',
  params: '',
  permissions: '',
  remark: '',
  /**
   * 角色ID
   */
  roleId: '',
  /**
   * 角色权限
   */
  roleKey: '',
  /**
   * 角色名称
   */
  roleName: '',
  /**
   * 角色排序
   */
  roleSort: '',
  /**
   * 角色状态（0正常 1停用）
   */
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.put('/system/role', params);

// 新增角色
const addRole = (params = {
  createBy: '',
  createTime: '',
  /**
   * 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限）
   */
  dataScope: '',
  /**
   * 删除标志（0代表存在 2代表删除）
   */
  delFlag: '',
  /**
   * 部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ）
   */
  deptCheckStrictly: '',
  deptIds: '',
  flag: '',
  /**
   * 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）
   */
  menuCheckStrictly: '',
  menuIds: '',
  params: '',
  permissions: '',
  remark: '',
  /**
   * 角色ID
   */
  roleId: '',
  /**
   * 角色权限
   */
  roleKey: '',
  /**
   * 角色名称
   */
  roleName: '',
  /**
   * 角色排序
   */
  roleSort: '',
  /**
   * 角色状态（0正常 1停用）
   */
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.post('/system/role', params);

/**
 *  批量选择用户授权
 */
const authUserAll = (params = {
  grantUserList: [
    {
      deptId: '',
      userId: '',
    },
  ], roleId: '',
}) => request.post('/system/role/authUser/selectAll', params);

// 状态修改
const changeStatus = (params = {
  /**
   * 角色ID
   */
  roleId: '',
  /**
   * 角色状态（0正常 1停用）
   */
  status: '',
}) => request.put('/system/role/changeStatus', params);

// 修改数据权限
const updateDataScope = (params = {
  admin: '',
  createBy: '',
  createTime: '',
  // 数据范围（1：所有数据权限；2：自定义数据权限；3：本部门数据权限；4：本部门及以下数据权限；5：仅本人数据权限）
  dataScope: '',
  // 删除标志（0代表存在 2代表删除）
  delFlag: '',
  // 部门树选择项是否关联显示（0：父子不互相关联显示 1：父子互相关联显示 ）
  deptCheckStrictly: '',
  deptIds: '',
  flag: '',
  // 菜单树选择项是否关联显示（ 0：父子不互相关联显示 1：父子互相关联显示）
  menuCheckStrictly: '',
  menuIds: '',
  permissions: '',
  remark: '',
  // 角色ID
  roleId: '',
  // 角色权限
  roleKey: '',
  // 角色名称
  roleName: '',
  // 角色排序
  roleSort: '',
  searchValue: '',
  // 角色状态（0正常 1停用）
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.put('/system/role/dataScope', params);

// 删除角色
const deleteRole = (roleIds) => request.delete(`/system/role/${roleIds}`);
// 角色详情
const getRoleDetail = (roleId) => request.get(`/system/role/${roleId}`);

// 菜单列表
const getMenuList = (params = {
  component: '',
  createBy: '',
  createTime: '',
  icon: '',
  isCache: '',
  isFrame: '',
  menuId: '',
  menuName: '',
  menuType: '',
  orderNum: '',
  parentId: '',
  parentName: '',
  path: '',
  perms: '',
  query: '',
  remark: '',
  searchValue: '',
  status: '',
  updateBy: '',
  updateTime: '',
  visible: '',
}) => request.get('/system/menu/list', { params, });

// 菜单树形列表
const getMenuListTree = (params = {
  component: '',
  createBy: '',
  createTime: '',
  icon: '',
  isCache: '',
  isFrame: '',
  menuId: '',
  menuName: '',
  menuType: '',
  orderNum: '',
  parentId: '',
  parentName: '',
  path: '',
  perms: '',
  query: '',
  remark: '',
  searchValue: '',
  status: '',
  updateBy: '',
  updateTime: '',
  visible: '',
}) => request.get('/system/menu/treeselect', { params, });

// 部门列表
const getDeptList = (params = {
  ancestors: '',
  createBy: '',
  createTime: '',
  delFlag: '',
  deptId: '',
  deptName: '',
  email: '',
  leader: '',
  orderNum: '',
  parentId: '',
  parentName: '',
  phone: '',
  remark: '',
  searchValue: '',
  status: '',
  updateBy: '',
  updateTime: '',
}) => request.get('/system/dept/list', { params, });

// 根据角色查对应的菜单
const getMenuByRole = (roleId) => request.get(`/system/menu/roleMenu/${roleId}`);

// 查询已分配用户角色列表
const getAssignedUserRoleList = (params = { roleId: '', }) => request.get('/system/role/authUser/allocatedList', { params, });

// 未分配角色的用户列表
const getNotAssignedUserRoleList = (params = { roleId: '', }) => request.get('/system/role/authUser/unallocatedList', { params, });

// 批量选择用户授权
const multipleAuthorization = (params = {
  grantUserList: [
    {
      userId: '',
    },
  ],
  roleId: '',
}) => request.put('/system/role/authUser/selectAll', params);
// 批量取消授权用户
const multipleCancelAuthorization = (params = {
  grantUserList: [
    {
      deptId: '',
      userId: '',
    },
  ],
  roleId: '',
}) => request.put('/system/role/authUser/cancelAll', params);

export default {
  getRoleList,
  updateRole,
  addRole,
  authUserAll,
  changeStatus,
  updateDataScope,
  deleteRole,
  getRoleDetail,
  getMenuList,
  getMenuListTree,
  getDeptList,
  getMenuByRole,
  getAssignedUserRoleList,
  getNotAssignedUserRoleList,
  multipleAuthorization,
  multipleCancelAuthorization,
};

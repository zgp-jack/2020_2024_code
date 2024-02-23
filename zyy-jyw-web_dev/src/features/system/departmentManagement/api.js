import request from '@/common/utils/request.js';

/**
 * 删除部门
 */
const deleteDepartment = (deptId) => request.delete(`/system/dept/${deptId}`);

/**
 * 科室详情
 */
const getDepartmentDetail = (deptId) => request.get(`/system/dept/${deptId}`);

/**
 * 科室列表
 * @returns {Promise<AxiosResponse<any>>}
 */
const getDepartmentList = (params = {
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
}) => request.get('/system/dept/list', {
  params: params,
});

/**
 * 新增科室
 * @param deptName
 * @param orderNum
 * @param parentId
 * @param status
 * @returns {Promise<AxiosResponse<any>>}
 */
const addDepartment = ({
  // 部门名称
  deptName,
  // 显示排序
  orderNum,
  // 上级科室
  parentId,
  // 部门状态 0正常,1停用
  status,
  // 科室地址
  deptPlace,
}) => request.post('/system/dept', {
  deptName,
  orderNum,
  parentId,
  status,
  deptPlace,
});

/**
 * 修改科室
 * @param deptId
 * @param deptName
 * @param orderNum
 * @param parentId
 * @param status
 * @returns {Promise<AxiosResponse<any>>}
 */
const updateDepartment = ({ deptId,
  deptName,
  orderNum,
  parentId,
  status,
  deptPlace,
}) => request.put('/system/dept',
  { deptId, deptName, orderNum, parentId, status, deptPlace, });
/**
 * 获取科室缓存
 */
const getCachedList = () => request.get('/system/dept/cache');

const assetPrint = (ids) => request.get(`/system/dept/print/${ids}`);

export default {
  addDepartment,
  getDepartmentList,
  deleteDepartment,
  getDepartmentDetail,
  updateDepartment,
  getCachedList,
  assetPrint,
};

import request from '@/common/utils/request';

// 新增第三方
const addThird = ({
  //  联系人
  contact,
  //  部门编号
  deptCode,
  //  部门名称
  deptName,
  //  部门地址
  deptPlace,
  //  备注
  deptRemark,
} = {}) => request.post('/system/third', {
  contact,
  deptCode,
  deptName,
  deptPlace,
  deptRemark,
});
// 修改第三方
const updateThird = (data) => request.put('/system/third', data);

// 获取第三方列表
const getThirdList = (params) => request.get('/system/third/list', {
  params,
});

// 获取第三房详情
const getThirdDetail = (deptId) => request.get(`/system/third/${deptId}`);

// 删除第三方
const delThird = (deptId) => request.delete(`/system/third/${deptId}`);

export default {
  addThird,
  updateThird,
  getThirdList,
  getThirdDetail,
  delThird,
};

import request from '@/common/utils/request';

const getList = ({
  pageNum,
  pageSize,
  // 审核结果(0待审核 1驳回 2通过)
  auditState,
  // 申请时间结束
  createEndTime,
  // 申请时间开始
  createStartTime,
  // 申请人
  createUser,
  // 申请科室
  inDept,
} = {}) => request.post('/ast/claim/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
  inDept,
});
// 详情
const getDetail = (id) => request.get(`/ast/claim/${id}`);

// 申领
const apply = ({
  // 申请科室
  inDept,
  // 备注
  remark,
  // 申领耗材目录
  reserveList,
} = {}) => request.post(`/ast/claim`, {
  // 申请科室
  inDept,
  // 备注
  remark,
  // 申领耗材目录
  reserveList,
});

// 撤销
const revoke = (id) => request.delete(`/ast/claim/${id}`);

export default {
  getList,
  getDetail,
  apply,
  revoke,
};

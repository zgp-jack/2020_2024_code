import request from '@/common/utils/request';
// 分页查询
const getList = ({
  pageNum,
  pageSize,
  // 审核状态(0未审核,1驳回,2已完成)
  auditState,
  // 申请时间结束
  createEndTime,
  // 申请时间开始
  createStartTime,
  // 申请人
  createUser,
} = {}) => request.post('/ast/dispose/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
});

// 处置详情
const getDetail = (id) => request.get(`/ast/dispose/${id}`);

// 撤销
const revoke = (id) => request.delete(`/ast/dispose/${id}`);

// 处置申请
const disposal = ({
  astList,
  reason,
} = {}) => request.post('/ast/dispose', {
  astList,
  reason,
});

export default {
  getList,
  getDetail,
  revoke,
  disposal,
};

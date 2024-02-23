import request from '@/common/utils/request';

// 分页查询
const getList = ({
  pageNum,
  pageSize,
  // 申请时间结束
  createEndTime,
  // 申请时间开始
  createStartTime,
  // 申请人
  createUser,
  // 出借科室
  outDept,
  // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
  state,
} = {}) => request.post('/ast/borrow/list', {
  pageNum,
  pageSize,
  createEndTime,
  createStartTime,
  createUser,
  outDept,
  state,
});

// 归还
const assetReturn = ({
  // 借出科室
  id,
  // 归还日期
  returnDate,
  // 归还人电话
  returnPhone,
  // 归还备注
  returnRemark,
  // 归还人
  returnUser,
} = {}) => request.put('/ast/borrow/return', {
  id,
  returnDate,
  returnPhone,
  returnRemark,
  returnUser,
});
// 借用详情
const borrowDetail = (id) => request.get(`/ast/borrow/${id}`);

// 撤销
const revoke = (id) => request.delete(`/ast/borrow/${id}`);

// 借用申请
const borrowApplication = ({
  // 借用资产集合
  astList,
  // 预计归还日期
  estimateReturnDate,
  // 联系电话
  inPhone,
  // 联系人
  inUser,
  // 借出科室
  outDept,
  // 借用原因
  reason,
} = {}) => request.post('/ast/borrow', {
  astList,
  estimateReturnDate,
  inPhone,
  inUser,
  outDept,
  reason,
});

export default {
  getList,
  assetReturn,
  borrowDetail,
  revoke,
  borrowApplication,
};

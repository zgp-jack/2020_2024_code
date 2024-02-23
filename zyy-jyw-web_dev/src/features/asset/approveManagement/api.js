import request from '@/common/utils/request';
// 资产转移-审核-分页查询
const getAssetTransferList = ({
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
  // 转出科室
  outDept,
} = {}) => request.post('/ast/transfer/audit/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
  outDept,
});
// 资产转移-审核-通过
const assetTransferAuditPass = (ids) => request.put('/ast/transfer/audit/pass', ids);
// 资产转移-审核-驳回
const assetTransferAuditReject = ({ id, remark, } = {}) => request.put('/ast/transfer/audit/rejected', {
  id,
  remark,
});
// 资产借用-审核-分页查询
const getAssetBorrowList = ({
  pageNum,
  pageSize,
  // 申请时间结束
  createEndTime,
  // 申请时间开始
  createStartTime,
  // 申请人
  createUser,
  // 借入科室
  inDept,
  // 借用状态(1:待审核,2:驳回,3:待归还,4:已归还)
  state,
  keyword,

} = {}) => request.post('/ast/borrow/audit/list', {
  pageNum,
  pageSize,
  createEndTime,
  createStartTime,
  createUser,
  inDept,
  state,
  keyword,
});
// 资产借用-审核-通过
const assetBorrowAuditPass = (ids) => request.put('/ast/borrow/audit/pass', ids);
// 资产借用-审核-驳回
const assetBorrowAuditReject = ({ id, remark, } = {}) => request.put('/ast/borrow/audit/rejected', { id, remark, });

// 资产处置-审核-分页查询
const getAssetDisposalList = ({
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

} = {}) => request.post('/ast/dispose/audit/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
});
// 资产处置-审核-通过
const assetDisposalAuditPass = (ids) => request.put('/ast/dispose/audit/pass', ids);
// 资产处置-审核-驳回
const assetDisposalAuditReject = ({ id, remark, } = {}) => request.put('/ast/dispose/audit/reject', {
  id,
  remark,
});

// 耗材申领-列表
const getConsumableList = ({
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
} = {}) => request.post('/ast/claim/audit/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
  inDept,
});
// 耗材申领-通过
const consumableAuditPass = (ids) => request.put('/ast/claim/audit/pass', ids);
// 耗材申领-驳回
const consumableAuditReject = ({ id, remark, } = {}) => request.put('/ast/claim/audit/reject', {
  id,
  remark,
});

export default {
  getAssetTransferList,
  assetTransferAuditPass,
  assetTransferAuditReject,
  getAssetBorrowList,
  assetBorrowAuditPass,
  assetBorrowAuditReject,
  getAssetDisposalList,
  assetDisposalAuditPass,
  assetDisposalAuditReject,
  getConsumableList,
  consumableAuditPass,
  consumableAuditReject,
};

import request from '@/common/utils/request';

/**
 * 资产转移分页查询
 * @param pageNum
 * @param pageSize
 * @param auditState
 * @param createEndTime
 * @param createStartTime
 * @param createUser
 * @param outDept
 * @returns {Promise<AxiosResponse<any>>}
 */
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
  // 转出科室
  outDept,
} = {}) => request.post('/ast/transfer/list', {
  pageNum,
  pageSize,
  auditState,
  createEndTime,
  createStartTime,
  createUser,
  outDept,
});

/**
 * 转移申请
 * @param astList
 * @param outDept
 * @param reason
 * @returns {Promise<AxiosResponse<any>>}
 */
const transferApplication = ({
  // 转移资产集合
  astList,
  // 转出科室
  outDept,
  // 转移原因
  reason,
} = {}) => request.post('/ast/transfer', {
  astList,
  outDept,
  reason,
});

// 资产转移-审核-通过
const pass = (id) => request.put(`/ast/transfer/audit/pass`);

// 资产转移-审核-驳回
const reject = ({ id, remark, } = {}) => request.put('/ast/transfer/audit/rejected', {
  params: {
    id,
    remark,
  },
});
// 转移申请详情
const assetTransferDetail = (id) => request.get(`/ast/transfer/${id}`);
// 转移申请撤销
const revoke = (id) => request.delete(`/ast/transfer/${id}`);

export default {
  getList,
  transferApplication,
  pass,
  reject,
  assetTransferDetail,
  revoke,
};

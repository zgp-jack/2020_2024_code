import Request from '@/common/utils/request';

const handleRepair = ({
  keywords,
  repairStartTime,
  repairEndTime,
  createStartTime,
  createEndTime,
  createUserList, // 建单人
  hospitalList,
  createUser,
  currState,
  degree,
  deptId,
  faultRemark,
  makeUser,
  orderNum,
  phone,
  rangeType,
  reception,
  source,
  pageNum,
  pageSize,
} = {}) => Request.post(`/obstacles/agent/handleRepair`, {
  keywords,
  repairStartTime,
  repairEndTime,
  createStartTime,
  createEndTime,
  createUserList,
  hospitalList,
  createUser,
  currState,
  degree,
  deptId,
  faultRemark,
  makeUser,
  orderNum,
  phone,
  rangeType,
  reception,
  source,
  pageNum,
  pageSize,
});
// 分页查询 待报修工单-待派单
const waitDispatch = ({
  createInfoEndDate,
  createInfoStartDate,
  createUserList,
  degree,
  hospitalList,
  keyword,
  makeUserList,
  orderState,
  rangeType,
  serverUserList,
  source,
  temp,
  pageNum,
  pageSize,
} = {}) => Request.post(`/obstacles/agent/waitDispatch?pageNum=${pageNum}&pageSize=${pageSize}`, {
  createInfoEndDate,
  createInfoStartDate,
  createUserList,
  degree,
  hospitalList,
  keyword,
  makeUserList,
  orderState,
  rangeType,
  serverUserList,
  source,
  temp,
});
// 分页查询 待报修工单-待建单
const waitCreate = ({
  createInfoEndDate,
  createInfoStartDate,
  dealType,
  keyword,
  temp,
  userList,
  hospitalList,
  pageNum,
  pageSize,
} = {}) => Request.post(`/obstacles/agent/waitCreate?pageNum=${pageNum}&pageSize=${pageSize}`, {
  createInfoEndDate,
  createInfoStartDate,
  dealType,
  keyword,
  temp,
  userList,
  hospitalList,
});
// 审核通过
const pass = (orderNums) => Request.get('/obstacles/order/enact', {
  params: { orderNums, },
});
// 审核驳回
const reject = (params = {
  // 工单号
  orderNum: '',
  // 驳回说明
  rejectDescribe: '',
  // 驳回原因
  rejectReason: '',
}) => Request.post('/obstacles/order/reject', params);
export default {
  handleRepair,
  waitDispatch,
  waitCreate,
  pass,
  reject,
};

import Request from '@/common/utils/request';
/**
 * 通话记录查询
 */
const callRecordList = ({
  createInfoEndDate,
  createInfoStartDate,
  dealType,
  keyword,
  temp,
  userList,
  hospitalList,
  pageNum,
  pageSize,
} = {}) => Request.post(`/obstacles/server/callPage?pageNum=${pageNum}&pageSize=${pageSize}`, {
  createInfoEndDate,
  createInfoStartDate,
  dealType,
  keyword,
  temp,
  userList,
  hospitalList,
});
/**
 * 红点数据
 */
const redInfo = ({
  createInfoEndDate,
  createInfoStartDate,
} = {}) => Request.post('/obstacles/server/count', {
  createInfoEndDate,
  createInfoStartDate,
});
/**
 * 工单列表查询
 */
const list = ({
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
} = {}) => Request.post(`/obstacles/server/page?pageNum=${pageNum}&pageSize=${pageSize}`, {
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
/**
 * 获取分机号列表
 */
const extensionList = () => Request.get('/obstacles/server/seat/phone');
/**
 * 通话记录关联的工单列表
 */
const callRecordLinkedTicketList = () => Request.get('');
/**
 * 通话记录关联工单
 */
const linkTicket = ({
  ticketId,
  callRecordId,
  linkedType,
} = {}) => Request.put('/obstacles/server/link', {
  orderNum: ticketId,
  id: callRecordId,
  linkedType,
});
/**
 * 获取服务台人员列表
 */
const receptionList = () => Request.get('/obstacles/server/serverUserList');
// 查询服务台科室报修历史工单
const getHistoryByDeptId = (data) => Request.get('/obstacles/server/getHistoryByDeptId', {
  params: {
    deptId: data,
  },
});
const Repeat = (params) => Request.put('/obstacles/server/repeat', params);
const LinkApi = (params) => Request.put('/obstacles/server/link', params);
export default {
  callRecordList,
  redInfo,
  list,
  extensionList,
  callRecordLinkedTicketList,
  linkTicket,
  receptionList,
  getHistoryByDeptId,
  Repeat,
  LinkApi,
};

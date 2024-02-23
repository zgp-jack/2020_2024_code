import request from '@/common/utils/request';

// 获取待审核的数据列表
const getMyToBeReviewedList = (params = {
  pageNum: 1,
  pageSize: 10,
  // 完成结束时间(yyyy-MM-dd)
  completeEndTime: '',
  // 完成开始时间(yyyy-MM-dd)
  completeStartTime: '',
  // 科室ID
  departmentId: '',
  // 报修结束时间(yyyy-MM-dd)
  endTime: '',
  // 故障分类
  faultType: '',
  // 关键字
  keywords: '',
  // 处理人Id
  makeUserId: '',
  // 报修开始时间(yyyy-MM-dd）
  startTime: '',
}) => request.post('/obstacles/order/pagePending', params);

// 获取以审核的数据列表
const getMyReviewedList = (params = {
  pageNum: '', pageSize: '',
  // 完成结束时间(yyyy-MM-dd)
  completeEndTime: '',
  // 完成开始时间(yyyy-MM-dd)
  completeStartTime: '',
  // 审核结束时间(yyyy-MM-dd)
  examineEndTime: '',
  // 审核开始时间(yyyy-MM-dd)
  examineStartTime: '',
  // 关键字
  keywords: '',
  // 审核状态：end_examine通过；no_examine驳回
  processValue: '',
}) => request.post('/obstacles/order/pageProcessed', params);

// 审核通过
const pass = (orderNums) => request.get('/obstacles/order/enact', {
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
}) => request.post('/obstacles/order/reject', params);

// 查询全部工单
const getAllOrder = (params = {
  // 建单结束时间(yyyy-MM-dd)
  createEndTime: '',
  // 建单开始时间(yyyy-MM-dd)
  createStartTime: '',
  // 建单人id
  createUserId: '',
  // 科室ID
  departmentId: '',
  // 关键字
  keywords: '',
  // 处理人ID
  makeUserId: '',
  // 影响范围
  rangeType: '',
  // 坐席人ID
  receptionUserId: '',
  // 报修结束时间(yyyy-MM-dd)
  repairEndTime: '',
  // 报修开始时间(yyyy-MM-dd)
  repairStartTime: '',
  // 工单来源
  source: '',
  pageNum: 1,
  pageSize: 10,
}) => request.post('/obstacles/order/page', params);

export default {
  getMyToBeReviewedList,
  getMyReviewedList,
  pass,
  reject,
  getAllOrder,
};

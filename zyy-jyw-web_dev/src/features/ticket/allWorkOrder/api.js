import request from '@/common/utils/request';

// 查询全部工单
const queryAllWorkOrder = ({
  pageNum,
  pageSize,
  // 建单结束时间(yyyy-MM-dd)
  createEndTime,
  // 建单开始时间(yyyy-MM-dd)
  createStartTime,
  // 建单人id
  createUserId,
  // 科室ID
  departmentId,
  // 关键字
  keywords,
  // 处理人ID
  makeUserId,
  // 影响范围
  rangeType,
  // 坐席人ID
  receptionUserId,
  // 报修结束时间(yyyy-MM-dd)
  repairEndTime,
  // 报修开始时间(yyyy-MM-dd)
  repairStartTime,
  // 工单来源
  source,
  // 故障类型
  currState,
} = {}) => request.post('/obstacles/order/pageAllOrder', {
  pageNum,
  pageSize,
  // 建单结束时间(yyyy-MM-dd)
  createEndTime,
  // 建单开始时间(yyyy-MM-dd)
  createStartTime,
  // 建单人id
  createUserId,
  // 科室ID
  departmentId,
  // 关键字
  keywords,
  // 处理人ID
  makeUserId,
  // 影响范围
  rangeType,
  // 坐席人ID
  receptionUserId,
  // 报修结束时间(yyyy-MM-dd)
  repairEndTime,
  // 报修开始时间(yyyy-MM-dd)
  repairStartTime,
  // 工单来源
  source,
  // 故障类型
  currState,
});
export default {
  queryAllWorkOrder,
};

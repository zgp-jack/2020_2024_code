/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-30 09:55:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-01-10 10:35:43
 * @Description:统计分析-工单API
 */
import Fetch from '@/utils/fetch';

/**
 * 工单完成率
 * @param {String } queryType 1.按人员 2.按小组 3.按供应商
 */
const completionRatio = ({
  startDate,
  endDate,
  queryType,
} = {}) => Fetch.post('/bus/statistics/orderCompleteRatio', {
  startDate,
  endDate,
  queryType,
});
/**
 * 常见故障Top5
 */
const commonFaultTopFive = ({
  startDate,
  endDate,
} = {}) => Fetch.post('/bus/statistics/commonFaultTopFive', {
  startDate,
  endDate,
});
/**
 * 报修科室TOP5
 */
const deptRepairTopFive = ({
  startDate,
  endDate,
} = {}) => Fetch.post('/bus/statistics/deptRepairTopFive', {
  startDate,
  endDate,
});
/**
 * 服务台
 */
const serviceDeskList = ({
  startDate,
  endDate,
  pageSize,
  pageNum,
  type,
} = {}) => Fetch.post('/bus/statistics/workPage', {
  startDate,
  endDate,
  pageSize,
  pageNum,
  type,
});

/**
 * 报修量分析
 */
const ticketCountList = ({
  queryDate,
  queryType,
  timeType,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/analysisRepairQuantity', {
  queryDate,
  queryType,
  timeType,
  pageSize,
  pageNum,
});
/**
 *临床满意度分析
 */
const clinicalSatisfaction = ({
  startDate,
  endDate,
  queryType,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/satisfaction', {
  startDate,
  endDate,
  queryType,
  pageSize,
  pageNum,
});
/**
 *知识库统计
 */
const knowledgeBase = ({
  startDate,
  endDate,
  queryType,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/knowledgeBase', {
  startDate,
  endDate,
  queryType,
  pageSize,
  pageNum,
});
/**
 *知识库引用统计
 */
const knowledgeBaseRef = ({
  startDate,
  endDate,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/knowledgeBaseQuote', {
  startDate,
  endDate,
  pageSize,
  pageNum,
});
/**
 * 工单响应分析
 */
const serviceResponse = ({
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/getOrderResponseList', {
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
});
/**
 * 服务时效性
 */
const serviceTimeliness = ({
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/getResponseLevelList', {
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
});
/**
 *  服务台导出excel
 * @returns
 */
const serviceExportExcel = ({
  startDate,
  endDate,
  type,
} = {}) => Fetch.post('/bus/statistics/workPageExportExcel', {
  startDate,
  endDate,
  type,
});

/**
 * 报修量分析 导出Excel
 */
const ticketExportExcel = ({
  queryDate,
  queryType,
  timeType,
} = {}) => Fetch.post('/bus/statistics/analysisRepairQuantityExport', {
  queryDate,
  queryType,
  timeType,
});
/**
 * 服务时效性 导出Excel
 */
const serviceTimelinessExportExcel = ({
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
}) => Fetch.post('/bus/statistics/getResponseLevelListExport', {
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
});

/**
 * 服务响应分析 导出Excel
 */
const serviceResponseExportExcel = ({
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/bus/statistics/OrderResponseListExport', {
  startTime,
  endTime,
  template,
  pageSize,
  pageNum,
});
/**
 * 临床满意度分析导出Excel
 * @param {*} param0
 * @returns
 */
const clinicalSatisfactionExportExcel = ({ startDate, endDate, queryType, } = {}) => Fetch.post('/bus/statistics/satisfactionExport', { startDate, endDate, queryType, });

/**
 * 知识库统计导出Excel
 */
const knowledgeBaseExportExcel = ({ startDate, endDate, queryType, } = {}) => Fetch.post('/bus/statistics/knowledgeBaseExport', { startDate, endDate, queryType, });

/**
 * 知识库引用统计Excel导出
 */
const knowledgeBaseRefExportExcel = ({ startDate, endDate, } = { }) => Fetch.post('/bus/statistics/knowledgeBaseQuoteExport', { startDate, endDate, });

/**
 * 故障报修量统计
 */
const faultRepairCount = ({
// * 排序方向
  direction,
  // * 结束时间
  endTime,
  // * 主键
  id,
  // * 排序列
  orderBy,
  orderByAndDirection,
  // * 当前页
  pageNum,
  // * 每页多少条
  pageSize,
  // * 开始时间
  startTime,
  // * 类型 1按院区 2按小组 3按人员
  type,
} = { }) => Fetch.post('/bus/statistics/order/work/page', { direction,
  endTime,
  id,
  orderBy,
  orderByAndDirection,
  pageNum,
  pageSize,
  startTime,
  type, });

/**
 * 故障报修工作量下穿
 */
const faultReportWorkloadList = ({
  // * 排序方向
  direction,
  // * 结束时间
  endTime,
  // * 主键
  id,
  // * 排序列
  orderBy,
  orderByAndDirection,
  // * 当前页
  pageNum,
  // * 每页多少条
  pageSize,
  // * 开始时间
  startTime,
  // * 类型 1按院区 2按小组 3按人员
  type,
  // 状态 1接听 2建单 3电话解决 4派单 5工单完成 6超时完成 7未建单 8未派单 9未接单 10 未完成 11接听电话好评 12接听电话自评 13处理速度好评 14处理速度自评 15处理效果好评 16处理效果自评
  status,
} = { }) => Fetch.post('/bus/statistics/order/work/record/page', {
  direction,
  endTime,
  id,
  orderBy,
  orderByAndDirection,
  pageNum,
  pageSize,
  startTime,
  status,
  type,
});

/**
   * 故障报修工作量统计导出
   */
const faultRepairCountExport = ({
  //  结束时间
  endTime,
  //  主键
  id,
  //  开始时间
  startTime,
  //  状态 1接听 2建单 3电话解决 4派单 5工单完成 6超时完成 7未建单 8未派单 9未接单 10 未完成 11接听电话好评 12接听电话自评 13处理速度好评
  status,
  //  类型 1按院区 2按小组 3按人员
  type,
} = { }) => Fetch.post('/bus/statistics/order/work/page/export', {
  endTime,
  id,
  startTime,
  status,
  type,
});

/**
 * 故障报修工作量下穿导出
 */
const faultReportWorkloadListExport = ({
  //  结束时间
  endTime,
  //  主键
  id,
  //  开始时间
  startTime,
  //  状态 1接听 2建单 3电话解决 4派单 5工单完成 6超时完成 7未建单 8未派单 9未接单 10 未完成 11接听电话好评 12接听电话自评 13处理速度好评
  status,
  //  类型 1按院区 2按小组 3按人员
  type,
} = { }) => Fetch.post('/bus/statistics/order/work/record/page/export', {
  endTime,
  id,
  startTime,
  status,
  type,
});

export default {
  completionRatio,
  commonFaultTopFive,
  deptRepairTopFive,
  serviceDeskList,
  ticketCountList,
  clinicalSatisfaction,
  knowledgeBase,
  knowledgeBaseRef,
  serviceResponse,
  serviceTimeliness,
  serviceExportExcel,
  ticketExportExcel,
  serviceTimelinessExportExcel,
  serviceResponseExportExcel,
  clinicalSatisfactionExportExcel,
  knowledgeBaseExportExcel,
  knowledgeBaseRefExportExcel,
  faultRepairCountExport,
  faultRepairCount,
  faultReportWorkloadList,
  faultReportWorkloadListExport,

};


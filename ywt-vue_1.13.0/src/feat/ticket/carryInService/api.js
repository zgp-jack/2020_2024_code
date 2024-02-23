/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 14:15:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-31 09:46:42
 * @Description:送修管理API
 */
import Fetch from '@/utils/fetch';
/**
 * 送修管理列表
 * @param {String} query 关键字
 * @param {String} startTime 送修开始时间
 * @param {String} endTime 送修结束时间
 * @param {Number} deptId 送修结束时间
 * @param {String} deviceType 设备分类
 * @param {String} currState 状态
 */
const list = ({
  query,
  startTime,
  endTime,
  deptId,
  deviceType,
  currState,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/busRepairInfo/getRepairPage', {
  query,
  startTime,
  endTime,
  deptId,
  deviceType,
  currState,
  pageSize,
  pageNum,
});
/**
 * 新增送修
 *
 */
const createCarryInService = ({
  repairType,
  repairUser,
  receiveDept,
  repairPhone,
  receiveUser,
  receivePhone,
  deviceNum,
  deviceName,
  deviceType,
  deviceModel,
  deviceSerialNum,
  deviceData,
  deviceRemark,
  deptId,
  deptUser,
  phone,
  deptPlace,
  faultRemark,
  bidsFlag,
  manufacturerInfos,
  quoteEndTime,
  pickUpTime,
  remark,
  enclosure,

} = {}) => Fetch.post('/busRepairInfo/saveRepair', {
  repairType,
  repairUser,
  receiveDept,
  repairPhone,
  receiveUser,
  receivePhone,
  deviceNum,
  deviceName,
  deviceType,
  deviceModel,
  deviceSerialNum,
  deviceData,
  deviceRemark,
  deptId,
  deptUser,
  phone,
  deptPlace,
  faultRemark,
  bidsFlag,
  manufacturerInfos,
  quoteEndTime,
  pickUpTime,
  remark,
  enclosure,
});
/**
 * 厂家取走
 */
const manufacturerTakeAway = ({
  repairId,
  takeAwayUser,
  phone,
  takeAwayTime,
  remark,
  enclosure,
} = {}) => Fetch.post('/repairTakeAway/takeWay', {
  repairId,
  takeAwayUser,
  phone,
  takeAwayTime,
  remark,
  enclosure,
});
/**
 * 厂家报价
 */
const manufacturerQuotedPrice = ({
  repairId,
  manufacturedId,
  quoteUser,
  quoteTime,
  quoteMoney,
  approvalUser,
  remark,
  enclosure,
} = {}) => Fetch.post('/repairManufacturer/manufacturerQuote', {
  repairId,
  manufacturedId,
  quoteUser,
  quoteTime,
  quoteMoney,
  approvalUser,
  remark,
  enclosure,
});
/**
 * 报价确认
 */
const confirmQuotePrice = ({
  repairId,
  manufacturerId,
  repairFlag,
  quoteEnterUser,
  manufacturerAuthorize,
  phone,
  selectTime,
  settlementMethod,
  bidEvaluateUser,
  sendDept,
  deptPlace,
  receiveUser,
  receivePhone,
  enclosure,
  remark,
} = {}) => Fetch.post('/repairManufacturer/quoteConfirm', {
  repairId,
  manufacturerId,
  repairFlag,
  quoteEnterUser,
  manufacturerAuthorize,
  phone,
  selectTime,
  settlementMethod,
  bidEvaluateUser,
  sendDept,
  deptPlace,
  receiveUser,
  receivePhone,
  enclosure,
  remark,
});
/**
 * 送修详情
 */
const detail = (repairId) => Fetch.post('/busRepairInfo/getRepairInfoById', {
  repairId,
});
/**
 * 结束邀标
 */
const endBids = (repairId) => Fetch.post('/busRepairInfo/endBids', {
  repairId,
});
/**
 * 接收处置
 */
const receiveRepair = ({
  id,
  bidsFlag,
  pickUpTime,
  quoteEndTime,
  remark,
  enclosure,
  manufacturerInfos,
  repairType,
} = {}) => Fetch.post('/busRepairInfo/receiveRepair', {
  id,
  bidsFlag,
  pickUpTime,
  quoteEndTime,
  remark,
  enclosure,
  manufacturerInfos,
  repairType,
});
/**
 * 报价审核
 */
const examineQuotePrice = ({
  repairId,
  bidResult,
  manufacturerId,
  selectTime,
  remark,
  abandonedBid,
  manufacturerAuthorizer,
  phone,
  quoteEndTime,
  manufacturerInfos,
  bidEvaluateUser,
  repairFlag,
  failReason,
  forwardUser,
  enclosure,
} = {}) => Fetch.post('/repairManufacturer/quoteConfirm', {
  repairId,
  bidResult,
  manufacturerId,
  selectTime,
  remark,
  abandonedBid,
  manufacturerAuthorizer,
  phone,
  quoteEndTime,
  manufacturerInfos,
  bidEvaluateUser,
  repairFlag,
  failReason,
  forwardUser,
  enclosure,
});
/**
 * 确认送回科室
 */
const confirmSendBackToDepartment = ({
  repairId,
  sendDeptId,
  sendDeptPlace,
  receiveUser,
  receivePhone,
} = {}) => Fetch.post('/busRepairSendDept/choseDept', {
  repairId,
  sendDeptId,
  sendDeptPlace,
  receiveUser,
  receivePhone,
});
/**
 * 送回确认
 */
const confirmSendBack = ({
  repairId,
  repairResult,
  deviceData,
  invoiceFlag,
  invoiceType,
  invoiceNum,
  invoiceEnclosure,
  testReportFlag,
  testReportEnclosure,
  remark,
  process,
  faultReason,
  enclosure,
  maintenanceItem,
  continueRepairFlag,
  settlementMethod,
  deviceState,
  returnUser,
  returnTime,
} = {}) => Fetch.post('/busRepairReturn/sendBackConfirm', {
  repairId,
  repairResult,
  deviceData,
  invoiceFlag,
  invoiceType,
  invoiceNum,
  invoiceEnclosure,
  testReportFlag,
  testReportEnclosure,
  remark,
  process,
  faultReason,
  enclosure,
  maintenanceItem,
  continueRepairFlag,
  settlementMethod,
  deviceState,
  returnUser,
  returnTime,
});
/**
 * 送回处置
 */
const dealSendBack = ({
  repairId,
  reclaimType,
  deliveryUser,
  deliveryPhone,
  changeManufacturerFlag,
  manufacturerInfos,
  pickUpTime,
} = {}) => Fetch.post('/repairDeptReclaim/addrDeptReclaim', {
  repairId,
  reclaimType,
  deliveryUser,
  deliveryPhone,
  changeManufacturerFlag,
  manufacturerInfos,
  pickUpTime,
});
/**
 * 暂停
 */
const suspend = (repairId) => Fetch.post('/busRepairInfo/suspend', {
  repairId,
});
/**
 * 终止
 */
const terminate = ({
  repairId,
  reason,
  remark,
} = {}) => Fetch.post('/busRepairInfo/termination', {
  repairId,
  reason,
  remark,
});
/**
 * 开启暂停
 */
const openSuspended = (repairId) => Fetch.post('/busRepairInfo/open', {
  repairId,
});
/**
 * 放弃维修
 */
const abandonRepair = ({
  repairId,
  reason,
  remark,
} = {}) => Fetch.post('/busRepairInfo/giveUpRepair', {
  repairId,
  reason,
  remark,
});
/**
 * 结束报价
 */
const endQuotePrice = (repairId) => Fetch.post('/busRepairInfo/endBids', {
  repairId,
});
/**
 * 催报
 */
const urgeQuotePrice = ({
  repairId,
  manufacturerId,
} = {}) => Fetch.post('/repairManufacturer/reminder', {
  repairId,
  manufacturerId,
});
/**
 * 中标厂家候选列表
 */
const candidateManufacturerList = (repairId) => Fetch.post('busRepairInfo/getRepairManufacturer', {
  repairId,
});
/**
 * 流标处理
 */
const dealFailureTender = ({
  repairId,
  auctionsFailed,
  manufacturerInfos,
  giveUpReason,
  quoteEndTime,
  pickUpTime,
} = {}) => Fetch.post('/repairManufacturer/outflowBidDeal', {
  repairId,
  auctionsFailed,
  manufacturerInfos,
  giveUpReason,
  quoteEndTime,
  pickUpTime,
});
/**
 * 维修历史
 */
const maintenanceHistory = (deviceNum) => Fetch.post('/busRepairInfo/repairHistory', {
  deviceNum,
});
/**
 * 处理流程
 */
const processFlow = (repairId) => Fetch.post('/repairProcess/getRepairProcess', {
  repairId,
});
export default {
  list,
  detail,
  createCarryInService,
  manufacturerTakeAway,
  manufacturerQuotedPrice,
  confirmQuotePrice,
  endBids,
  receiveRepair,
  examineQuotePrice,
  confirmSendBackToDepartment,
  confirmSendBack,
  dealSendBack,
  suspend,
  openSuspended,
  terminate,
  abandonRepair,
  endQuotePrice,
  urgeQuotePrice,
  candidateManufacturerList,
  dealFailureTender,
  maintenanceHistory,
  processFlow,
};

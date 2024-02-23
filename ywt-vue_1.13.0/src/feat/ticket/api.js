/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 15:38:52
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-26 15:50:24
 * @Description:工单API(主要包含各种操作)
 */
import Fetch from '@/utils/fetch';

/**
 * 创建工单
 */
const create = ({
  responseType,
  rangeType,
  degree,
  sendType,
  faultRemark,
  faultType,
  createUser,
  reqTime,
  source,
  actualRepairPlace,
  needTime,
  equipment,
  info,
  learningId,
  sendUser,
  sendTeam,
  completeTime,
  enclosure,
  appointment,
  equipmentAddressId,
  orderCreateTime,
} = {}) => Fetch.post('/busOrderFault/createOrder', {
  responseType,
  rangeType,
  degree,
  sendType,
  faultRemark,
  faultType,
  createUser,
  reqTime,
  source,
  actualRepairPlace,
  needTime,
  equipment,
  info,
  learningId,
  sendUser,
  sendTeam,
  completeTime,
  enclosure,
  appointment,
  equipmentAddressId,
  orderCreateTime,
});
/**
 * 分派工单(派单)
 * @param {String} ticketId 工单编号
 * @param {Number} sendUser 人员id
 * @param {Number} sendTeam 小组id
 * @param {Boolean} isReDispatch 是否重派
 */
const dispatch = ({
  ticketId,
  sendUser,
  sendTeam,
  isReDispatch = false,
} = {}) => Fetch.post('/wechat/order/send', {
  orderNum: ticketId,
  sendUser,
  sendTeam,
  againOrder: isReDispatch,
});
/**
 * 接单
 */
const accept = (orderNum) => Fetch.post('/wechat/order/receiving', {
  orderNum,
});
/**
 * 退单，退回服务台
 * @param {String} ticketId 工单编号
 * @param {String} processValue 退回原因
 * @param {String} remark 详细说明
 */
const sendBack = ({
  ticketId,
  remark,
  processValue,
} = {}) => Fetch.post('/wechat/order/reback', {
  orderNum: ticketId,
  remark,
  processValue,
});
/**
 * 处理完成工单
 */
const complete = ({
  orderNum,
  actualRepairPlace,
  faultType,
  faultRemark,
  makeWay,
  processEnclosure,
  realTime,
  makeTime,
  equipment,
  equipmentAddress,
  equipmentAddressId,
} = {}) => Fetch.post('/wechat/order/new/complete', {
  orderNum,
  actualRepairPlace,
  faultType,
  faultRemark,
  makeWay,
  processEnclosure,
  realTime,
  makeTime,
  equipment,
  equipmentAddress,
  equipmentAddressId,
});
/**
 * 处理工单
 * @param {String} ticketId 工单编号
 * @param {String} remark 处理过程
 * @param {JSON} processEnclosure 附件
 */
const deal = ({
  ticketId,
  remark,
  processEnclosure,
  makeTime,
} = {}) => Fetch.post('/wechat/order/makeing', {
  orderNum: ticketId,
  remark,
  processEnclosure,
  makeTime,
});
/**
 * 暂停工单
 */
const suspend = ({
  ticketId,
  remark,
  processEnclosure,
  processValue,
  makeTime,
} = {}) => Fetch.post('/wechat/order/suspend', {
  orderNum: ticketId,
  remark,
  processEnclosure,
  processValue,
  makeTime,
});
/**
 * 暂停开启
 */
const openSuspended = (orderNum) => Fetch.post('/wechat/order/open', {
  orderNum,
});
/**
 * 终止工单
 */
const terminate = ({
  ticketId,
  remark,
  processEnclosure,
  processValue,
  makeTime,
} = {}) => Fetch.post('/wechat/order/termination', {
  orderNum: ticketId,
  remark,
  processEnclosure,
  processValue,
  makeTime,
});
/**
 * 终止重启
 */
const restartTerminated = (orderNum) => Fetch.post('/wechat/order/restart', {
  orderNum,
});
/**
 * 转交工单
 */
const transfer = ({
  ticketId,
  remark,
  processValue,
  sendUser,
  sendTeam,
  makeTime,
} = {}) => Fetch.post('/wechat/order/redirect', {
  orderNum: ticketId,
  remark,
  processValue,
  sendUser,
  sendTeam,
  makeTime,
});
/**
 * 多人协作
 * @param {String} ticketId 工单编号
 * @param {JSON(Array)} assist 协作内容
 */
const assist = ({
  ticketId,
  assist,
  makeTime,
} = {}) => Fetch.post('/wechat/order/assist', {
  orderNum: ticketId,
  assist,
  makeTime,
});
/**
 * 工单升级
 * @param {String} ticketId 工单编号
 */
const upgrade = ({
  ticketId,
  proposerList,
  aboutSystem,
  level,
  startTime,
  title,
  endTime,
  remark,
  enclosure,
  makeTime,
} = {}) => Fetch.post('/wechat/order/upgrade', {
  orderNum: ticketId,
  proposerList,
  aboutSystem,
  level,
  startTime,
  title,
  endTime,
  remark,
  enclosure,
  makeTime,
});
/**
 * 通过审核
 * @param {String} orderNum 工单编号 逗号相连的批量工单号
 */
const passAudit = (orderNum) => Fetch.post('/busOrderExamine/pass', {
  orderNum,
});
/**
 * 驳回审核
 */
const notPassAudit = ({
  ticketId,
  remark,
  processValue,
} = {}) => Fetch.post('/busOrderExamine/reject', {
  orderNum: ticketId,
  remark,
  processValue,
});
// 获取工单详情
const detail = (orderNum) => Fetch.post('busOrderInfo/getByOrderNum', {
  orderNum,
});
/**
 * 获取工单流程信息
 * @param {String} ticketId 工单编号
 */
const processFlow = (ticketId) => Fetch.post('/busOrderProcess/getListByOrderNum', {
  orderNum: ticketId,
});
/**
 * 获取工单上一次操作记录
 * @param {String} ticketId 工单编号
 */
const lastProcess = (ticketId) => Fetch.post('/busOrderProcess/getLastOperByOrderNum', {
  orderNum: ticketId,
});
/**
 * 无效电话
 * @param {Number} callRecordId 通话记录ID
 */
const invalidPhone = (callRecordId) => Fetch.post('/busOrderInfo/invalid', {
  id: callRecordId,
});
/**
 *
 * @param {Number} callRecordId 通话记录ID
 * @param {Number} engineerId 用户ID
 */
const findPerson = (callRecordId, engineerId) => Fetch.post('/busOrderInfo/endLook', {
  id: callRecordId,
  users: engineerId,
});
/**
 * 工单关联的通话记录列表
 * @param {String} ticketId 工单编号
 * @param {Number} pageNum 当前页
 * @param {Number} pageSize 每页数量
 * @param {Number} linkedType 关联类型
 */
const linkedCallRecordList = ({
  pageNum = 0,
  pageSize = 9999,
  ticketId,
  linkedType,
} = {}) => Fetch.post('/busOrderInfo/getWorkLinkedPage', {
  pageNum,
  pageSize,
  orderNum: ticketId,
  linkedType,
});
/**
 * 工单打印信息
 * @param {Number} id 工单id
 */
const printInfo = (id) => Fetch.post('/busOrderFault/getPrintOrderInfo', {
  orderId: id,
});

// 派单模式选取指派对象
const getMode = ({
  // * 报修科室
  deptId,
  //  故障分类
  faultType,
  //  请求来源 1PC 2微信(拿来判断是否处理接单科室)
  type,
} = {}) => Fetch.post('/v1/wechat/get/order/mode/match', {
  deptId,
  faultType,
  type,
});

export default {
  create,
  dispatch,
  accept,
  sendBack,
  complete,
  deal,
  suspend,
  openSuspended,
  terminate,
  restartTerminated,
  transfer,
  assist,
  upgrade,
  passAudit,
  notPassAudit,
  detail,
  processFlow,
  lastProcess,
  invalidPhone,
  findPerson,
  linkedCallRecordList,
  printInfo,
  getMode,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-12 10:51:17
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-20 11:25:50
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
  detailInfo,
  faultType,
  createUser,
  reqTime,
  source,
  needTime,
  equipment,
  info,
  learningId,
  appointment,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/busOrderFault/createOrder', {
  responseType,
  rangeType,
  degree,
  sendType,
  faultRemark,
  detailInfo,
  faultType,
  createUser,
  reqTime,
  source,
  needTime,
  equipment,
  info,
  learningId,
  sendUser,
  sendTeam,
  appointment,
});
/**
 * 分派工单(派单)
 */
const dispatch = ({
  orderNum,
  sendUser,
  sendTeam,
} = {}) => Fetch.post('/wechat/order/send', {
  orderNum,
  sendUser,
  sendTeam,
});
/**
 * 接单
 */
const accept = (orderNum) => Fetch.post('/wechat/order/receiving', {
  orderNum,
});
/**
 * 退单，退回服务台
 */
const sendBack = ({
  orderNum,
  remark,
  processValue,
} = {}) => Fetch.post('/wechat/order/reback', {
  orderNum,
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
} = {}) => Fetch.post('/wechat/order/new/complete', {
  orderNum,
  actualRepairPlace,
  faultType,
  faultRemark,
  makeWay,
  processEnclosure,
  realTime,
});
/**
 * 暂停工单
 */
const suspend = ({
  orderNum,
  remark,
  processEnclosure,
  processValue,
} = {}) => Fetch.post('/wechat/order/suspend', {
  orderNum,
  remark,
  processEnclosure,
  processValue,
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
  orderNum,
  remark,
  processEnclosure,
  processValue,
} = {}) => Fetch.post('/wechat/order/termination', {
  orderNum,
  remark,
  processEnclosure,
  processValue,
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
  orderNum,
  remark,
  processEnclosure,
  processValue,
  sendUser,
  sendTeam,
}) => Fetch.post('/wechat/order/redirect', {
  orderNum,
  remark,
  processEnclosure,
  processValue,
  sendUser,
  sendTeam,
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
  orderNum,
  remark,
  processValue,
} = {}) => Fetch.post('/busOrderExamine/reject', {
  orderNum,
  remark,
  processValue,
});
// 获取工单详情
const detail = (orderNum) => Fetch.post('busOrderInfo/getByOrderNum', {
  orderNum,
});
export default {
  create,
  dispatch,
  accept,
  sendBack,
  complete,
  suspend,
  openSuspended,
  terminate,
  restartTerminated,
  transfer,
  passAudit,
  notPassAudit,
  detail,
};

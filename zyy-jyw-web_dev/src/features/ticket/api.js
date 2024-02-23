import Request from '@/common/utils/request';

/**
 * 创建工单
 */
const create = ({
  actualRepairPlace,
  appointment,
  createTime,
  degree,
  enclosure,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  learningId,
  rangeType,
  reqTime,
  responseType,
  sendObjId,
  sendObjType,
  sendTeam,
  sendType,
  source,
  completeType,
  completeTime,
  specialOrder,
  remarks,
  // 报修信息
  phone,
  user,
  deptId,
  place,
  faultAddress,
  ipAddressId,
  ipAddress,
  orderNum,
} = {}) => Request.post('/obstacles/server/addOrder', {
  actualRepairPlace,
  appointment,
  createTime,
  degree,
  enclosure,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  learningId,
  rangeType,
  reqTime,
  responseType,
  sendObjId,
  sendObjType,
  sendTeam,
  sendType,
  source,
  completeType,
  completeTime,
  specialOrder,
  remarks,
  // 报修信息
  phone,
  user,
  deptId,
  place,
  faultAddress,
  ipAddressId,
  ipAddress,
  orderNum,
});

/**
 * 修改工单
 */
const update = ({
  actualRepairPlace,
  appointment,
  completeTime,
  createTime,
  degree,
  deptId,
  enclosure,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  orderNum,
  phone,
  place,
  rangeType,
  reqTime,
  responseType,
  source,
  user,
  completeType,
  remarks,
  specialOrder,
  faultAddress,
  ipAddressId,
  ipAddress,
} = {}) => Request.post('/obstacles/server/edit', {
  actualRepairPlace,
  appointment,
  completeTime,
  createTime,
  degree,
  deptId,
  enclosure,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  orderNum,
  phone,
  place,
  rangeType,
  reqTime,
  responseType,
  source,
  user,
  completeType,
  remarks,
  specialOrder,
  faultAddress,
  ipAddressId,
  ipAddress,
});

/**
 * 派单
 */
const dispatch = ({
  ticketId,
  sendObjId,
  sendObjType,
  sendTeam,
} = {}) => Request.put('/obstacles/server/allocate', {
  orderNum: ticketId,
  sendObjId,
  sendObjType,
  sendTeam,
});
/**
 * 退单
 */
const sendBack = ({
  ticketId,
  reason,
  remark,
} = {}) => Request.put('/obstacles/mine/order/reback', {
  orderNum: ticketId,
  reason,
  remark,
});
/**
 * 处理完成工单
 */
const complete = ({
  actualRepairPlace,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  makeWay,
  orderNum,
  processEnclosure,
  realTime,
} = {}) => Request.put('/obstacles/mine/order/complete', {
  actualRepairPlace,
  equipment,
  equipmentAddress,
  equipmentAddressId,
  faultRemark,
  faultType,
  makeWay,
  orderNum,
  processEnclosure,
  realTime,
});
/**
 * 处理工单
 */
const deal = ({
  ticketId,
  processEnclosure,
  remark,
} = {}) => Request.put('/obstacles/mine/order/make', {
  orderNum: ticketId,
  processEnclosure,
  remark,
});
/**
 * 接单
 */
const accept = (orderNum) => Request.put('/obstacles/mine/order/receive', {
  orderNum,
});
/**
 * 暂停工单
 */
const suspend = ({
  enclosure,
  ticketId,
  reason,
  remark,
} = {}) => Request.put('/obstacles/mine/order/suspend', {
  enclosure,
  orderNum: ticketId,
  reason,
  remark,
});
/**
 * 暂停开启
 */
const openSuspended = (orderNum) => Request.put('/obstacles/mine/order/open', {
  orderNum,
});
/**
 * 终止工单
 */
const terminate = ({
  ticketId,
  reason,
  remark,
} = {}) => Request.put('/obstacles/mine/order/termination', {
  orderNum: ticketId,
  reason,
  remark,
});
/**
 * 终止重启
 */
const restartTerminated = (orderNum) => Request.put('/obstacles/mine/order/restart', {
  orderNum,
});
/**
 * 转交工单
 */
const transfer = ({
  ticketId,
  reason,
  remark,
  sendObjId,
  sendObjType,
  sendTeam,
} = {}) => Request.put('/obstacles/mine/order/redirect', {
  orderNum: ticketId,
  reason,
  remark,
  sendObjId,
  sendObjType,
  sendTeam,
});
/**
 * 多人协作
 * assistList: [{assistEnclosureId,content,sendObjId,sendObjType,sendTeam}]
 */
const assist = ({
  assistList,
  ticketId,
  assistEnclosure,
  assistRemark,
} = {}) => Request.put('/obstacles/mine/order/assist', {
  assistList,
  orderNum: ticketId,
  assistEnclosure,
  assistRemark,
});
/**
 * 工单升级
 * proposeLIst: [{organizer,phone,sponsor}]
 */
const upgrade = ({
  aboutSystem,
  enclosure,
  endTime,
  level,
  orderNum,
  proposeList,
  remark,
  startTime,
  title,
} = {}) => Request.put('/obstacles/mine/order/upgrade', {
  aboutSystem,
  enclosure,
  endTime,
  level,
  orderNum,
  proposeList,
  remark,
  startTime,
  title,
});
/**
 * 通过审核
 */
const passAudit = (orderNumList) => Request.get(`/obstacles/order/enact?orderNums=${orderNumList.join(',')}`);
/**
 * 驳回审核
 */
const notPassAudit = ({
  orderNum,
  rejectReason,
  rejectDescribe,
} = {}) => Request.post('/obstacles/order/reject', {
  orderNum,
  rejectReason,
  rejectDescribe,
});
/**
 * 获取工单详情
 */
const detail = (orderNum) => {
  const encodeOrderNum = encodeURIComponent(orderNum);
  return Request.get(`/obstacles/server/detail/${encodeOrderNum}`, {});
};
/**
 * 获取工单流程信息
 */
const processFlow = (ticketId) => {
  const encodeTicketId = encodeURIComponent(ticketId);
  return Request.get(`/obstacles/server/detail/process/${encodeTicketId}`);
};

/**
 * 获取处理耗时信息
 */
const orderTime = (ticketId) => {
  const encodeTicketId = encodeURIComponent(ticketId);
  return Request.get(`/obstacles/server/order/time/${encodeTicketId}`);
};
/**
 * 无效电话
 * @param {Number} callRecordId 通话记录ID
 */
const invalidPhone = (callRecordId) => Request.put('/obstacles/server/deal/invalid', {
  data: callRecordId,
});

/* 打印工单 */
const printInfo = params => {
  return Request({
    url: `/obstacles/server/print`,
    method: 'get',
    params: params,
    responseType: 'blob',
  });
};

const addRepairOrderData = (data) => {
  return Request.post('/obstacles/repair/addRepairOrder', data);
};

const getIpAddress = (data) => {
  return Request.get('/obstacles/repair/getIpAddress', data);
};

const getDeptByPhone = (data) => {
  return Request.get('/system/phoneBook/getDeptByPhone', {
    params: {
      phone: data,
    },
  });
};

const getIpAddressByDeptId = (data) => {
  return Request.get('/system/ipAddress/getIpAddressByDeptId', {
    params: {
      deptId: data,
    },
  });
};

const putPhoneEnd = (data) => {
  return Request.put('/obstacles/server/deal/phoneEnd', data);
};

const putInvalid = (data) => {
  return Request.put('/obstacles/server/deal/invalid', data);
};

const putFind = (data) => {
  return Request.put('/obstacles/server/deal/find', data);
};

export default {
  create,
  update,
  accept,
  detail,
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
  processFlow,
  orderTime,
  invalidPhone,
  dispatch,
  printInfo,
  addRepairOrderData,
  getIpAddress,
  getDeptByPhone,
  getIpAddressByDeptId,
  putPhoneEnd,
  putInvalid,
  putFind,
};

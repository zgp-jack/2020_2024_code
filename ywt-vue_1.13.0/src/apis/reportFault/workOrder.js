/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 19:39:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-21 17:41:58
 * @Description: 工单相关
 */
import request from '@/utils/request';
import Fetch from '@/utils/fetch';
// 派遣工单
export function dispatch({ orderNum, sendUser, sendTeam, }) {
  return request({
    url: '/wechat/order/send',
    method: 'post',
    data: {
      orderNum,
      sendUser,
      sendTeam,
    },
  });
}
// 退回工单
export function sendBack({
  orderNum,
  remark,
  processValue,
}) {
  return request({
    url: '/wechat/order/reback',
    method: 'post',
    data: {
      orderNum,
      remark,
      processValue,
    },
  });
}
// 审核未通过
export function notPass({
  orderNum,
  remark,
  processValue,
}) {
  return request({
    url: '/busOrderExamine/reject',
    method: 'post',
    data: {
      orderNum,
      remark,
      processValue,
    },
  });
}
// 处理工单
export function dealWorkOrder({
  orderNum,
  remark,
  processEnclosure,
}) {
  return request({
    url: '/wechat/order/makeing',
    method: 'post',
    data: {
      orderNum,
      remark,
      processEnclosure,
    },
  });
}
// 转交工单
export function transferWorkOrder({
  orderNum,
  remark,
  processEnclosure,
  processValue,
  makeUser,
}) {
  return request({
    url: '/wechat/order/redirect',
    method: 'post',
    data: {
      orderNum,
      remark,
      processEnclosure,
      processValue,
      make: {
        makeUser,
      },
    },
  });
}
// 终止工单
export function terminateWorkOrder({
  orderNum,
  remark,
  processValue,
}) {
  return request({
    url: '/wechat/order/termination',
    method: 'post',
    data: {
      orderNum,
      remark,
      processValue,
    },
  });
}
// 暂停工单
export function suspendWorkOrder({
  orderNum,
  remark,
  processValue,
  processEnclosure,
}) {
  return request({
    url: '/wechat/order/suspend',
    method: 'post',
    data: {
      orderNum,
      remark,
      processValue,
      processEnclosure,
    },
  });
}
// 完成工单
export function completeWorkOrder({
  orderNum,
  makeWay,
  realTime,
  isLocal,
  faultType,
  faultRemark,
  processEnclosure,
}) {
  return request({
    url: '/wechat/order/complete',
    method: 'post',
    data: {
      orderNum,
      processEnclosure,
      faultType,
      faultRemark,
      make: {
        makeWay,
        realTime,
        isLocal,
      },
    },
  });
}
// 多人协作
export function assistWorkOrder({
  assist,
  orderNum,
}) {
  return request({
    url: '/wechat/order/assist',
    method: 'post',
    data: {
      orderNum,
      assist,
    },
  });
}
// 创建工单
export function createWorkOrder(data) {
  return request({
    url: '/busOrderFault/createOrder',
    method: 'post',
    data,
  });
}
// 流程推进
export function nextOrder(data) {
  return request({
    url: '/busOrderFault/nextOrder',
    method: 'post',
    data,
  });
}

// 获取红点数据
export function getRedInfo() {
  return request({
    url: '/busOrderInfo/getPcRedInfo',
    method: 'post',
    data: {},
  });
}
// 根据工单号获取流程
export function getProcessInfoByOrderNum({ orderNum, }) {
  return request({
    url: '/busOrderProcess/getListByOrderNum',
    method: 'post',
    data: {
      orderNum,
    },
  });
}
// 按月获取
export function getMonthData() {
  return request({
    url: '/busOrderInfo/redDataTotal/month',
    method: 'post',
    data: {
    },
  });
}
// 查询关联工单
export function getRelatedWorkOrderList(data) {
  return request({
    url: '/busOrderInfo/getLinkedList',
    method: 'post',
    data,
  });
}
/**
 * 转交工单
 * @param {*} {
 *  orderNum 工单ID
 *  remark 转交说明
 *  processEnclosure 转交附件
 *  processValue 转交原因
 *  sendUser 转交工程师
 *  sendTeam 转交运维小组
 * }
 * @returns
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
 * 创建工单
 */
const create = (data) => Fetch.post('/busOrderFault/createOrder', data);

/**
 * 创建工单 - 无效电话
 * @param {*} orderNum
 * @returns
 */
const invalidPhone = (orderNum) => Fetch.post('/busOrderFault/invalid', {
  orderNum,
});
/**
 * 创建工单 - 电话找人
 * @param {*} {
 *  id 工单info信息id
 *  sendUser 工程师id
 * }
 * @returns
 */

const findPerson = ({ id, sendUser, } = {}) => create({
  sendType: 4,
  sendUser,
  info: {
    id,
  },
});
// /**
//  * 工单列表查询
//  * @param {*} {
//  *  temp 模板参数  ref-> TYPE
//  *  query 模糊查询
//  *  pageNum
//  *  pageSize
//  *  sortTemp 排序规则
//  * }
//  * @returns
//  */
// const list = ({
//   temp,
//   query,
//   pageNum = 0,
//   pageSize = 10,
//   sortTemp = null,
// } = {}) => {
//   const formatingLikeQuery = {};
//   let queryData = null;
//   for (const key in query) {
//     const value = query[key];
//     let allValue = [];
//     value.map(item => {
//       if (isString(item)) {
//         allValue = [...allValue, ...item.split('/')];
//       } else {
//         allValue = [...allValue, item];
//       }
//     });

//     const valArr = [...new Set(allValue)];
//     if (valArr.length > 0) {
//       formatingLikeQuery[key] = [...new Set(allValue)];
//     }
//   }
//   if (Object.keys(formatingLikeQuery).length) {
//     queryData = JSON.stringify(formatingLikeQuery);
//   }
//   return Fetch.post('/busOrderInfo/getWorkPage', {
//     temp,
//     query: queryData,
//     pageNum,
//     pageSize,
//     sortTemp,
//   });
// };

const TYPE = {
  '其他': 'manualCreate',
  '微信报修': 'wechatCreate',
  '电话报修': 'phoneCreate',
  '已接': 'pickedUp',
  '未接': 'missed',
  '已建工单': 'construction',
  '待建单': 'untenited',
  '电话解决': 'endPhone',
  '电话找人': 'endLook',
  '待接单': 'waitAccept',
  '待派单': 'waitDelivery',
  '处理中': 'processing',
  '送修': 'sendOut',
  '转为需求': 'transform',
  '已完成': 'complete',
  '终止': 'terminated',
  '完成待审': 'waitAudit',
  '通过': 'pass',
  '未通过': 'notPassAudit',
  '待评价': 'waitAppraisal',
  '我的工单': 'myself',
  '结束': 'ended',
  '无效电话': 'invalid',
};
/**
 * 获取关联工单列表
 * @param {*} {
 *  orderNum
 *  phone
 *  deptId
 * }
 * @returns
 */
const relatedList = ({
  pageNum = 0,
  pageSize = 9999,
  phone,
  deptId,
} = {}) => Fetch.post('/busOrderFault/getLinkedList', {
  pageNum,
  pageSize,
  phone,
  deptId,
});
/**
 * 关联工单
 * @param {*} {
 *  orderNum 关联的工单号
 *  id 通话记录id
 * }
 * @returns
 */
const relate = ({
  orderNum,
  id,
  linkedType,
} = {}) => Fetch.post('/busOrderInfo/linked', {
  orderNum,
  id,
  linkedType,
});
/**
 * 删除关联工单
 * @param {*} orderNum
 * @returns
 */
const deleteRelate = (orderNum) => Fetch.post('/busOrderInfo/disconnect', {
  orderNum,
});
/**
 * 工单关联通话记录查询
 *
 */
const relateCallRecordList = ({
  pageNum = 0,
  pageSize = 9999,
  orderNum,
  linkedType,
} = {}) => Fetch.post('/busOrderInfo/getWorkLinkedPage', {
  pageNum,
  pageSize,
  orderNum,
  linkedType,
});

/**
 *  接单
 *  @param {*} orderNum
 *  @returns
*/
const accept = (orderNum) => Fetch.post('/wechat/order/receiving', {
  orderNum,
});
/**
 * 工单升级
 * @param {
 * orderNum
 * organizer 提出科室
 * sponsor 提出人(逗号相连)
 * phone
 * aboutSystem
 * level 紧急程度(itemLevel)
 * startTime
 * title
 * endTime
 * remark
 * enclosure
 * }
 * @returns
 */
const upgrade = ({
  orderNum,
  organizer,
  sponsor,
  phone,
  aboutSystem,
  level,
  startTime,
  title,
  endTime,
  remark,
  enclosure,
} = {}) => Fetch.post('/wechat/order/upgrade', {
  orderNum,
  organizer,
  sponsor,
  phone,
  aboutSystem,
  level,
  startTime,
  title,
  endTime,
  remark,
  enclosure,
});
// 获取工单详情
const detail = (orderNum) => Fetch.post('busOrderInfo/getByOrderNum', {
  orderNum,
});
/**
 * 通话记录查询
 */
const callRecordList = ({
  temp,
  pageNum,
  pageSize,
  sortTemp,
} = {}) => Fetch.post('/busOrderInfo/getWorkInfoPage', {
  temp,
  pageNum,
  pageSize,
  sortTemp,
});
/**
 * 工单查询
 */
const list = ({
  temp,
  pageNum,
  pageSize,
  sortTemp,
} = {}) => Fetch.post('/busOrderFault/getWorkFaultPage', {
  temp,
  pageNum,
  pageSize,
  sortTemp,
});
export default {
  transfer,
  invalidPhone,
  findPerson,
  list,
  relatedList,
  relate,
  deleteRelate,
  relateCallRecordList,
  accept,
  upgrade,
  detail,
  TYPE,
  callRecordList,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 18:19:57
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 15:24:24
 * @Description:服务台API
 */
import Fetch from '@/utils/fetch';
/**
 * 红点数据
 * @param {String} query 关键字
 * @param {String} reception 服务台
 * @param {String} startTime 通话开始时间
 * @param {String} endTime 通话结束时间
 *
 *
 */
const redInfo = ({
  query,
  reception,
  startTime,
  endTime,
  hospitalId,
} = {}) => Fetch.post('/busOrderInfo/getPcRedInfo', {
  query,
  reception,
  startTime,
  endTime,
  hospitalId,
});
/**
 * 通话记录查询
 */
const callRecordList = ({
  temp,
  pageNum,
  pageSize,
  sortTemp,
  query,
  reception,
  startTime,
  endTime,
  hospitalId,
} = {}) => Fetch.post('/busOrderInfo/getWorkInfoPage', {
  temp,
  pageNum,
  pageSize,
  sortTemp,
  query,
  reception,
  startTime,
  endTime,
  hospitalId,
});
/**
 * 工单列表查询
 */
const list = ({
  query,
  temp,
  pageNum,
  pageSize,
  sortTemp,
  reception,
  startTime,
  hospitalId,
  endTime,
  departmentId,
  teamId,
} = {}) => Fetch.post('/busOrderFault/getWorkFaultPage', {
  query,
  temp,
  pageNum,
  pageSize,
  sortTemp,
  reception,
  startTime,
  hospitalId,
  endTime,
  departmentId,
  teamId,
});
/**
 * 获取分机号列表
 */
const extensionList = () => Fetch.post('/sysPhone/getLocalPhone', {});
/**
 * 通话记录关联的工单列表
 * @param {Number} pageNum 当前页
 * @param {Number} pageSize 每页数量
 * @param {String} phone 报修电话
 * @param {Number} deptId 科室id
 * @returns
 */
const callRecordLinkedTicketList = ({
  pageNum,
  pageSize,
  phone,
  deptId,
} = {}) => Fetch.post('/busOrderFault/getLinkedList', {
  pageNum,
  pageSize,
  phone,
  deptId,
});
/**
 * 通话记录关联工单
 * @param {String} ticketId 工单编号
 * @param {Number}callRecordId 通话记录id
 * @param {Number} linkedType 关联类型
 */
const linkTicket = ({
  ticketId,
  callRecordId,
  linkedType,
} = {}) => Fetch.post('/busOrderInfo/linked', {
  orderNum: ticketId,
  id: callRecordId,
  linkedType,
});
/**
 * 更新表头
 * @param {String} columns 通话记录表头
 * @param {String} type 表头类型 callRecord-通话记录 callRecordPhoneFind-电话找人 ticket-工单
 */
const updateTableColumn = ({
  columns,
  type = 'callRecord',
} = {}) => Fetch.post('/busOrderHeaderPermission/saveOrUpdate', {
  permission: columns,
  type,
});
/**
 * 获取表头
 * @param {String} type 表头类型 callRecord-通话记录 callRecordPhoneFind-电话找人 ticket-工单
 */
const tableColumnDetail = (type = 'callRecord') => Fetch.post('/busOrderHeaderPermission/getByUserId', {
  type,
});
/**
 * 获取服务台人员列表
 */
const receptionList = () => Fetch.post('/busOrderInfo/getServiceUser', {});
export default {
  redInfo,
  callRecordList,
  list,
  extensionList,
  callRecordLinkedTicketList,
  linkTicket,
  updateTableColumn,
  tableColumnDetail,
  receptionList,
};

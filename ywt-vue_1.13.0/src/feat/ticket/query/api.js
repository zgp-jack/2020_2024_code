/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-08 15:56:55
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 16:14:36
 * @Description:工单查询API
 */
import Fetch from '@/utils/fetch';
/**
 * 工单查询列表
 */
const list = ({
  pageNum = 0,
  pageSize = 10,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
  hospitalId,
  departmentId,
  teamId,
} = {}) => Fetch.post('/busOrderFault/getSearchPage', {
  pageNum,
  pageSize,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
  hospitalId,
  departmentId,
  teamId,
});
/**
 *  下载工单数据
 */
const download = ({
  pageNum = 0,
  pageSize = 10,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
  ticketIds,
  hospitalId,
  departmentId,
  teamId,
} = {}) => Fetch.post('/busOrderFault/exportOrderExcel', {
  pageNum,
  pageSize,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
  orderIds: ticketIds,
  hospitalId,
  departmentId,
  teamId,
});
export default {
  list,
  download,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-01 15:57:05
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-08-08 14:55:03
 * @Description:首页接口
 */
import Fetch from '@/utils/fetch';
import request from '@/utils/request';
/**
 *  我的工单统计
 * @returns
 */
const workOrderStatistics = ({
  startTime,
  endTime,
} = {}) => Fetch.post('/home/statistics/order', {
  startTime,
  endTime,
});
/**
 * 我的调研统计
 */
const researchStatistics = ({
  startTime,
  endTime,
} = {}) => Fetch.post('/home/statistics/investigate', {
  startTime,
  endTime,
});
/**
 * 我的项目统计
 */
const projectStatistics = ({
  startTime,
  endTime,
} = {}) => Fetch.post('/home/statistics/item', {
  startTime,
  endTime, });
/**
  * 我的任务统计
  */
const taskStatistics = ({
  startTime,
  endTime,
} = {}) => Fetch.post('/home/statistics/work', {
  startTime,
  endTime, });
/**
   * 我的排班统计
   */
const dutyStatistics = ({
  startTime,
  endTime,
} = {}) => Fetch.post('/home/statistics/schedul', {
  startTime,
  endTime, });
/**
 * 我的工单列表
 * @param {*} param0
 * @returns
 */
const workOrderList = ({
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
} = {}) => Fetch.post('/home/page/order', {
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
});
/**
 * 我的巡检列表
 * @param {*} param0
 * @returns
 */
const inspectionList = ({
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
} = {}) => Fetch.post('/home/page/inspection', {
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
});
/**
 * 我的调研列表
 * @param {*} param0
 * @returns
 */
const researchList = ({
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
} = {}) => Fetch.post('/home/page/investigate', {
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
});
/**
 * 我的任务列表
 */
const taskList = ({
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
} = {}) => Fetch.post('/home/page/task', {
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
});
/**
 * 我的项目列表
 */
const projectList = ({
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
  processStr,
  // waitWork = '1',
  // showRange = '-1',
  // sendUser = '',
  // pageSize = '10',
  // pageNum = '0',
  // startTime = '1659888000000',
  // endTime = '1660492799999',
  // processStr = 'implement_start,item_before_project,reject_end,end_project,implement_over',
} = { }) => Fetch.post('/home/page/item', {
  waitWork,
  showRange,
  sendUser,
  pageSize,
  pageNum,
  startTime,
  endTime,
  processStr,
});
/**
 * 红点数据
 */
const redData = ({
  startTime,
  endTime,
  showRange,
  sendUser,
} = {}) => Fetch.post('/home/page/count', {
  startTime,
  endTime,
  showRange,
  sendUser,
});
const userInformation = ({ userId, } = {}) => Fetch.post('/bus/busPersonnelInfo/getHomePageInfo', { userId, });
// const getEngineerListByDeptId = ({
//   deptNo,
//   pageSize,
//   pageNum,
// } = {}) => Fetch.post('/sysDept/getUsersk', {
//   deptNo,
//   pageSize,
//   pageNum,
// });
const getEngineerListByDeptId = (deptNo, pageSize, pageNum) => {
  return request({
    url: '/sysDept/getUser',
    method: 'post',
    data: {
      deptNo,
      pageSize,
      pageNum,
    },
  });
};
export default {
  workOrderStatistics,
  researchStatistics,
  projectStatistics,
  taskStatistics,
  dutyStatistics,
  workOrderList,
  inspectionList,
  researchList,
  taskList,
  projectList,
  redData,
  userInformation,
  getEngineerListByDeptId,
};

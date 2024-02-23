/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-03-21 18:03:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-29 18:01:48
 * @Description:工单大屏API
 */
import Fetch from '@/utils/fetch';

/**
 * 报修类型（故障来源）
 * @param {Number} dateType 查询时间范围1今日2本月
 */
const faultSource = ({
  dateType = 2,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderTypeData', {
  dateType,
});

/**
 * 报修科室排名
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 */
const deptRank = ({
  startTime = null,
  endTime = null,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderDeptData', {
  startTime,
  endTime,
});
/**
 * 报修科室排名-弹窗
 * @returns
 */
const deptRankDetail = ({
  startTime = null,
  id,
  endTime = null,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderDeptDataByDept', {
  startTime,
  endTime,
  id,
});
/**
 * 故障分类排名
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 * @param {Number} id 故障分类id
 */
const faultType = ({
  startTime = null,
  endTime = null,
  id = null,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderFaultTypeData', {
  startTime,
  endTime,
  id,
});
/**
 * 院区及科室报修
 * @param {String} startTime 开始时间
 * @param {String} endTime 结束时间
 * @param {Number} id 科室id
 */
const department = ({
  startTime = null,
  endTime = null,
  id = null,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderHospitalData', {
  startTime,
  endTime,
  id,
});
/**
 * 工程师接单数
 * @param {Number} dateType 查询时间范围1今日2本月
 */
const engineer = ({
  dateType = 2,
} = {}) => Fetch.post('/bus/bigScreen/order/getOrderEngineerData', {
  dateType,
});
/**
 * 会议安排
 * @param {String} time 会议时间
 */
const meeting = ({
  time,
} = {}) => Fetch.post('/bus/bigScreen/order/getMeetingList', {
  time,
});
/**
 * 进行中的工单
 * @param {Number} dateType 查询时间范围1今日2本月
 */
const ticket = ({
  dateType = 2,
} = {}) => Fetch.post('/bus/bigScreen/order/getProcessOrder', {
  dateType,
});
/**
 * 人员排班情况
 * @param {String} time 会议时间
 */
const duty = ({
  time,
} = {}) => Fetch.post('/bus/bigScreen/order/getTodaySchedulData', {
  time,
});
export default {
  faultSource,
  deptRank,
  deptRankDetail,
  faultType,
  department,
  engineer,
  meeting,
  ticket,
  duty,
};

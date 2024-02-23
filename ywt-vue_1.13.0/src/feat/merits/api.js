/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-20 16:51:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-21 17:54:42
 * @Description:绩效API
 */
import Fetch from '@/utils/fetch';
/**
 * 绩效列表查询
 * @param {String} evaluationCycle 考核周期
 * @param {String} roleIds 角色id用逗号隔开
 * @param {String} userIds 人员id用逗号隔开
 * @param {Number} deptId
科室id
 */
const list = ({
  pageNum = 0,
  pageSize = 10,
  evaluationCycle,
  roleIds,
  userIds,
  deptId,

} = {}) => Fetch.post('/bus/employeePerformance/queryPerformanceByPage', {
  pageNum,
  pageSize,
  evaluationCycle,
  roleIds,
  userIds,
  deptId,
});
/**
 * 绩效-主观评分详情查询
 * @param {Number} performanceId 员工绩效id
 */
const subjectiveEvaluationDetail = (performanceId) => Fetch.post('/bus/employeePerformance/queryGradeDetail', {
  performanceId,
  indexType: '01',
});
/**
 * 绩效-客观评分详情查询
 * @param {Number} performanceId 员工绩效id
 */
const objectiveEvaluationDetail = (performanceId) => Fetch.post('/bus/employeePerformance/queryGradeDetail', {
  performanceId,
  indexType: '02',
});
/**
 * 查看绩效趋势
 * @param {Number} engineerId 用户id
 * @param {String} year 年份
 */
const queryTrending = ({
  engineerId,
  year,
} = {}) => Fetch.post('/bus/employeePerformance/queryPerformanceTrend', {
  userId: engineerId,
  year,
});
/**
 * 查询统计周期
 * @param {String} evaluationCycle 周期   yyyy-mm
 */
const queryStatisticsPeriod = (evaluationCycle) => Fetch.post('/bus/employeePerformance/queryCycle', {
  evaluationCycle,
});
export default {
  list,
  subjectiveEvaluationDetail,
  objectiveEvaluationDetail,
  queryTrending,
  queryStatisticsPeriod,
};

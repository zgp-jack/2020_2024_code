/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 14:26:29
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-19 15:06:44
 * @Description:我的绩效API接口
 */
import Fetch from '@/utils/fetch';
/**
 * 查询绩效基本信息
 * @param {Number} userId 用户id
 * @param {String} evaluationCycle 统计周期 yyyy-mm
 */
const mainInfoDetail = ({
  userId,
  evaluationCycle,
} = {}) => Fetch.post('/bus/employeePerformance/queryByUserId', {
  userId,
  evaluationCycle,
});
/**
 * 查询绩效评价详情
 * @param {Number} performanceId 员工绩效id
 * @param {String} indexType  分值类别 码表score_type(主观评分：01，客观评分：02)
 */
const evaluationDetail = ({
  performanceId,
  indexType,
} = {}) => Fetch.post('/bus/employeePerformance/queryGradeDetail', {
  performanceId,
  indexType,
});
/**
 * 新增绩效主观评分
 * @param {Number} parentId 上级id
 * @param {String} indexDescription 指标描述
 * @param {Number} finalScore 自评得分/最终得分
 */
const createSubjectiveEvaluation = ({
  parentId,
  indexDescription,
  finalScore,
  note,
} = {}) => Fetch.post('/bus/employeePerformance/saveOrUpdateSubject', {
  parentId,
  indexDescription,
  finalScore,
  note,
});
/**
 * 修改绩效主观评分
 * @param {Number} id 评分id
 * @param {Number} parentId 上级id
 * @param {String} indexDescription 指标描述
 * @param {Number} finalScore 自评得分/最终得分
 */
const updateSubjectiveEvaluation = ({
  id,
  parentId,
  indexDescription,
  finalScore,
  note,
} = {}) => Fetch.post('/bus/employeePerformance/saveOrUpdateSubject', {
  id,
  parentId,
  indexDescription,
  finalScore,
  note,
});
/**
 * 复议
 *  @param {Array} reconsiderVo gradeId：评分id，reconsiderDesc：复议描述不能为空 [{gradeId,reconsiderDesc}]
 */
const reconsider = (reconsiderVo) => Fetch.post('/bus/employeePerformance/reconsiderBach', {
  reconsiderVo,
});
/**
 *  提交本月绩效
 * @param {*} performanceId 绩效id
 * @returns
 */
const submitMerits = (performanceId) => Fetch.post('/bus/employeePerformance/submitPerformance', {
  performanceId,
});
export default {
  mainInfoDetail,
  evaluationDetail,
  createSubjectiveEvaluation,
  updateSubjectiveEvaluation,
  reconsider,
  submitMerits,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 14:25:28
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-07-05 15:01:45
 * @Description:绩效设置API接口
 */
import Fetch from '@/utils/fetch';
/**
 * 新增绩效设置基本信息
 * @param {String} startType 绩效考核时间起始范围  码表examine_type
 * @param {Number} startDay 考核日期
 * @param {String} endType 绩效考核时间结束范围  码表examine_type
 * @param {Number} endDay 考核日期2
 * @param {String} note 备注
 */
const createBaseInfo = ({
  startType,
  startDay,
  endType,
  endDay,
  note,
} = {}) => Fetch.post('/bus/performanceSetting/saveOrUpdate', {
  startType,
  startDay,
  endType,
  endDay,
  note,
});
/**
 * 更新绩效设置基本信息
 * @param {Number} id 绩效设置id
 * @param {String} startType 绩效考核时间起始范围  码表examine_type
 * @param {Number} startDay 考核日期
 * @param {String} endType 绩效考核时间结束范围  码表examine_type
 * @param {Number} endDay 考核日期2
 * @param {String} note 备注
 */
const updateBaseInfo = ({
  id,
  startType,
  startDay,
  endType,
  endDay,
  note,
} = {}) => Fetch.post('/bus/performanceSetting/saveOrUpdate', {
  id,
  startType,
  startDay,
  endType,
  endDay,
  note,
});
/**
 * 查询绩效设置
 */
const baseInfoDetail = () => Fetch.post('/bus/performanceSetting/getPerformanceSetting', {});
/**
 * 创建绩效设置角色对应分值占比
 * @param {Number} performanceId 绩效设置id
 * @param {Number} roleId 角色id
 * @param {Number} deptId 科室id
 * @param {Number} subjectiveRatio 主观分值占比
 * @param {Number} objectiveRatio 客观分支占比
 * @param {String} note 备注
 */
const createRoleScore = ({
  performanceId,
  roleId,
  deptId,
  subjectiveRatio,
  objectiveRatio,
  note,
} = {}) => Fetch.post('/bus/performanceRole/saveOrUpdate', {
  performanceId,
  roleId,
  deptId,
  subjectiveRatio,
  objectiveRatio,
  note,
});
/**
 * 更新绩效设置角色对应分值占比
 * @param {Number} performanceId 绩效设置id
 * @param {Number} id 角色对应分支占比id
 * @param {Number} roleId 角色id
 * @param {Number} deptId 科室id
 * @param {Number} subjectiveRatio 主观分值占比
 * @param {Number} objectiveRatio 客观分支占比
 * @param {String} note 备注
 */
const updateRoleScore = ({
  performanceId,
  id,
  roleId,
  deptId,
  subjectiveRatio,
  objectiveRatio,
  note,
} = {}) => Fetch.post('/bus/performanceRole/saveOrUpdate', {
  performanceId,
  id,
  roleId,
  deptId,
  subjectiveRatio,
  objectiveRatio,
  note,
});
/**
 * 查询绩效设置角色对应分值占比
 * @param {Number} performanceId 绩效设置id
 */
const roleScoreDetail = (performanceId) => Fetch.post('/bus/performanceRole/queryByList', {
  performanceId,
});
/**
 * 删除绩效设置角色对应分值占比
 * @param {Number} id 角色对应分支占比id
 */
const deleteRoleScore = (id) => Fetch.post('/bus/performanceRole/deleteById', {
  id,
});
/**
 * 创建绩效设置考核分值对应等级
 * @param {Number} performanceId 绩效设置id
 * @param {String} firstSymbol 运算符1 码表Symbol
 * @param {Number} firstScore 分值1
 * @param {String} secondSymbol 运算符2 码表Symbol
 * @param {Number} secondScore 分值2
 * @param {String} note 备注
 * @param {String} level 等级  码表performance_level
 */
const createLevel = ({
  performanceId,
  firstSymbol,
  firstScore,
  secondSymbol,
  secondScore,
  note,
  level,
} = {}) => Fetch.post('/bus/performanceLevel/saveOrUpdate', {
  performanceId,
  firstSymbol,
  firstScore,
  secondSymbol,
  secondScore,
  note,
  level,
});
/**
 * 更新绩效设置考核分值对应等级
 * @param {Number} performanceId 绩效设置id
 * @param {Number} id 考核分值对应等级id
 * @param {String} firstSymbol 运算符1 码表Symbol
 * @param {Number} firstScore 分值1
 * @param {String} secondSymbol 运算符2 码表Symbol
 * @param {Number} secondScore 分值2
 * @param {String} note 备注
 * @param {String} level 等级  码表performance_level
 */
const updateLevel = ({
  performanceId,
  id,
  firstSymbol,
  firstScore,
  secondSymbol,
  secondScore,
  note,
  level,
} = {}) => Fetch.post('/bus/performanceLevel/saveOrUpdate', {
  performanceId,
  id,
  firstSymbol,
  firstScore,
  secondSymbol,
  secondScore,
  note,
  level,
});
/**
 * 查询绩效设置考核分值对应等级
 * @param {Number} performanceId 绩效设置id
 * @returns
 */
const levelDetail = (performanceId) => Fetch.post('/bus/performanceLevel/queryByList', {
  performanceId,
});
/**
 * 删除绩效设置考核分值对应等级
 * @param {Number} id 考核分值对应等级id
 * @returns
 */
const deleteLevel = (id) => Fetch.post('/bus/performanceLevel/deleteById', {
  id,
});
/**
 * 创建绩效设置评分细则
 * @param {Number} performanceId 绩效设置id
 * @param {String} second 二级指标 码表score_rule
 * @param {String} name 一级指标 码表score_rule
 * @param {String} indexType 指标类别  码表score_type
 * @param {String} indexDescription 指标描述
 * @param {Number} score 单项评分
 * @param {String} calculationRule 计算规则 接口查询绩效计算规则
 * @param {String} note 备注
 */
const createDetailRule = ({
  performanceId,
  second,
  name,
  indexType,
  indexDescription,
  score,
  singleScore,
  calculationRule,
  note,
} = {}) => Fetch.post('/bus/performanceRule/saveOrUpdate', {
  performanceId,
  second,
  name,
  indexType,
  indexDescription,
  score,
  singleScore,
  calculationRule,
  note,
});
/**
 * 更新绩效设置评分细则
 * @param {Number} performanceId 绩效设置id
 * @param {Number} id 评分细则id
 * @param {String} second 二级指标 码表score_rule
 * @param {String} name 一级指标 码表score_rule
 * @param {String} indexType 指标类别  码表score_type
 * @param {String} indexDescription 指标描述
 * @param {Number} score 单项评分
 * @param {String} calculationRule 计算规则 接口查询绩效计算规则
 * @param {String} note 备注
 */
const updateDetailRule = ({
  performanceId,
  id,
  second,
  name,
  indexType,
  indexDescription,
  score,
  singleScore,
  calculationRule,
  note,
} = {}) => Fetch.post('/bus/performanceRule/saveOrUpdate', {
  performanceId,
  id,
  second,
  name,
  indexType,
  indexDescription,
  score,
  singleScore,
  calculationRule,
  note,
});
/**
 * 查询绩效设置评分细则
 * @param {Number} performanceId 绩效设置id
 * @returns
 */
const detailRuleDetail = (performanceId) => Fetch.post('/bus/performanceRule/queryByList', {
  performanceId,
});
/**
 * 删除绩效设置评分细则
 * @param {Number} id 评分细则id
 */
const deleteDetailRule = (id) => Fetch.post('/bus/performanceRule/deleteById', {
  id,
});
/**
 * 查询绩效计算规则
 * @param {String} indexType 指标类别  码表score_type
 */
const calculationRuleList = (indexType) => Fetch.post('/bus/performanceRule/queryPerformanceCalculation', {
  indexType,
});
export default {

  createBaseInfo,
  updateBaseInfo,
  baseInfoDetail,
  createRoleScore,
  updateRoleScore,
  roleScoreDetail,
  deleteRoleScore,
  createLevel,
  updateLevel,
  levelDetail,
  deleteLevel,
  createDetailRule,
  updateDetailRule,
  detailRuleDetail,
  deleteDetailRule,
  calculationRuleList,
};

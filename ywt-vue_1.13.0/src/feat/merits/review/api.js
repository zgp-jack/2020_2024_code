/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 14:25:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-24 16:40:57
 * @Description:绩效审核API接口
 */
import Fetch from '@/utils/fetch';
/**
 * 查询绩效审核列表
 * @param {String} evaluationCycle 统计周期 yyyy-mm
 * @param {String} roleIds 角色id用逗号隔开
 * @param {String} userIds 人员id用逗号隔开
 * @param {Number} deptId 科室id
 */
const list = ({
  pageNum = 0,
  pageSize = 10,
  evaluationCycle,
  roleIds,
  userIds,
  deptId,
} = {}) => Fetch.post('/bus/employeePerformance/queryByPage', {
  pageNum,
  pageSize,
  evaluationCycle,
  roleIds,
  userIds,
  deptId,
});
/**
 * 绩效最终审核
 * @param {Number} id 绩效id
 * @param {Number} state 审核状态 码表add_type
 * @param {String} note 备注
 */
const review = ({
  id,
  state,
  note,
} = {}) => Fetch.post('/bus/employeePerformance/auditPerformance', {
  id,
  state,
  note,
});
/**
 * 通过复议
 * @param {Number} gradeId 评分id
 * @param {String} finalScore 最终得分
 */
const passReconsider = ({ gradeId,
  finalScore,
} = {}) => Fetch.post('/bus/employeePerformance/reconsiderAuditBach', {
  auditVo: [{ gradeId, reconsiderAuditState: '1', finalScore, }],
});
/**
 * 通过复议
 * @param {Number} gradeId 评分id
 * @param {String} finalScore 最终得分
 */
const rejectReconsider = ({ gradeId,
  finalScore,
} = {}) => Fetch.post('/bus/employeePerformance/reconsiderAuditBach', {
  auditVo: [{ gradeId, reconsiderAuditState: '2', finalScore, }],
});

export default {
  list,
  review,
  passReconsider,
  rejectReconsider,
};

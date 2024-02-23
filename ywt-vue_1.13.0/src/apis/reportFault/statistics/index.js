/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-20 10:56:46
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-04-23 10:34:48
 * @Description:工单统计
 */
import Fetch from '@/utils/fetch';
/**
 *  来源分析
 * @param { }
 * @returns
 */
const source = ({
  deptId = null,
  startTime = null,
  endTime = null,
} = {}) => Fetch.post('/bus/statistics/source', {
  deptId,
  startTime,
  endTime,
});
/**
 * 故障分类
 * @param {*}
 * @returns
 */
const faultType = ({
  deptId = null,
  startTime = null,
  endTime = null,
  parentId = null,
} = {}) => Fetch.post('/bus/statistics/faultType', {
  deptId,
  startTime,
  endTime,
  parentId,
});
/**
 *  科室报修情况
 * @param {*} param0
 * @returns
 */
const deptReport = ({
  deptId,
  startTime,
  endTime,
} = {}) => Fetch.post('/bus/statistics/deptRepair', {
  deptId,
  startTime,
  endTime,
});
const engineer = ({
  deptId,
  startTime,
  endTime,
} = {}) => Fetch.post('/bus/statistics/engineer', {
  deptId,
  startTime,
  endTime,
});
/**
 * 常见故障
 * @param {*} param0
 * @returns
 */
const normalFault = ({
  deptId,
  startTime,
  endTime,
} = {}) => Fetch.post('/bus/statistics/commonFault', {
  deptId,
  startTime,
  endTime,
});
/**
 * 服务台
 * @param {*} param0
 * @returns
 */
const center = ({
  deptId,
  startTime,
  endTime,
} = {}) => Fetch.post('/bus/statistics/work', {
  deptId,
  startTime,
  endTime,
});
// 来源分析统计导出
const exportSource = ({
  deptId,
  startTime,
  endTime,
}
) => Fetch.post('/v1/post/bus/statistics/source/export', {
  deptId,
  startTime,
  endTime,
});
// 故障分类统计导出
const exportFaultType = ({
  deptId,
  startTime,
  endTime,
}
) => Fetch.post('/v1/post/bus/statistics/faultType/export', {
  deptId,
  startTime,
  endTime,
});
// 常见故障统计导出
const exportNormalFault = ({ deptId,
  startTime,
  endTime, } = {}) => Fetch.post('/v1/post/bus/statistics/commonFault', {
  deptId,
  startTime,
  endTime,
});
// 服务台
const exportCenter = ({
  deptId,
  startTime,
  endTime,
}) => Fetch.post('/v1/post/bus/statistics/work', {
  deptId,
  startTime,
  endTime,
});

export default {
  source,
  faultType,
  deptReport,
  normalFault,
  engineer,
  center,
  exportSource,
  exportFaultType,
  exportNormalFault,
  exportCenter,
};

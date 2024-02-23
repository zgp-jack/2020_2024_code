import request from '@/common/utils/request';

const query = {
  // * 部门id
  deptId: '',
  // * 结束时间(yyyy-MM-dd)
  endTime: '',
  // * 开始时间(yyyy-MM-dd)
  startTime: '',
};

// 来源分析统计
const getSourceAnalysis = (params = query) => request.post('/bus/statistics/source', params);

// 导出来源分析
const exportSourceAnalysis = (params = query) => request.post('/bus/statistics/exportSource', params, {
  responseType: 'blob',
});

// 故障分类统计
const getFaultTypeAnalysis = (params = query) => request.post('/bus/statistics/faultType', params);

// 导出导出故障分类
const exportFaultTypeAnalysis = (params = query) => request.post('/bus/statistics/exportFaultType', params);

// 科室报修情况(工单数量)
const getDeptRepair = (params = query) => request.post('/bus/statistics/deptRepair', params);

// 导出科室报修情况(工单数量)
const exportDeptRepair = (params = {}) => request.post('/bus/statistics/exportDeptRepair', params);
// 工程师排名(工单数量)
const getEngineerRank = (params = query) => request.post('/bus/statistics/engineer', params);

// 常见故障分类
const getCommonFaultType = (params = query) => request.post('/bus/statistics/commonFault', params);
// 服务台统计
const getStatisticsWork = (params = query) => request.post('/bus/statistics/work', params);

export default {
  getSourceAnalysis,
  exportSourceAnalysis,
  getFaultTypeAnalysis,
  exportFaultTypeAnalysis,
  getDeptRepair,
  exportDeptRepair,
  getEngineerRank,
  getCommonFaultType,
  getStatisticsWork,
};

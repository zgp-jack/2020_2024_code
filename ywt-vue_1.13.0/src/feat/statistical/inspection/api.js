/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-30 09:52:59
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 20:12:01
 * @Description:统计分析-巡检API
 */

import Fetch from '@/utils/fetch';
/**
 * 巡检统计
 * @param {String } template 1按工程师2按巡检单元3按巡检设备4按科室5按小组6按供应商
 */
const inspectionList = ({
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/inspection/count/getInspectionCount', {
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
});

/**
 * 巡检统计 导出Excel
 */
const inspectionListExportExcel = ({
  startTime,
  endTime,
  template,
} = {}) => Fetch.post('/inspection/count/inspectionCountExportExcel', {
  startTime,
  endTime,
  template,
});

export default {
  inspectionList,
  inspectionListExportExcel,
};

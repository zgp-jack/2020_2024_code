/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-30 09:55:05
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 20:47:09
 * @Description:统计分析-项目API
 */
import Fetch from '@/utils/fetch';

/**
 * 需求统计
 * @param {String } template 1小组2按工程师3按科室4按涉及系统
 */
const requirementList = ({
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/item/count/getDemandCount', {
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
});
/**
 * 项目统计
 * @param {String } template 1项目类型2项目负责人3项目级别4供应商
 */
const projectList = ({
  startTime,
  endTime,
  template,
} = {}) => Fetch.post('/item/count/getItemCount', {
  startTime,
  endTime,
  template,
});
/**
 * 项目任务统计
 * @param {String } template 1按人员2按小组3按供应商
 */
const projectTaskList = ({
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/item/count/getWorkCount', {
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
});
/**
 *项目工作统计
 * @param {*}
 * @returns
 */
const projectWorkList = ({
  pageNum,
  pageSize,
  date,
} = {}) => Fetch.post('/bus/item/progress/page', {
  pageNum,
  pageSize,
  date,
});

/**
 * 项目工时统计
 */
const projectWorkHourList = ({
  // 开始日期
  startTime,
  // 结束日期
  endTime,
  // 当前页
  pageNum,
  // 每页多少条
  pageSize,
  // 查询类型 user 负责人 team 小组 dept 科室 factory 供应商
  type,
} = {}) => Fetch.post('/v1/get/item/count/time', {
  startTime,
  endTime,
  pageNum,
  pageSize,
  type,
});
/**
 * 项目级别统计
 */
const projectLevelList = ({
  /**
     *  排序方向
     */
  direction,
  /**
    * 结束日期
    */
  endTime,
  /**
    * 排序列
    */
  orderBy,
  orderByAndDirection,
  /**
    * 当前页
    */
  pageNum,
  /**
    * 每页多少条
    */
  pageSize,
  /**
    * 开始日期
    */
  startTime,
  /**
    * 查询类型 user 负责人 team 小组 dept 科室 factory 供应商
    */
  type,
} = {}) => Fetch.post('/v1/get/item/count/level', {
  direction,
  endTime,
  orderBy,
  orderByAndDirection,
  pageNum,
  pageSize,
  startTime,
  type,
});

/**
 * 需求统计分析导出Excel
 */
const requirementListExportExcel = ({ template, startTime, endTime, }) => Fetch.post('/item/count/DemandCountExportExcel', { template, startTime, endTime, });

/**
 * 项目统计分析导出Excel
 */
const projectListExportExcel = ({ template, startTime, endTime, }) => Fetch.post('/item/count/exportItem', { template, startTime, endTime, });

/**
 * 项目任务统计Excel导出
 */
const projectTaskListExportExcel = ({ template, startTime, endTime, }) => Fetch.post('/item/count/exportWorkCount', { template, startTime, endTime, });
/**
 * 项目工作统计Excel导出
 */
const projectWorkListExportExcel = (date) => Fetch.post('/bus/item/progress/itemWorkExportExcel', { date, });
/**
 * 项目工时统计Excel导出
 */
const projectWorkHourListExportExcel = ({
  /**
     * 结束日期
     */
  endTime,
  /**
     * 开始日期
     */
  startTime,
  /**
     * 查询类型 user 负责人 team 小组 dept 科室 factory 供应商
     */
  type,
} = {}) => Fetch.post('/v1/get/item/count/time/export', {
  endTime,
  startTime,
  type,
});
/**
 * 项目级别统计 Excel导出
 */
const projectLevelListExportExcel = ({
  /**
     * 结束日期
     */
  endTime,
  /**
     * 开始日期
     */
  startTime,
  /**
     * 查询类型 user 负责人 team 小组 dept 科室 factory 供应商
     */
  type,
} = {}) => Fetch.post('/v1/get/item/count/level/export', {
  endTime,
  startTime,
  type,
});

export default {
  requirementList,
  projectList,
  projectTaskList,
  projectWorkList,
  projectWorkHourList,
  projectLevelList,
  requirementListExportExcel,
  projectListExportExcel,
  projectTaskListExportExcel,
  projectWorkListExportExcel,
  projectWorkHourListExportExcel,
  projectLevelListExportExcel,
};


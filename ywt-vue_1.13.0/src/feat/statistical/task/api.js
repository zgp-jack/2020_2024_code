/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-30 09:55:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 19:57:55
 * @Description:统计分析-任务API
 */
import Fetch from '@/utils/fetch';
/**
 * 任务统计
 * @param {String } template 1按任务类型2按工程师3按项目4按供应商
 */
const taskList = ({
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/item/count/getTaskCount', {
  startTime,
  endTime,
  template,
  pageNum,
  pageSize,
});

/**
 * 任务统计 导出Excel
 * @returns
 */
const taskListExportExcel = ({
  startTime,
  endTime,
  template,
} = {}) => Fetch.post('/item/count/exportTaskCount', {
  startTime,
  endTime,
  template,
});

export default {
  taskList,
  taskListExportExcel,
};

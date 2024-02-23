/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-30 09:54:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-06 17:54:35
 * @Description:统计分析-管理看板API
 */
import Fetch from '@/utils/fetch';

/**
 * 卡片信息
 * @param {String } type 0科内1供应商
 */

const cardsDetail = ({
  startTime,
  endTime,
  type,
} = {}) => Fetch.post('/manage/count/getManageCount', {
  startTime,
  endTime,
  type,
});
/**
 * 工作量统计
 * @param {String } type 0科内1供应商
 */

const workCountList = ({
  startTime,
  endTime,
  type,
  template,
} = {}) => Fetch.post('/manage/count/getManageCountList', {
  startTime,
  endTime,
  type,
  template,
});

const exportExcel = ({
  startTime,
  endTime,
  type,
  template, } = {}) => Fetch.post('/manage/count/manageCountListExportExcel', {
  startTime,
  endTime,
  type,
  template,
});

export default {
  cardsDetail,
  workCountList,
  exportExcel,
};

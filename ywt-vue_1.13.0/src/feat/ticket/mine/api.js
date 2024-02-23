/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-07 14:25:15
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-09 11:01:00
 * @Description:我的工单API
 */
import Fetch from '@/utils/fetch';

/**
 * 我的工单列表
 */
const list = ({
  query,
  pageNum,
  pageSize,
  currState,
  hospitalId,
} = {}) => Fetch.post('busOrderFault/myselfOrderPage', {
  query,
  pageNum,
  pageSize,
  currState,
  hospitalId,
});
/**
 * 红点数据
 */
const redData = () => Fetch.post('/busOrderFault/myselfOrderRed', {});
export default {
  list,
  redData,
};

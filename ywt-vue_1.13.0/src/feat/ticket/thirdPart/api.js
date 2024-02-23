/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-29 10:40:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 10:07:20
 * @Description:其他导入工单API
 */
import Fetch from '@/utils/fetch';
const list = ({
  pageNum = 0,
  pageSize = 10,
  faultRemark,
  startTime,
  endTime,
} = {}) => Fetch.post('/busCbOrderInfo/getPage', {
  pageNum,
  pageSize,
  faultRemark,
  startTime,
  endTime,
});
const detail = (ticketId) => Fetch.post('/busCbOrderInfo/getById', {
  id: ticketId,
});
export default {
  list,
  detail,
};

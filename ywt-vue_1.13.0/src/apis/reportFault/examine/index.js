/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 19:36:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-30 20:22:34
 * @Description:工单审核
 */
import request from '@/utils/request';
import Fetch from '@/utils/fetch';
// 驳回工单 工单审核未通过
export function rejectWorkOrder({ orderNum, reason, remark, }) {
  return request({
    url: '/busOrderExamine/reject',
    method: 'post',
    data: {
      orderNum,
      processValue: reason,
      remark,
    },
  });
}
// 批量通过工单
export function passWorkOrder({ orderNum, }) {
  return request({
    url: '/busOrderExamine/pass',
    method: 'post',
    data: {
      orderNum,
    },
  });
}
const list = ({
  pageNum,
  pageSize,
  query,
} = {}) => Fetch.post('/busOrderFault/auditOrderPage', {
  pageNum,
  pageSize,
  query,
});
export default {
  list,
};

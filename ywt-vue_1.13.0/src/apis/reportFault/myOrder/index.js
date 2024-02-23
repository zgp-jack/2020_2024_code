/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 19:33:12
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-30 17:31:32
 * @Description: 我的工单
 */
import request from '@/utils/request';
import Fetch from '@/utils/fetch';

// 工单接单
export function acceptWorkOrder(orderNum) {
  return request({
    url: '/busOrderFault/nextOrder',
    method: 'post',
    data: {
      orderNum,
    },
  });
}
export function rejectWorkOrder({ orderNum, reason, remark, }) {
  return request({
    url: '/busOrderFault/nextOrder',
    method: 'post',
    data: {
      orderNum,
      remark,
      processValue: reason,
      make: {
        makeType: 5,
      },
    },
  });
}
// 开启工单
export function restartWorkOrder(orderNum) {
  return request({
    url: '/busOrderFault/nextOrder',
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
} = {}) => Fetch.post('busOrderFault/myselfOrderPage', {
  pageNum,
  pageSize,
  query,
});
export default {
  list,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-07 14:25:15
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 17:33:56
 * @Description:工单审核API
 */
import Fetch from '@/utils/fetch';

/**
 * 工单审核列表
 */
const list = ({
  query,
  pageNum,
  pageSize,
  hospitalId,
  faultType,
  teamIds,
  infoStartTime,
  infoEndTime,
  completeStartTime,
  completeEndTime,
  departmentId,
  teamId,
} = {}) => Fetch.post('/busOrderFault/auditOrderPage', {
  query,
  pageNum,
  pageSize,
  hospitalId,
  faultType,
  teamIds,
  infoStartTime,
  infoEndTime,
  completeStartTime,
  completeEndTime,
  departmentId,
  teamId,
});
export default {
  list,
};

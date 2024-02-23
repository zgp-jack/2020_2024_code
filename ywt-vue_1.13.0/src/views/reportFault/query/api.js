/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-13 14:20:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-14 10:11:54
 * @Description:工单查询api
 */
import Fetch from '@/utils/fetch';
const list = ({
  pageNum = 0,
  pageSize = 10,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
} = {}) => Fetch.post('/busOrderFault/getSearchPage', {
  pageNum,
  pageSize,
  faultRemark,
  phone,
  deptId,
  faultType,
  createUser,
  currState,
  infoStartTime,
  infoEndTime,
  faultStartTime,
  faultEndTime,
  source,
  makeUser,
  teamIds,
});
export default {
  list,
};

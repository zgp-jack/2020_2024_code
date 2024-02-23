/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-29 16:14:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-30 15:56:57
 * @Description: 工单查询
 */

import Fetch from '@/utils/fetch';
/**
 * 工单查询
 * @param {
 *
 *  teamId 运维小组
 *  query 模糊查询
 *  pageNum
 *  pageSize
 *  orderState 工单状态
 *  makeUser 处理人
 *  createUser 建单人
 *  makeDate 建单日期(TimeStamp 逗号相连)
 *  completeDate 完成日期(TimeStamp 逗号相连)
 *
 *  } param0
 * @returns
 */
const query = (
  {
    pageNum = 0,
    pageSize = 10,
    faultFaultRemark,
    infoPhone,
    infoDeptId,
    faultFaultType,
    faultCreateUser,
    faultProcessState,
    infoCreateTime,
    makeCreateTime,
    faultCompleteTime,
    faultSource,
    makeMakeUser,
    teamIds,
  } = {}
) => Fetch.post('/busOrderFault/getSearchPage', {
  pageNum,
  pageSize,
  faultFaultRemark,
  infoPhone,
  infoDeptId,
  faultFaultType,
  faultCreateUser,
  faultProcessState,
  infoCreateTime,
  makeCreateTime,
  faultCompleteTime,
  faultSource,
  makeMakeUser,
  teamIds,
});
export default {
  query,
};

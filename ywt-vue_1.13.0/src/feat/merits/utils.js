/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-22 11:09:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-24 16:39:53
 * @Description:绩效工具
 */

/**
 * 是否显示复议tag
 * reconsiderState 是否复议 '1'复议
 * reconsiderAuditState 复议审核状态 '1'-通过 '2'-不通过
 */
export const showReconsiderTag = ({
  reconsiderState,
  reconsiderAuditState,
} = {}) => {
  return reconsiderState === '1';
};

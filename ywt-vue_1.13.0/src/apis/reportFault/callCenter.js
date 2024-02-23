/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-09 12:04:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-09 13:35:50
 * @Description:呼叫中心接口
 */

import Fetch from '@/utils/fetch';
/**
 * 获取当前坐席信息列表
 * @returns
 */
const onlineInfoList = () => Fetch.post('/sysSeatHistory/nowInfo', {});
/**
 * 获取分机号列表
 * @returns
 */
const extensionList = () => Fetch.post('/sysPhone/getLocalPhone', {});
export default {
  extensionList,
  onlineInfoList,
};

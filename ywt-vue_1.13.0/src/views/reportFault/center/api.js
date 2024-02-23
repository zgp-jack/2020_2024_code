/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-13 17:33:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-21 17:20:34
 * @Description:服务台API
 */
import Fetch from '@/utils/fetch';
/**
 * 红点数据
 */
const redInfo = () => Fetch.post('/busOrderInfo/getPcRedInfo', {});
/**
 * 无效电话
 * @param {Number} id 通话记录ID
 */
const invalidPhone = (id) => Fetch.post('/busOrderInfo/invalid', {
  id,
});
/**
 * 电话找人
 * @param {Number} id 通话记录ID
 * @param {Number} users 工程师ID
 */
const findPerson = ({
  id,
  users,
} = {}) => Fetch.post('/busOrderInfo/endLook', {
  id,
  users,
});
export default {
  redInfo,
  invalidPhone,
  findPerson,
};

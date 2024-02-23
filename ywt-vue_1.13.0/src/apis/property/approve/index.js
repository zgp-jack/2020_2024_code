/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-16 14:19:56
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-16 14:47:37
 * @Description:审批管理
 */
import Fetch from '@/utils/fetch';
/**
 * 获取审核详情
 * @param {*} id 审核id
 * @returns
 */
const detail = (id) => Fetch.post('/bus/assets/review/get', {
  id,
});
/**
 * 审核通过
 * @param {
 * id 变更ID
 * remark 备注
 * } param0
 * @returns
 */
const pass = ({
  id,
  remark,
} = {}) => Fetch.post('/bus/assets/review/pass', {
  id,
  remark,
});
/**
 * 审核驳回
 * @param {
 * id 变更ID
 * remark 备注
 * } param0
 * @returns
 */
const reject = ({
  id,
  remark,
} = {}) => Fetch.post('/bus/assets/review/reject', {
  id,
  remark,
});
export default {
  detail,
  pass,
  reject,
};

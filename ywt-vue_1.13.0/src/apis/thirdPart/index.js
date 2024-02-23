/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-09 16:40:12
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-15 10:20:01
 * @Description:第三方厂家
 */
import Fetch from '@/utils/fetch';
/**
 * (供应商)厂家品牌列表
 * @returns
 */
const supplierList = () => Fetch.post('/sys/dic/manufacturer/list/supplier', {});
/**
 * (生产厂商)厂家品牌列表
 * @returns
 */
const manufacturerList = () => Fetch.post('/sys/dic/manufacturer/list/output', {});
export default {
  supplierList,
  manufacturerList,
};

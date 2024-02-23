/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-07 18:32:34
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-06 10:00:34
 * @Description:生成报告接口
 */
import Fetch from '@/utils/fetch';

// 初始化项目报告 - 后台需要用户勾选的数据
const make = ({
  itemCode,
  makeItems,
} = {}) => Fetch.post('bus/itemReport/make', {
  itemCode,
  makeItems,
});
// 获取对应报告
const getByModule = ({
  itemCode,
  makeItems,
} = {}) => Fetch.post('bus/itemReport/getByModule', {
  itemCode,
  makeItems,
});
// 下载项目文件
const downloadItem = ({
  itemCode,
  items,
  isAll,
} = {}) => Fetch.post('bus/itemReport/downloadItem', {
  itemCode,
  items,
  isAll,
}, { responseType: 'blob', },);

export default {
  make,
  getByModule,
  downloadItem,
};


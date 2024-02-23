/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-24 10:05:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-24 10:36:10
 * @Description: 模板关联API
 */
import Fetch from '@/utils/fetch';
/**
 *
 * @param {String} unitIds 巡检单元id用逗号拼接的字符串
 */
const qrCode = (unitIds) => Fetch.post('/bus/inspection/plan/unit/qrcode', {
  unitId: unitIds,
});
export default {
  qrCode,
};

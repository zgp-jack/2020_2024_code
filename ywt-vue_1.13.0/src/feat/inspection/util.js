/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 18:30:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-04 18:44:41
 * @Description:
 */
import store from '@/store';
const frequencyUnitData = store.state['dictionary']['dicList']['frequencyUnit'] || [];
const frequencyUnitMap = {};
frequencyUnitData.map(item => {
  frequencyUnitMap[item.value] = item.name;
});
// 转换巡检频次
export const convertInspectionFrequency = ({ frequencyTimer, frequencyInterval, frequencyUnit, } = {}) => {
  return `${frequencyTimer}次/${frequencyInterval}${frequencyUnitMap[frequencyUnit]}`;
};

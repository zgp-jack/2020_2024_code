/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-25 17:47:26
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-08-26 09:52:02
 * @Description:巡检私用方法
 */
import store from '@/store';
const valueUnitMap = {};
store.state.dictionary.dicList.valueUnit?.map(item => {
  valueUnitMap[item.value] = {
    name: item.name,
    label: item.parm,
  };
});
const operatorMap = {};
store.state.dictionary.dicList.comparatorSymbol?.map(item => {
  operatorMap[item.value] = item.name;
});

/**
 * 转换异常值域-数值
 * @param  {} exceptionValueStr 异常值域
 * @param  {} valueUnit 单位
 */
export const convertExceptionValue = (exceptionValueStr, valueUnit) => {
  const exceptionValueArr = JSON.parse(exceptionValueStr);
  const unit = valueUnitMap[valueUnit]?.label || '';
  return exceptionValueArr.map(item => {
    return `${item.logicOperator || ''} ${operatorMap[item.operator]} ${item.value}${unit}`;
  }).join(' ');
};
/**
 * 转换默认值-数值
 * @param  {} defaultValue 默认值
 * @param  {} valueUnit 单位
 */

export const convertDefaultValue = (defaultValue, valueUnit) => {
  return `${defaultValue} ${valueUnitMap[valueUnit]?.label || ''}`;
};

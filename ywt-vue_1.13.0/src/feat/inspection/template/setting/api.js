/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-04 18:03:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-04 18:16:55
 * @Description:巡检模板设置API
 */
import Fetch from '@/utils/fetch';
/**
 * 新增模板
 * @param {
 *  name  模版名称（长度限定50）
 *  deptId 科室
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 频次单位（数据字典：frequencyUnit）
 *  hasImage 必须上传照片（1【默认】：是，0：否）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *
 *
 * } param0
 * @returns
 */
const create = ({
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
} = {}) => Fetch.post('/bus/inspection/temp/save', {
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
});
/**
 * 修改模板
 * @param {
 *  id
 *  name  模版名称（长度限定50）
 *  deptId 科室
 *  frequencyTimer 频次
 *  frequencyInterval 周期
 *  frequencyUnit 频次单位（数据字典：frequencyUnit）
 *  hasImage 必须上传照片（1【默认】：是，0：否）
 *  errorMake 巡检异常办法（字典：errorMake）
 *  state 是否启用（1【默认】：是，0：否）
 *  isEffect 是否立即生效（1：是，0【默认】：否）
 *
 * } param0
 * @returns
 */
const update = ({
  id,
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
  isEffect,
} = {}) => Fetch.post('/bus/inspection/temp/update', {
  id,
  name,
  deptId,
  frequencyTimer,
  frequencyInterval,
  frequencyUnit,
  hasImage,
  errorMake,
  state,
  isEffect,
});
/**
 * 模板列表
 * @param {
 *  pageSize
 *  pageNum
 *  query
 *
 * } param0
 * @returns
 */
const list = ({
  pageSize,
  pageNum,
  query,
} = {}) => Fetch.post('/bus/inspection/temp/page', {
  pageSize,
  pageNum,
  query,
});
/**
 * 快速开启/禁用模板
 * @param {
 *  state 是否启用（1【默认】：启用，0：关闭）
 *  id
 * } param0
 * @returns
 */
const changeState = ({
  state,
  id,
} = {}) => Fetch.post('/bus/inspection/temp/openOrClose', {
  state,
  id,
});
export default {
  create,
  update,
  list,
  changeState,
};

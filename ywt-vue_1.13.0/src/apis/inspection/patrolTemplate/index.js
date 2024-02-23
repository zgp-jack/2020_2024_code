/*
    巡检模板设置
*/

import request from '@/utils/request';
import Fetch from '@/utils/fetch';

// 模板设置 编辑模板
export function updateTemplate(Data) {
  return request({
    url: '/busPatrolTemplate/updateTemplate',
    method: 'post',
    data: Data,
  });
}

// 模板设置 删除模板
export function delTemplate(id) {
  return request({
    url: '/busPatrolTemplate/delTemplate',
    method: 'post',
    data: id,
  });
}

// 模板设置 保存模板
export function saveTemplate(Data) {
  return request({
    url: '/busPatrolTemplate/saveTemplate',
    method: 'post',
    data: Data,
  });
}

// 模板设置  获取模板详情
export function getTemplate(id) {
  return request({
    url: '/busPatrolTemplate/getTemplate',
    method: 'post',
    data: id,
  });
}

// 模板设置 获取模板表格信息
export function getTemplates({ pageNum, pageSize, deptId, }) {
  return request({
    url: '/busPatrolTemplate/getTemplates',
    method: 'post',
    data: { pageNum, pageSize, deptId, },
  });
}
/**
 * 巡检模板列表
 * @param {*} param0
 * @returns
 */
const list = ({
  pageNum = 0,
  pageSize = 10,
  deptId = null,
} = {}) => Fetch.post('/busPatrolTemplate/getTemplates', {
  pageNum,
  pageSize,
  deptId,
});
/**
 * 删除模板
 * @param {*} id
 * @returns
 */
const deleteTemp = (id) => Fetch.post('/busPatrolTemplate/delTemplate', {
  id,
});
/**
 * 启用模板
 * @param {*} id
 * @returns
 */
const enableTemp = (id) => Fetch.post('/busPatrolTemplate/openTemplate', {
  id,
});
/**
 * 禁用模板
 * @param {*} id
 * @returns
 */
const disableTemp = (id) => Fetch.post('', {
  id,
});
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
export default {
  list,
  deleteTemp,
  enableTemp,
  disableTemp,
  create,
};

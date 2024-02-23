/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-14 09:45:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-15 01:50:16
 * @Description: 数据字典API
 */
import Fetch from '@/utils/fetch';

/**
 * 字典列表
 * @param {String} dictName 字典名
 * @param {String} authority 字典级别(1可编辑2仅查看)
 * @param {String} type 层级(0单层1多层)
 */
const list = ({
  pageNum,
  pageSize,
  dictName,
  authority,
  type,
} = {}) => Fetch.post('/sysDicCatalog/getPage', {
  pageNum,
  pageSize,
  dictName,
  authority,
  type,
});
/**
 * 字典开关
 *  @param {String} id 字典id
 *  @param {String} state 状态 1启用0禁用
 */
const changeState = ({
  id,
  state,
} = {}) => Fetch.post('/sysDicInfo/editStates', {
  id,
  state,
});
/**
 * 字典目录更新
 *  @param {String} id 字典id
 *  @param {String} name 字典名
 */
const updateCategory = ({
  id,
  name,
} = {}) => Fetch.post('/sysDicCatalog/update', {
  id,
  name,
});
/**
 * 字典列表项
 */
const itemList = ({
  pageNum = 0,
  pageSize = 9999,
  catalogId,
  parentId,
} = {}) => Fetch.post('/sysDicInfo/getPage', {
  pageNum,
  pageSize,
  catalogId,
  parentId,
});
/**
 * 添加子项
 */
const addItem = ({
  categoryId,
  parentId,
  id,
  name,
  state,
} = {}) => Fetch.post('/sysDicInfo/saveOrUpdate', {
  catalogId: categoryId,
  parentId,
  id,
  name,
  state,
});
/**
 * 删除子项
 */
const deleteItem = (id) => Fetch.post('/sysDicInfo/delete', {
  id,
});
export default {
  list,
  changeState,
  updateCategory,
  itemList,
  addItem,
  deleteItem,
};

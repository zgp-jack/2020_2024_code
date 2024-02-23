/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-28 17:12:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-28 17:33:40
 * @Description:普通字典API
 */
import Fetch from '@/utils/fetch';

/**
 * 普通数据字典类目-创建
 */

const create = ({
  name,
  value,
  state,
} = {}) => Fetch.post('sysDicCatalog/saveOrUpdate', {
  name,
  value,
  state,
});
/**
 * 普通数据字典类目-更新
 */
const update = ({
  name,
  value,
  state,
  id,
} = {}) => Fetch.post('sysDicCatalog/saveOrUpdate', {
  name,
  value,
  state,
  id,
});
/**
 * 普通数据字典类目-列表
 */
const list = ({
  pageNum = 0,
  pageSize = 9999,
} = {}) => Fetch.post('sysDicCatalog/getPage', {
  pageNum,
  pageSize,
});
/**
 * 普通数据字典类目详情-列表
 */
const itemList = ({
  pageNum,
  pageSize,
  catalogId,
  parentId,
} = {}) => Fetch.post('/sysDicInfo/getPage', {
  pageNum,
  pageSize,
  catalogId,
  parentId,
});
/**
 * 普通数据字典类目详情-新增
 */
const createItem = ({
  catalogId,
  name,
  value,
  orderNum = 1,
  parentId,
  parm,
} = {}) => Fetch.post('/sysDicInfo/saveOrUpdate', {
  catalogId,
  name,
  value,
  orderNum,
  parentId,
  parm,
});
/**
 * 普通数据字典类目详情-编辑
 */
const updateItem = ({
  id,
  catalogId,
  name,
  value,
  orderNum = 1,
  parentId,
  state,
  parm,
} = {}) => Fetch.post('/sysDicInfo/saveOrUpdate', {
  id,
  catalogId,
  name,
  value,
  orderNum,
  parentId,
  state,
  parm,
});
/**
 * 普通数据字典类目详情-删除
 */
const deleteItem = (id) => Fetch.post('/sysDicInfo/delete', { id, });
export default {
  create,
  update,
  list,
  itemList,
  createItem,
  deleteItem,
  updateItem,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 14:31:32
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 14:32:34
 * @Description:知识库检索接口
 */
import Fetch from '@/utils/fetch';
/**
 * 知识库列表
 */
const list = ({
  pageNum,
  pageSize,
  createUser,
  startTime,
  endTime,
  query,
  type,
} = {}) => Fetch.post('/bus/learning/list', {
  pageNum,
  pageSize,
  createUser,
  startTime,
  endTime,
  query,
  type,
});
/**
 *创建知识
 */
const create = ({
  title,
  type,
  causes,
  question,
  answer,
  attrs,
} = {}) => Fetch.post('/bus/learning/create', {
  title,
  type,
  causes,
  question,
  answer,
  attrs,
});
/**
 *更新知识
 */
const update = ({
  id,
  title,
  type,
  causes,
  question,
  answer,
  attrs,
}) => Fetch.post('/bus/learning/update', {
  id,
  title,
  type,
  causes,
  question,
  answer,
  attrs,
});
/**
 *删除知识
 */
const deleteKnowledge = (id) => Fetch.post('/bus/learning/delete', {
  id,
});
/**
 *知识详情
 */
const detail = (id) => Fetch.post('/bus/learning/detail', {
  id,
});
/**
 *知识分类列表
 */
const classificationList = () => Fetch.post('/bus/learning/typeStatis', {});
export default {
  list,
  create,
  update,
  delete: deleteKnowledge,
  detail,
  classificationList,
};


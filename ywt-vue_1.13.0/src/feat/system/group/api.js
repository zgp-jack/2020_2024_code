/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-21 18:55:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-27 17:46:26
 * @Description: 分组管理API
 */
import Fetch from '@/utils/fetch';
/**
 * 创建分组
 */
const create = ({
  name,
  leader,
  deptId,
  content,
  users,
} = {}) => Fetch.post('/busMaintainTeam/save', {
  name,
  leader,
  deptId,
  content,
  users,
});
/**
 * 更新分组
 */
const update = ({
  id,
  name,
  leader,
  deptId,
  content,
  users,
} = {}) => Fetch.post('/busMaintainTeam/update', {
  id,
  name,
  leader,
  deptId,
  content,
  users,
});
/**
 * 删除分组
 */
const deleteGroup = (id) => Fetch.post('/busMaintainTeam/delete', {
  id,
});
/**
 * 获取分组列表
 * @param {*} {
 *  pageNum
 *  pageSize
 *  state
 *  deptId 科室id 不传获取全部
 *  query
 * }
 */
const list = ({
  pageNum = 0,
  pageSize = 9999,
  state = 1,
  deptId = null,
  query = null,
} = {}) => Fetch.post('/busMaintainTeam/getPage', {
  pageNum,
  pageSize,
  state,
  deptId,
  query,
});
/**
 * 获取运维小组详情
 * @param {*} id
 * @returns
 */
const detail = (id) => Fetch.post('/busMaintainTeam/get', {
  id,
});
/**
 * 获取自身为组长的所有运维小组
 * @returns
 */
const ownTeamList = () => Fetch.post('/busMaintainTeam/getLeaderTeam', {});
export default {
  create,
  update,
  delete: deleteGroup,
  detail,
  list,
  ownTeamList,
};

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-19 15:53:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-07 11:25:51
 * @Description:
 */
import request from '@/utils/request';
import Fetch from '@/utils/fetch';

// // 获取运维小组列表
// export function getGroupList() {
//   return request({
//     url: '/busMaintainTeam/getList',
//     method: 'post',
//     data: {},
//   });
// }
// 通过上级id获取运维小组分页列表
export function getGroupListByDeptId(deptId, pageSize, pageNum,) {
  return request({
    url: '/busMaintainTeam/getPage',
    method: 'post',
    data: {
      deptId,
      pageSize,
      pageNum,
    },
  });
}
// 创建运维小组
export function createGroup(data) {
  return request({
    url: '/busMaintainTeam/save',
    method: 'post',
    data,
  });
}

// 修改运维小组
export function updateGroup(data) {
  return request({
    url: '/busMaintainTeam/update',
    method: 'post',
    data,
  });
}
// 删除运维小组
export function deleteGroup(id) {
  return request({
    url: '/busMaintainTeam/delete',
    method: 'post',
    data: {
      id,
    },
  });
}

/**
 * 获取分组列表
 * @param {*} {
 *  pageNum
 *  pageSize
 *  state
 *  deptId 科室id 不传获取全部
 *  query
 * }
 * @returns
 */
const getGroupList = ({
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
 * 获取自身为队长所属运维小组
 * @returns
 */
const ownTeamList = () => Fetch.post('/busMaintainTeam/getLeaderTeam', {});
/**
 * 获取运维小组详情
 * @param {*} id
 * @returns
 */
const detail = (id) => Fetch.post('/busMaintainTeam/get', {
  id,
});
/**
  * 获取某个用户所在的小组
  * @param {*} userId
  * @returns
  */
const userByGroupInfo = (userId) => Fetch.post('/busMaintainTeam/getByUserId', {
  userId,
});
export default {
  list: getGroupList,
  ownTeamList,
  detail,
  userByGroupInfo,
};


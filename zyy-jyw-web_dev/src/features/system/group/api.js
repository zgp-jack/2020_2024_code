import request from '@/common/utils/request';

export function getTeamList(data) {
  return request.get('/system/team/list', data);
}

export function addTeam(data = {}) {
  return request.post('/system/team', data);
}

export function editTeam(data = {}) {
  return request.put('/system/team', data);
}

export function delTeam(userId) {
  return request.delete(`/system/team/${userId}`, {});
}

export function getTeamUserList({
  pageNum,
  pageSize,
  teamId,
  userName,
  phonenumber,
} = {}) {
  return request.get('/system/user/team/list', {
    params: {
      pageNum,
      pageSize,
      teamId,
      userName,
      phonenumber,
    },
  });
}

/* 查询小组未选用户 */
export function getUserNotSelectList({
  pageNum,
  pageSize,
  teamId,
  userName,
  phonenumber,
} = {}) {
  return request.get('/system/user/team/notSelectList', {
    params: {
      pageNum,
      pageSize,
      teamId,
      userName,
      phonenumber,
    },
  });
}

export function addTeamUser(data) {
  return request.post('/system/user/team', data);
}

export function removeTeamUser(ids) {
  return request.delete(`/system/user/team/${ids}`, {});
}

export function setLeader(data = {}) {
  return request.put('/system/user/team/leader', data);
}

/**
 * 获取小组缓存
 */
const getCachedList = () => request.get('/system/team/cache');
export default {
  getCachedList,
};

import request from '@/utils/request';

// 创建运维小组
export function saveGroup(data,) {
  return request({
    url: '/busMaintainTeam/save',
    method: 'post',
    data: data,
  });
}
// 修改运维小组
export function updateGroup(data,) {
  return request({
    url: '/busMaintainTeam/update',
    method: 'post',
    data: data,
  });
}
// 删除运维小组
export function deleteGroup({ id, }) {
  return request({
    url: '/busMaintainTeam/delete',
    method: 'post',
    data: { id, },
  });
}
// 获取运维小组分页信息
export function getPage({ pageNum, pageSize, name, }) {
  return request({
    url: '/busMaintainTeam/getPage',
    method: 'post',
    data: { pageNum, pageSize, name, },
  });
}
// 获取运维小组下拉列表
export function getList({ data, }) {
  return request({
    url: '/busMaintainTeam/getList',
    method: 'post',
    data: { data, },
  });
}
// 获取运维小组详情内容
export function getGroup({ id, }) {
  return request({
    url: '/busMaintainTeam/get',
    method: 'post',
    data: { id, },
  });
}
// 获取运维小组树状列表
export function getTree({ deptId, }) {
  return request({
    url: '/busMaintainTeam/getTree',
    method: 'post',
    data: { deptId, },
  });
}

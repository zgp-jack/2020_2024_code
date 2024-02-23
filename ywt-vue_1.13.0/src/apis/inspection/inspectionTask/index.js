/*
巡检  巡检任务

*/
import request from '@/utils/request';

// 巡检
export function saveOrUpdateUnit({ assets_id, assets_type_id, unit_id, }) {
  return request({
    url: '/busPatrol/goPatrol',
    method: 'post',
    data: { assets_id, assets_type_id, unit_id, },
  });
}
// 获取资产巡检已关联的内容
export function getPatrol({ id, type, }) {
  return request({
    url: '/busPatrol/getPatrol',
    method: 'post',
    data: { id, type, },
  });
}
// 编辑巡检
export function updatePatrol({ assets_id, assets_type_id, unit_id, }) {
  return request({
    url: '/busPatrol/updatePatrol',
    method: 'post',
    data: { assets_id, assets_type_id, unit_id, },
  });
}
// 获取资产巡检历史和最近第一条记录
export function getPatrolHistory({ id, type, }) {
  return request({
    url: '/busPatrol/getPatrolHistory',
    method: 'post',
    data: { id, type, },
  });
}
// 获取资产巡检历史详情
export function getPatrolHistoryById({ id, }) {
  return request({
    url: '/busPatrol/getPatrolHistoryById',
    method: 'post',
    data: { id, },
  });
}

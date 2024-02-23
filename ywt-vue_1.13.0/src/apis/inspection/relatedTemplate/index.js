/*
巡检  模板关联

*/
import request from '@/utils/request';
// 关联资产或类别
export function relatedTemplate(data) {
  return request({
    url: '/busPatrolTemplate/relatedTemplate',
    method: 'post',
    data: data,
  });
}

// 获取资产关联的模板
export function getRelatedTemplate(data) {
  return request({
    url: '/busPatrolTemplate/getRelatedTemplate',
    method: 'post',
    data: data,
  });
}

// 修改关联资产或类别
export function updateRelatedTemplate({ id, type, }) {
  return request({
    url: '/busPatrolTemplate/updateRelatedTemplate',
    method: 'post',
    data: { id, type, },
  });
}

// 删除资产关联的模板
export function delRelatedTemplate({ id, }) {
  return request({
    url: '/busPatrolTemplate/delRelatedTemplate',
    method: 'post',
    data: { id, },
  });
}

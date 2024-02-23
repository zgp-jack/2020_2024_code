/*
巡检  巡检单元

*/
import request from '@/utils/request';

// 保存或修改巡检单元(不巡检)
export function saveOrUpdateUnit(data) {
  return request({
    url: '/busPatrolUnit/saveOrUpdateUnit',
    method: 'post',
    data: data,
  });
}
// 保存或修改巡检单元(巡检)
export function saveOrUpdateUnitByPatrol({ data, }) {
  return request({
    url: '/busPatrolUnit/saveOrUpdateUnitByPatrol',
    method: 'post',
    data: { data, },
  });
}
// 获取巡检单元列表
export function getUnitList() {
  return request({
    url: '/busPatrolUnit/getUnitList',
    method: 'post',
    data: '',
  });
}
// 获取巡检单元
export function getUnit(id) {
  return request({
    url: '/busPatrolUnit/getUnit',
    method: 'post',
    data: id,
  });
}
// 删除巡检单元
export function delUnit(id) {
  return request({
    url: '/busPatrolUnit/delUnit',
    method: 'post',
    data: id,
  });
}

import request from '@/utils/request';
/**
 * 获取运维小组下拉列表
 *
 */
export function getOperationsTeam() {
  return request({
    url: '/busMaintainTeam/getList',
    method: 'post',
    data: {},
  });
}

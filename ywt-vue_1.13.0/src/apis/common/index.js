import request from '@/utils/request';

// 获取table表头
export function getTableColumns(data) {
  return request({
    url: 'busItemGaugeOutfit/getByUserId',
    method: 'post',
    data,
  });
}

// 修改table表头
export function setTableColumns(data) {
  return request({
    url: 'busItemGaugeOutfit/saveOrUpdate',
    method: 'post',
    data,
  });
}

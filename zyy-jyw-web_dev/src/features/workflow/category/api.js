import request from '@/common/utils/request';

export function pageList({
  categoryName,
  code,
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/flowable/category/list`, {
    params: {
      categoryName, code, pageNum, pageSize,
    },
  });
}

export function addData(data) {
  return request.post('/flowable/category/add', data);
}

export function editData(data) {
  return request.put('/flowable/category/edit', data);
}

export function removeIds(ids) {
  return request.delete(`/flowable/category/${ids}`);
}

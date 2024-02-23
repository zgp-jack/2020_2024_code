import request from '@/common/utils/request';

/* 分页查询流程部署 */
export function pageList({
  modelKey,
  modelName,
  category,
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/flowable/deploy/list`, {
    params: {
      modelKey, modelName, category, pageNum, pageSize,
    },
  });
}
/* 版本历史 */
export function getPublishList(data) {
  return request.get('/flowable/deploy/publishList', data);
}

export function addUnit(data) {
  return request.post('/flowable/deploy/add', data);
}

export function editUnit(data) {
  return request.put('/flowable/deploy/edit', data);
}

export function removeIds(ids) {
  return request.delete(`/flowable/deploy/${ids}`, {});
}

/* 获取流程分类 */
export function getAllList(data) {
  return request.get('/flowable/category/getList', data);
}

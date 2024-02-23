import request from '@/common/utils/request';

export function pageList({
  modelKey,
  modelName,
  category,
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/flowable/model/list`, {
    params: {
      modelKey, modelName, category, pageNum, pageSize,
    },
  });
}

export function getBpmnXml(modelId) {
  return request.get('/flowable/model/bpmnXml/' + modelId);
}

export function addData(data) {
  return request.post('/flowable/model/add', data);
}

/* 保存模型 */
export function saveData(data) {
  return request.post('/flowable/model/save', data);
}

/* 部署模型 */
export function deployModel(data) {
  return request.post('/flowable/model/deploy', data);
}

export function editData(data) {
  return request.put('/flowable/model/edit', data);
}

export function removeIds(ids) {
  return request.delete(`/flowable/model/${ids}`);
}

/* 获取流程分类 */
export function getAllList(data) {
  return request.get('/flowable/category/getList', data);
}

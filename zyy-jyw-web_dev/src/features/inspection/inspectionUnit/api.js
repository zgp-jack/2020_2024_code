import request from '@/common/utils/request';

export function getList({
  unitName,
  isEnable,
  directory,
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/inspection/unit/list`, {
    params: {
      unitName, isEnable, directory, pageNum, pageSize,
    },
  });
}

export function findAstById(data) {
  return request.get('/inspection/unit/findAstById/' + data);
}

/* 巡检单元资产选择列表 */
export function unitAstList({
  astIdList,
  pertainUnit,
  pageNum,
  pageSize,
} = {}) {
  return request.get(`/inspection/unit/unitAstList`, {
    params: {
      astIdList, pertainUnit, pageNum, pageSize,
    },
  });
}

export function editState(data) {
  return request.put('/inspection/unit/editState', data);
}

export function addUnit(data) {
  return request.post('/inspection/unit/add', data);
}

export function editUnit(data) {
  return request.put('/inspection/unit/edit', data);
}

export function removeIds(ids) {
  return request.delete(`/inspection/unit/${ids}`, {});
}

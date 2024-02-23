import request from '@/common/utils/request';

export function getMenuListData(data) {
  return request.get('/system/formConfig/queryMenuList', data);
}

export function getFormListData(data) {
  return request.get('/system/formConfig/queryListByMenuId', data);
}

export function getFormConfigListData(data) {
  return request.get('/system/formConfigColumn/queryListByFormId', data);
}

export function updateFormConfigListData(data) {
  return request.put('/system/formConfigColumn/updateList', data);
}

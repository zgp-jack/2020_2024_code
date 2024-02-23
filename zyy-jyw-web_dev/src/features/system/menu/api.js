import request from '@/common/utils/request';

export function listMenu({
  menuName,
  status,
} = {}) {
  return request.get('/system/menu/list', { params: {
    menuName, status, }, });
}

export function addData(data) {
  return request.post('/system/menu/', data);
}

export function editData(data) {
  return request.put('/system/menu/', data);
}

export function removeId(menuId) {
  return request.delete(`/system/menu/` + menuId);
}

export function getRouters() {
  return request.get('/system/menu/getRouters');
}

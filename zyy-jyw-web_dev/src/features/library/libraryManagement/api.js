import request from '@/common/utils/request';

const getknowledgeData = (params = {
  updateEndTime: '',
  updateStartTime: '',
  applyStatus: '',
  createUser: [],
  faultType: '',
  parentFaultType: '',
  title: '',
}) => {
  return request.get('/knowledge/knowledge/passList', {
    params,
  });
};

const editStateData = (data) => {
  return request.put('/knowledge/knowledge/editState', data);
};

const deleteknowledge = (ids) => {
  return request.delete(`/knowledge/knowledge/${ids}`);
};

export default {
  getknowledgeData,
  editStateData,
  deleteknowledge,
};

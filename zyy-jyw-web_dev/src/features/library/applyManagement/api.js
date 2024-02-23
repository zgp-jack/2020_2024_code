import request from '@/common/utils/request';

const getApplyListData = (params = {
  applyEndTime: '',
  applyStartTime: '',
  applyStatus: '',
  createUser: '',
  faultType: '',
  parentFaultType: '',
  title: '',
}) => {
  return request.get('/knowledge/apply/applyList', {
    params,
  });
};

const addKnowledgeData = (data) => {
  return request.post('/knowledge/apply/add', data);
};

const updateknowledge = (data) => {
  return request.put('/knowledge/apply/edit', data);
};

const getDetailData = (id) => {
  return request.get(`/knowledge/apply/${id}`);
};

const deleteKnowledge = (ids) => {
  return request.delete(`/knowledge/apply/${ids}`);
};

const passKnowledge = (data) => {
  return request.put('/knowledge/apply/pass', data);
};

const rejectKnowledge = (data) => {
  return request.put('/knowledge/apply/reject', data);
};

const updateKnowledgeEdit = (data) => {
  return request.put('/knowledge/knowledge/edit', data);
};

export default {
  getApplyListData,
  addKnowledgeData,
  updateknowledge,
  getDetailData,
  deleteKnowledge,
  passKnowledge,
  rejectKnowledge,
  updateKnowledgeEdit,
};

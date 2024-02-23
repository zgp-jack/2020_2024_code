import request from '@/common/utils/request';

const getListData = (params) => {
  return request.get('/obstacles/repair/page', {
    params,
  });
};

const updateReminder = (data) => {
  return request.put('/obstacles/repair/reminder', data);
};

const updateTermination = (data) => {
  return request.put('/obstacles/repair/termination', data);
};

const updateEvaluate = (data) => {
  return request.post('/obstacles/repair/evaluate', data);
};

const getListByKeyword = ({
  data,
} = {}) => {
  return request.post('/knowledge/knowledge/getListByKeyword', {
    data,
  });
};

export default {
  getListData,
  updateReminder,
  updateTermination,
  updateEvaluate,
  getListByKeyword,
};

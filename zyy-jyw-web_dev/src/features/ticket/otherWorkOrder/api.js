import request from '@/common/utils/request';

// 获取其他工单列表
const getOtherWorkOrderList = (params = {
  pageNum: '',
  pageSize: '',
}) => request.post('/obstacles/obsCbOrderInfo/getPageCbOrderInfo', params);

export default {
  getOtherWorkOrderList,
};

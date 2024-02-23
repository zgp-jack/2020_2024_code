
import Fetch from '@/utils/fetch';
/**
 * 通话记录列表
 */
const list = ({
  type,
  startTime,
  endTime,
  outPhone,
  helpDeskUser,
  pageSize,
  pageNum,
} = {}) => Fetch.post('/v1/get/order/phone/record', {
  type,
  startTime,
  endTime,
  outPhone,
  helpDeskUser,
  pageSize,
  pageNum,
});
export default {
  list,
};

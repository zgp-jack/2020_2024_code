
import request from '@/common/utils/request';
/**
 * 通话记录列表
 */
const callRecordList = ({
  // * 处置类型
  dealType,
  // 结束时间(yyyy-MM-dd HH:mm:ss)
  endTime,
  // 电话号码/工单号
  keywords,
  // 坐席人id
  reception,
  // 开始时间(yyyy-MM-dd HH:mm:ss)
  startTime,
  // 电话类型：0已接，1呼出，2未接
  type,
  pageNum,
  pageSize,
} = {}) => request.post('/obstacles/call/recordList', {
  pageSize,
  pageNum,
  dealType,
  endTime,
  keywords,
  reception,
  startTime,
  type,
});
export default {
  callRecordList,
};

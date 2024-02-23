import Fetch from '@/utils/fetch';

/**
 *  保存会议室
 *  name:名称,
 *  peopleNumber:容纳人数,
 *  deptHospitalId:院区Id,
 *  state:是否启用 -1删除 0禁用 1启用,
 *  deptId:科室id,
 *  devices:设备value,
 *  reserve:是否接受预定  0否  1是,
 *  address:地址,
 *  timeCell:最小时间单元,
 *  orders:排序,
 *  time_quantum:时间段,
 *
 */
const saveMeetingRoom = ({
  id,
  name,
  peopleNumber,
  deptHospitalId,
  state,
  deptId,
  devices,
  reserve,
  address,
  timeCell,
  orders,
  busMeetingRoomTimeDtos,
} = {}) => Fetch.post('bus/busMeetingRoom/saveOrUpdateRoomInfo', {
  id,
  name,
  peopleNumber,
  deptHospitalId,
  state,
  deptId,
  devices,
  reserve,
  address,
  timeCell,
  orders,
  busMeetingRoomTimeDtos,

});

/**
 * 获取会议室列表
 * @param {*} param0
 * @returns
 */
const getMeetingRoomList = ({
  pageSize,
  pageNum,
  query,
} = {}) => Fetch.post('bus/busMeetingRoom/page', {
  pageSize,
  pageNum,
  query,
});

/**
   * 是否启用
   *
   *
   */
const enable = ({ id, state, } = {}) => Fetch.post('bus/busMeetingRoom/updateState', {
  id,
  state,
});
/**
 * 是否接受预定
 *
 */
const reserve = ({ id, reserve, } = {}) => Fetch.post('bus/busMeetingRoom/updateReserve', {
  id,
  reserve,
});

/**
 *   会议室详情数据
 */
const roomData = ({ id, } = {}) => Fetch.post('bus/busMeetingRoom/getById', { id, });

/**
 * 删除时间段规则
 */
const deleteTimeRule = ({ id, } = {}) => Fetch.post('bus/busMeetingRoom/deleteRoomTime', { id, });

/**
 * 删除某个会议室
 */
const deleteMeetingRoom = ({
  id,
} = {}) => Fetch.post('bus/busMeetingRoom/delete', { id, });

/**
 * 获取启用，可预定的会议室数据
 */
const enableOrReserve = ({ pageNum, pageSize, name, } = {}) => Fetch.post('bus/busMeetingRoom/getList', { pageNum, pageSize, name, });
/**
 *  获取会议时间段
 */
const getMeetingTimes = ({ id, time, } = {}) => Fetch.post('bus/busMeetingRoomTime/getByMeetingRoomId', { meetingRoomId: id, time, });

/**
 *  保存会议
 *
 * title 会议主题
 * time 会议日期
 * subject 会议议题
 * type  会议类型
 * meetingRoomId 会议id
 * itemCode  项目id
 * summary 纪要
 * state  状态
 * meetingUsers  会议人员
 * meetingPersons  联系人
 * meetingTime  会议预定时间段
 */
const saveRserveMeeting = ({
  title,
  time,
  subject,
  type,
  meetingRoomId,
  itemCode,
  summary,
  state,
  meetingUsers,
  meetingPersons,
  meetingTime,
} = {}) => Fetch.post('/bus/busMeeting/add', {
  title,
  time,
  subject,
  type,
  meetingRoomId,
  itemCode,
  summary,
  state,
  meetingUsers,
  meetingPersons,
  meetingTime, });

/**
   * 获取所有的预定会议
   */
const allRserveList = ({ time, state, } = {}) => Fetch.post('/bus/busMeeting/list', {
  time, state,
});
/**
 * 获取会议预定列表基础信息
 * 查询今日，明日 可预定会议室数量
 */
const meetingBaseInfo = ({ time, } = {}) => Fetch.post('/bus/busMeeting/getStatistics', { time, });
/**
 * 获取会议详情数据
 */
const getReserve = ({ id, sign, } = {}) => Fetch.post('bus/busMeeting/getById', { id, sign, });
/**
 *  保存会议基础数据
 */
const updatedMeeting = ({
  id,
  title,
  time,
  subject,
  type,
  meetingRoomId,
  itemCode,
  summary,
  state,
  meetingUsers,
  meetingPersons,
  meetingTime,
} = {}) => Fetch.post('bus/busMeeting/update', {
  id,
  title,
  time,
  subject,
  type,
  meetingRoomId,
  itemCode,
  summary,
  state,
  meetingUsers,
  meetingPersons,
  meetingTime,

});

/**
 * 获取我的会议
 * 会议室i
 * 主持人
 * 参会人
 * 审核人
 * 关键字
 * 开始时间
 * 结束时间
 * 类型
 */
const getMyMeetingList = ({
  pageSize,
  pageNum,
  query,
  meetingRoomId,
  hostId,
  attendId,
  auditId,
  keyword,
  startTime,
  endTime,
  type,
} = {}) => Fetch.post('/bus/busMeeting/getMyMeeting', {
  pageSize,
  pageNum,
  query,
  meetingRoomId,
  hostId,
  attendId,
  auditId,
  keyword,
  startTime,
  endTime,
  type, });
/**
 * 获取 会议的流程数据
 */
const getMeetingProcess = ({ id, } = {}) => Fetch.post('bus/meetingProcess/getProcessList', { meetingId: id, });
/**
 *  更新  保存 会议纪要
 */
const saveOrUpdatedSummary = ({ id, summary, meetingUsers, taskId, } = {}) => Fetch.post('bus/busMeeting/saveOrUpdateSummary', { id, summary, meetingUsers, taskId, });
/**
 * 删除 我的会议 某个会议
 */
const deleteMeeting = ({ id, } = {}) => Fetch.post('bus/busMeeting/delete', { id, });
/**
 * 驳回 通过 我的会议 某个会议
 */
const rejectOrPassMeeting = ({ id, operState, remark, } = {}) => Fetch.post('bus/meetingProcess/addProcess', {
  meetingId: id,
  processState: 'audit_meeting',
  operState,
  remark,
});
/**
 * 获取 我的会议 统计
 */
const getMyMeetingCount = () => Fetch.post('bus/busMeeting/getMeetingStatistics', {});
/**
 * 根据项目Code 获取对应的会议
 */
const getItemMeeting = ({ itemCode, pageSize, pageNum, }) => Fetch.post('bus/busMeeting/getItemMeetingList', { itemCode, pageSize, pageNum, });

/**
 *  纪要中添加任务
 */

const addTask = (params) => Fetch.post('/bus/taskInfo/addMeetingTask', params,);

export default {
  getItemMeeting,
  getMyMeetingCount,
  rejectOrPassMeeting,
  deleteMeetingRoom,
  saveOrUpdatedSummary,
  getMeetingProcess,
  getMyMeetingList,
  updatedMeeting,
  saveMeetingRoom,
  getMeetingRoomList,
  deleteMeeting,
  enable,
  reserve,
  roomData,
  deleteTimeRule,
  enableOrReserve,
  getMeetingTimes,
  saveRserveMeeting,
  allRserveList,
  meetingBaseInfo,
  getReserve,
  addTask,
};


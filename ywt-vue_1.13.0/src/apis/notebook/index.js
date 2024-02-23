/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-07 18:32:34
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-15 15:17:33
 * @Description:备忘事项接口
 */
import Fetch from '@/utils/fetch';

// 获取所属项目下拉
const getProjectList = ({
  pageNum,
  pageSize,
  temp = 'quote',
} = {}) => Fetch.post('busItemInfo/getPage', {
  pageNum,
  pageSize,
  temp,
});

/*
 *
 * @param {String} itemCode 项目Id
 */
const workListOfProject = (itemCode) => Fetch.post('/busItemInfo/getWorkHierarchy', {
  itemCode,
});
// 获取所属项目下拉
const getNotesPageList = ({
  name,
  itemCode,
  state,
  showRange,
  sendUser,
  pageNum,
  pageSize,
} = {}) => Fetch.post('/busItemNotes/getPage', {
  name,
  itemCode,
  state,
  showRange,
  sendUser,
  pageNum,
  pageSize,
});
/**
 * 获取事项报告
 */
const itemReport = ({
  startTimeOfDone,
  endTimeOfDone,
  startTimeOfPlan,
  endTimeOfPlan,
  userAll,
  itemCodeAll,
} = {}) => Fetch.post('/busItemNotes/generateReport', {
  startTimeOfDone,
  endTimeOfDone,
  startTimeOfPlan,
  endTimeOfPlan,
  userAll,
  itemCodeAll,
});
// 获取分组数据
const getGroupList = ({
  pageNum = 0,
  pageSize = 9999,
  state = 1,
  deptId = null,
  query = null,
} = {}) => Fetch.post('/busMaintainTeam/getPage', {
  pageNum,
  pageSize,
  state,
  deptId,
  query,
});
const getGenerateReportPopup = ({
  showRange = 0,
} = {}) => Fetch.post('/busItemNotes/generateReportPopup', {
  showRange,
});
// 完成备忘录
const completeNote = ({ id, } = {}) => Fetch.post('/busItemNotes/complete', { id, });

// 撤销完成备忘录
const revokeComplete = ({ id, } = {}) => Fetch.post('/busItemNotes/revokeComplete', { id, });

// 删除备忘录
const deleteNote = ({ id, } = {}) => Fetch.post('/busItemNotes/delete', { id, });

// 新增或编辑备忘录
const saveOrUpdate = ({
  id,
  name,
  endDate,
  endTime,
  itemCode,
  workId,
  importantUrgent,
} = {}) => Fetch.post('/busItemNotes/saveOrUpdate', {
  id,
  name,
  endDate,
  endTime,
  itemCode,
  workId,
  importantUrgent,
});

export default {
  getProjectList,
  getNotesPageList,
  workListOfProject,
  completeNote,
  revokeComplete,
  deleteNote,
  saveOrUpdate,
  itemReport,
  getGroupList,
  getGenerateReportPopup,
};


/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-20 15:57:43
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-10-13 15:07:42
 * @Description:综合-值班管理
 */
import request from '@/utils/request';
import Fetch from '@/utils/fetch';

// 查询某月节假日
export function getMonthHoliday(month) {
  return request({
    url: '/busSchedulHoliday/getMonthHoliday',
    method: 'post',
    data: {
      month,
    },
  });
}
// 设置节假日
export function updateHolidy(holidayTime, holidayType) {
  return request({
    url: 'busSchedulHoliday/changeDay',
    method: 'post',
    data: {
      holidayTime,
      holidayType,
    },
  });
}
// 查询某月排班情况
export function getMonthSchedule(month, userId) {
  return request({
    url: 'busSchedulCore/getMonthInfo',
    method: 'post',
    data: {
      month,
      userId,
    },
  });
}
// 查询排班规则列表
export function getDutyScheduleRuleList() {
  return request({
    url: 'busSchedulRules/getListInfo',
    method: 'post',
    data: {},
  }).then(res => {
    return res.map(item => {
      item.slotTime = JSON.parse(item.slotTime);
      item.hospitalInfo = item.hospitalInfo ? JSON.parse(item.hospitalInfo) : [];
      return item;
    });
  });
}
// 查询排班规则名称列表
export function getDutyScheduleRuleNameList() {
  return request({
    url: 'busSchedulRules/getList',
    method: 'post',
    data: {},
  });
}
// 创建排班规则
export function addDutyScheduleRule({
  dutyType,
  dutyUser,
  days = 1,
  needNum = 1,
  holidayType,
  colorCode = '#fff',
  isContinue = 1,
  sortNum,
  slotTime,
  hospitalInfo,
  dutyExpenses,
}) {
  return request({
    url: 'busSchedulRules/save',
    method: 'post',
    data: {
      dutyType,
      dutyUser,
      days,
      needNum,
      holidayType,
      colorCode,
      isContinue,
      sortNum,
      hospitalInfo: JSON.stringify(hospitalInfo),
      slotTime: JSON.stringify(slotTime),
      dutyExpenses,
    },
  });
}
// 修改排班规则
export function updateDutySchedule({
  id,
  dutyType,
  dutyUser,
  days,
  needNum,
  holidayType,
  colorCode,
  isContinue,
  sortNum,
  slotTime,
  hospitalInfo,
  dutyExpenses,
}) {
  return request({
    url: 'busSchedulRules/update',
    method: 'post',
    data: {
      id,
      dutyType,
      dutyUser,
      days,
      needNum,
      holidayType,
      colorCode,
      isContinue,
      sortNum,
      hospitalInfo: JSON.stringify(hospitalInfo),
      slotTime: JSON.stringify(slotTime),
      dutyExpenses,
    },
  });
}

// 删除排班规则
export function deleteDutyScheduleRule(id) {
  return request({
    url: 'busSchedulRules/delete',
    method: 'post',
    data: {
      id,
    },
  });
}
// 删除排班
export function deleteDutySchedule(id) {
  return request({
    url: 'busSchedulCore/delete',
    method: 'post',
    data: {
      id,
    },
  });
}
// 添加排班
export function addDutySchedule({
  ruleId,
  date,
  schedulUsers,
}) {
  return request({
    url: 'busSchedulCore/save',
    method: 'post',
    data: {
      rules: ruleId,
      dutyTime: date,
      schedulUsers: JSON.stringify(schedulUsers),
    },
  });
}
// 修改排班人员
export function updateDutyScheduleEngineer({
  schedulUsers,
  dutyScheduleId,
}) {
  return request({
    url: 'busSchedulCore/changeUser',
    method: 'post',
    data: {
      schedulUsers: JSON.stringify(schedulUsers),
      id: dutyScheduleId,
    },
  });
}

// 生成排班
export function createDutySchedule({
  startTime,
  endTime,
  rules,
  isCover,
}) {
  return request({
    url: 'busSchedulRules/automaticByRules',
    method: 'post',
    data: {
      startTime,
      endTime,
      rules,
      isCover,
    },
  });
}
// 清空本月排班
export function clearDutyScheduleByMonty({ month, }) {
  return request({
    url: '/busSchedulCore/monthClear',
    method: 'post',
    data: {
      month,
    },
  });
}
const exportExcel = (month) => Fetch.post('/busSchedulCore/exportMonth', {
  month,
});

export default {
  exportExcel,
};
// 获取值班统计动态表头
export function getTableHead() {
  return Fetch.post('/busSchedulCore/dutyStatisticsTableHead',
    {},
  );
}
// 获取值班统计列表数据
export function getDutyStatistics({ beginDate, endDate, name, pageNo, pageSize, }) {
  return request({
    url: '/busSchedulCore/dutyStatistics',
    method: 'post',
    data: {
      beginDate, endDate, name, pageNo, pageSize,
    },
  });
}

import _ from 'lodash';
const _needInfocConfigs = [
  { text: '工单升级', code: 'orderUpgrade', num: '', },
  { text: 'OA系统', code: 'oaSystem', num: '', },
  { text: '新建', code: 'newMake', num: '', },
  { text: '需求', code: 'demand', num: '', },
  { text: '已分配', code: 'assigned', num: '', },
  { text: '待分配', code: 'beAllocated', num: '', },
  { text: '继续调研', code: 'continueInv', num: '', },
  { text: '调研', code: 'investigate', num: '', },
  { text: '已调研', code: 'invOver', num: '', },
  { text: '待调研', code: 'waitInv', num: '', },
  { text: '待评审', code: 'reviewInv', num: '', },
  { text: '未通过', code: 'rejectInv', num: '', },
  { text: '已立项', code: 'stand', num: '', },
  { text: '转工单', code: 'conversion', num: '', },
  { text: '项目实施', code: 'implStart', num: '', }
];
export const pickerOptions = {
  disabledDate: (time) => {
    return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
  },
  // selectableRange: (() => {
  //   const date = new Date();
  //   const hour = date.getHours();
  //   const minute = date.getMinutes();
  //   const second = date.getSeconds();
  //   return [`${hour}:${minute}:${second} - 23:59:59`];
  // })(),
};

export const pickerOptionsEnd = {
  disabledDate: (time) => {
    return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000;
  },
};

const _setUpConfig = [
  { text: '项目立项', code: 'stand', num: '', },
  { text: '方案制定', code: 'program', num: '', },
  { text: '已提交', code: 'submitted', num: '', },
  { text: '待提交', code: 'waitSubmit', num: '', },
  { text: '方案评审', code: 'programReview', num: '', },
  { text: '未通过', code: 'notPass', num: '', },
  { text: '已通过', code: 'pass', num: '', },
  { text: '项目实施', code: 'implStart', num: '', },
  { text: '已完成', code: 'completeAcc', num: '', },

  { text: '未完成', code: 'notAcc', num: '', },
  { text: '未超时', code: 'notAccPunctual', num: '', },
  { text: '已超时', code: 'notAccOverdue', num: '', },
  { text: '未超时', code: 'completeAccPunctual', num: '', },
  { text: '已超时', code: 'completeAccOverdue', num: '', },
  { text: '待确认', code: 'verifyResults', num: '', },
  { text: '通过', code: 'endCompleted', num: '', },
  { text: '不通过', code: 'notCompleted', num: '', }
];

export const needInfocConfigs = _.keyBy(_needInfocConfigs, 'code');
export const setUpConfig = _.keyBy(_setUpConfig, 'code');

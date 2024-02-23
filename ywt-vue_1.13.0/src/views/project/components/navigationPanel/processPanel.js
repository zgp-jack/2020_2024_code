export const processConfig = [
  { text: '工单升级', where: 'demand', code: 'orderUpgrade', num: '', },
  { text: 'OA系统', where: 'demand', code: 'oaSystem', num: '', },
  { text: '新建', where: 'demand', code: 'newMake', num: '', },
  { text: '需求', where: 'demand', code: 'demand', num: '', },
  { text: '已分配', where: 'demand', code: 'assigned', num: '', },
  { text: '待分配', where: 'demand', code: 'beAllocated', num: '', },
  { text: '继续调研', where: 'demand', code: 'continueInv', num: '', },
  { text: '调研', where: 'demand', code: 'investigate', num: '', },
  { text: '初定级', where: 'demand', code: 'waitGrading', num: '', },
  { text: '待调研', where: 'demand', code: 'waitInv', num: '', },

  { text: '需求评估', where: 'demand', code: 'demandAssess', num: '', },
  { text: '技术分析', where: 'demand', code: 'technicalAnalysis', num: '', },
  { text: '需求分析', where: 'demand', code: 'demandAnalysis', num: '', },

  { text: '方案评审', where: 'demand', code: 'reviewInv', num: '', },
  { text: '未通过', where: 'demand', code: 'rejectInv', num: '', },

  { text: '需求立项', where: 'demand', code: 'demandStand', num: '', },

  { text: '转工单', where: 'demand', code: 'conversion', num: '', },

  { text: '任务制定', where: 'stand', code: 'program', num: '', },
  { text: '项目立项', where: 'stand', code: 'stand', num: '', },

  { text: '已制定', where: 'stand', code: 'submitted', num: '', },
  { text: '未制定', where: 'stand', code: 'waitSubmit', num: '', },
  { text: '任务评审', where: 'stand', code: 'programReview', num: '', },
  { text: '未通过', where: 'stand', code: 'notPass', num: '', },
  { text: '已通过', where: ['stand', 'impose'], code: 'pass', num: '', },

  { text: '项目实施', where: 'impose', code: 'implStart', num: '', },
  { text: '已完成', where: 'impose', code: 'completeAcc', num: '', },
  { text: '未完成', where: 'impose', code: 'notAcc', num: '', },
  // { text: '未超时', where:'impose', code: 'notAccPunctual', num: '', },
  // { text: '已超时', where:'impose', code: 'notAccOverdue', num: '', },
  // { text: '未超时', where:'impose', code: 'completeAccPunctual', num: '', },
  // { text: '已超时', where:'impose', code: 'completeAccOverdue', num: '', },
  { text: '确认结果', where: 'impose', code: 'verifyResults', num: '', },
  { text: '通过', where: 'impose', code: 'endCompleted', num: '', },
  { text: '不通过', where: 'impose', code: 'notCompleted', num: '', }

];


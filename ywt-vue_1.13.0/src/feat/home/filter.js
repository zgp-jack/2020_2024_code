/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-06 14:45:38
 * @LastEditors: Q qiaopeng@medicalway.email
 * @LastEditTime: 2022-09-16 18:16:01
 * @Description:工单数据转换
 */
// 工单状态
const orderStateMap = {
  'wait_delivery': { title: '待派单', stateColor: '#E6A23C', },
  'wait_accept': { title: '待接单', stateColor: '#f56c6c', },
  'processing': { title: '处理中', stateColor: '#67c23a', },
  'suspended': { title: '已暂停', stateColor: '#E6A23C', },
  'terminated': { title: '已终止', stateColor: '#F56C6C', },
  'wait_audit': { title: '待审核', stateColor: '#E6A23C', },
  'not_pass_audit': { title: '审核未通过', stateColor: '#F56C6C', },
  'wait_appraisal': { title: '待评价', stateColor: '#426ED7', },
  'ended': { title: '已结束', stateColor: '#334266', },
};
// 任务状态
const taskStateMap = {
  '0': { title: '待提交', stateColor: '#67c23a', },
  '1': { title: '待处理', stateColor: '#67c23a', },
  '2': { title: '待审核', stateColor: '#409eff', },
  '3': { title: '已驳回', stateColor: '#f56c6c', },
  '4': { title: '已暂停', stateColor: '#e6a23c', },
  '5': { title: '已停止', stateColor: '#f56c6c', },
  '6': { title: '已完成', stateColor: '#909399', },
};
// 调研状态
const researchStateMap = {
  'demand_init': { title: '待分配', stateColor: 'blue', },
  'demand_inv': { title: '待调研', stateColor: '#E6A23C', },
  'demand_inv_review': { title: '待评审', stateColor: 'orange', },
  'end_inv_reject': { title: '调研评审不通过', stateColor: 'black', },
  'end_project_order': { title: '转工单', stateColor: 'yellow', },
  'demand_inv_review_next': { title: '继续调研', stateColor: 'purple', },
  'item_establish': { title: '已立项', stateColor: 'red', },
  'item_program_review': { title: '方案评审', stateColor: 'blue', },
  'implement_start': { title: '项目实施', stateColor: 'orange', },
  'item_before_project': { title: '项目结束', stateColor: 'blue', },
  'demand_pause': { title: '暂停', stateColor: 'red', },

};
// 项目状态
const projectStateMap = {
  'implement_start': { title: '', stateColor: 'orange', },
  'implement_over': { title: '', stateColor: 'orange', },
  'confirmResult': { title: '', stateColor: 'orange', },
  'endCompleted': { title: '', stateColor: 'orange', },
  'notCompleted': { title: '', stateColor: 'orange', },
  'item_before_project': { title: '', stateColor: 'blue', },
};
// 卡片首页 - 标题处理
export const faultRemarkFormatter = (faultRemark) => {
  const str = deleteHtmlLabel(faultRemark);
  return addStr(str, '  ', '症状：');
};
// 去除无用的HTML标签和内容
const deleteHtmlLabel = (htmlStr) => {
  if (htmlStr) {
    const REG_STYLE = new RegExp('<style[^>]*?>[\\s\\S]*?<\\/style>', 'g');
    const REG_HTML = new RegExp('<[^>]+>', 'g');
    const resHtmlStr = htmlStr.replace(REG_STYLE, '').replace(REG_HTML, '');
    if (resHtmlStr.indexOf('图片：') === -1) {
      return resHtmlStr.split('图片：')[0] || resHtmlStr;
    } else {
      return resHtmlStr.split('图片：')[0] || resHtmlStr.split('图片：')[2] || resHtmlStr.split('图片：')[1];
    }
  }
  return '';
};
const addStr = (oldStr, addItem, beforeWhich) => {
  // 在指定字符串前面添加指定字符串
  if (oldStr.indexOf(beforeWhich) === -1) {
    return oldStr;
  } else {
    var strArr = oldStr.split('');
    strArr.splice(oldStr.indexOf(beforeWhich), 0, addItem);
    return strArr.join('');
  }
};
// 卡片首页 - 删除秒
export const removeSecondFormatter = (time = [], workKey) => {
  if (time && workKey === 'research' || workKey === 'project') {
    return time.slice(0, time.length - 8);
  }
  if (time && time.length === 19) {
    return time.slice(0, time.length - 3);
  } else {
    return '';
  }
};
// 卡片首页 - 所有类状态
export const workState = (workItem, cardType) => {
  const stateMap = { state: null, levelColor: null, };
  if (cardType === 'order') {
    stateMap.state = orderStateMap[workItem.type] || { title: '未知状态', stateColor: '#7D8DB3', };
    stateMap.levelColor = { 1: '#f56c6c', 2: '#e6a23c', 3: '#2d405e', };
  } else if (cardType === 'task') {
    if (workItem.compRate > 0 && workItem.compRate < 100) {
      stateMap.state = { title: '处理中', stateColor: 'orange', };
      stateMap.levelColor = { 1: '#f56c6c', 2: '#e6a23c', 3: '#2d405e', };
    } else {
      stateMap.state = taskStateMap[workItem.type] || { title: '未知状态', stateColor: '#7D8DB3', };
      stateMap.levelColor = { 1: '#f56c6c', 2: '#e6a23c', 3: '#2d405e', };
    }
  } else if (cardType === 'research') {
    stateMap.state = researchStateMap[workItem.type] || { title: '未知状态', stateColor: '#7D8DB3', };
    stateMap.levelColor = {
      'demand_init': '#F56C6C',
      'demand_inv': '#409EFF',
      'demand_inv_review': '#E6A23C',
      'end_inv_reject': '#C0C4CC',
      'end_project_order': '#2D405E',
      'demand_inv_review_next': '#409EFF',
      'item_establish': '#67C23A',
      'item_program_review': '#E6A23C',
      'implement_start': '#E6A23C',
      'item_before_project': '#2D405E',
    };
  } else if (cardType === 'inspection') {
    stateMap.state = { stateColor: 'red', };
    stateMap.levelColor = {};
  } else {
    console.log(workItem.type, 'hahaha');
    stateMap.state = projectStateMap[workItem.type] || { title: '未知状态', stateColor: '#7D8DB3', };
    stateMap.levelColor = {};
  }
  return stateMap;
};

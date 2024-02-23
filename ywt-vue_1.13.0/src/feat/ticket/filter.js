/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-06 14:45:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-20 17:13:17
 * @Description:工单数据转换
 */
// 工单状态
const TicketStateMap = {
  'wait_delivery': '待派单',
  'wait_accept': '待接单',
  'processing': '处理中',
  'suspended': '已暂停',
  'terminated': '已终止',
  'wait_audit': '待审核',
  'not_pass_audit': '审核未通过',
  'wait_appraisal': '待评价',
  'ended': '已结束',
};
export const ticketState = (state) => {
  return TicketStateMap[state] || '未知状态';
};
// 工单操作
const TicketOperationMap = {
  'start': '电话建单',
  'start_door': '上门报修',
  'start_supp': '补录',
  'start_wechat': '微信建单',
  'start_comp': '电脑建单',
  'start_investigate': '需求转工单',
  'start_ipqc': '巡检转工单',
  'allocate': '派单',
  'end_phone': '电话解决',
  'end_look': '电话找人',
  'receiving': '接单',
  'assist': '协助',
  'making': '处理',
  'complete': '处理完成',
  'back': '返回服务台',
  'end_termination': '终止',
  'suspend': '暂停',
  'open_suspend': '暂停开启',
  'open_termination': '终止重启',
  'forward': '转单',
  'end_examine': '审核通过',
  'no_examine': '审核不通过',
  'close': '关闭',
  'end_invalid': '无效电话',
  'end_upgrade': '工单升级',
};
export const ticketOperation = (operation) => {
  return TicketOperationMap[operation] || '未知操作';
};

// 通话记录处置类型
const CallRecordDealTypeMap = {
  'create_order': '创建工单',
  'end_phone': '电话解决',
  'end_look': '电话找人',
  'end_invalid': '无效电话',
  'linked_hurry': '关联工单:催单',
  'linked_repeat': '关联工单:重报',
  'linked_revoke': '关联工单:撤单',
};
export const callRecordDealType = (dealType) => {
  return CallRecordDealTypeMap[dealType] || '未处理';
};

// 工单信息 - 故障描述
export const faultRemarkFormatter = (faultRemark) => {
  const str = deleteHtmlLabel(faultRemark);
  return addStr(str, '  ', '症状：');
};
// 去除无用的HTML标签和内容
const deleteHtmlLabel = (htmlStr) => {
  if (!htmlStr) {
    return '';
  }
  const REG_STYLE = new RegExp('<style[^>]*?>[\\s\\S]*?<\\/style>', 'g');
  const REG_HTML = new RegExp('<[^>]+>', 'g');
  const resHtmlStr = htmlStr.replace(REG_STYLE, '').replace(REG_HTML, '');
  if (resHtmlStr.indexOf('图片：<img') === -1) {
    return resHtmlStr.split('图片：<img')[0];
  } else {
    return resHtmlStr.split('图片：')[0] || resHtmlStr.split('图片：')[2] || resHtmlStr.split('图片：')[1];
  }
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


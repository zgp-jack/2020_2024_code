/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 19:57:28
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-29 09:59:28
 * @Description:
 */
import store from '@/store';
import _ from 'lodash';
import moment from 'moment';

export function phoneType(val) {
  const typeMap = {
    '0': '已接',
    '2': '未接',
    '1': '拨出',
  };
  return typeMap[val] ? typeMap[val] : console.log('错误参数', val) || '';
}
export function processState(val) {
  const map = store.getters && store.getters.dicList.dic['orderProcess'];
  return _.find(map, { value: val, })?.name;
}
// 故障分类
export function faultType(val) {
  const map = store.state.dictionary.faultTypeList;
  return _.find(map, { id: Number(val), })?.name;
}
// 电话状态
const PHONE_STATE = [
  {
    name: '已回拨',
    value: 3,
  }, {
    name: '未接',
    value: 2,
  }, {
    name: '已接',
    value: 0,
  }, {
    name: '拨出',
    value: 1,
  }
];
export function phoneState(value) {
  return _.find(PHONE_STATE, { value, })?.name || '';
}
// 分钟转天时分
export function minuteToDay(minute) {
  const day = parseInt(minute / 60 / 24);
  const hour = parseInt(minute / 60 % 24);
  const min = parseInt(minute % 60);
  let result = '';
  if (day > 0) {
    result = day + '天';
  }
  if (hour > 0) {
    result += hour + '小时';
  }
  if (min > 0) {
    result += min + '分钟';
  }
  return result === '' ? '1分钟' : result;
}
// 通话时间转换
export function formatSeconds(value) {
  var theTime = parseInt(value);// 需要转换的时间秒
  var theTime1 = 0;// 分
  var theTime2 = 0;// 小时
  var theTime3 = 0;// 天
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
      if (theTime2 > 24) {
        // 大于24小时
        theTime3 = parseInt(theTime2 / 24);
        theTime2 = parseInt(theTime2 % 24);
      }
    }
  }
  var result = '';
  if (theTime > 0) {
    result = '' + parseInt(theTime) + '秒';
  }
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result;
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result;
  }
  if (theTime3 > 0) {
    result = '' + parseInt(theTime3) + '天' + result;
  }
  return result;
}

// 员工转换
export function staffId(id) {
  return store.state.dictionary.engineerList[id] || '';
}

// 部门转换
export function deptId(id) {
  if (!id) {
    return;
  }
  let arr = [];
  arr = findParent(arr, id);
  return arr.join('/');
}

function findParent(arr, id) {
  const data = _.find(store.state.systemDepartment.originList, { id, });
  const pid = data?.parentId;
  const name = data?.deptName;
  if (pid === id) {
    return arr;
  }
  if (pid) {
    arr.unshift(name);
    return findParent(arr, pid);
  } else {
    arr.unshift(name);
    return arr;
  }
}
/**
 * 数据字典值转标签
 * val 值
 * dicName 字典名
 */
export function dicValueToKey(val, dicName) {
  if (!val) {
    return;
  }
  const dicData = store.state.dictionary.dicList[dicName];
  if (!dicData) {
    return console.error(`未找到字典数据-${dicName}`);
  }
  return _.find(dicData, { value: val?.toString(), })?.name;
}

export function getDicValue(val, dicName, char = ',') {
  if (!val) {
    return val;
  }
  const dicData = store.state.dictionary.dicList[dicName];
  if (!dicData) {
    return console.error(`未找到字典数据-${dicName}`);
  }
  const value = val instanceof Array ? val : val.split(char);
  const result = value.map((item) => {
    return _.find(dicData, { value: item?.toString(), })?.name;
  });
  return result;
}

// 紧急程度转换
export function degree(val) {
  return _.find(store.state.dictionary.degreeList, { value: val, })?.name;
}
// 需求紧急程度
export function needLevel(val) {
  return _.find(store.state.dictionary.itemLevel, { value: val.toString(), })?.name;
}

// 需求来源
export function needWhere(val) {
  return _.find(store.state.dictionary.itemType, { value: val.toString(), })?.name;
}
// 需求状态
export function needStatus(val) {
  return _.find(store.state.dictionary.itemProcessShow, { value: val.toString(), })?.name;
}
// 流程状态 时间轴
export function projectProcessState(val, customName) {
  const name = _.find(store.state.dictionary.itemTimeLineStatus, { value: val.toString(), })?.name;
  if (name) {
    return name;
  } else if (customName) {
    return customName;
  }
  return '-';
}
// 项目级别
export function projectLevel(val) {
  if (val) {
    return _.find(store.state.dictionary.itemProjectLevel, { value: val.toString(), })?.name;
  }
  return '';
}
// 来源转换
export function source(val) {
  return _.find(store.state.dictionary.sourceList, { value: val, })?.name;
}
// 影响范围转换
export function range(val) {
  return _.find(store.state.dictionary.rangeList, { value: val, })?.name;
}
// 订单状态转换
export function orderState(val) {
  if (['create', 'forward'].includes(val)) {
    return '待接单';
  } else if (['start', 'back', null].includes(val)) {
    return '待派单';
  } else if (['close'].includes(val)) {
    return '已完成';
  } else if (['suspend'].includes(val)) {
    return '暂停处理';
  } else if (['end_examine'].includes(val)) {
    return '待评价';
  } else if (['complete'].includes(val)) {
    return '待审核';
  } else if (['end_termination'].includes(val)) {
    return '终止';
  } else if (['no_examine'].includes(val)) {
    return '审核未通过';
  } else if (['end_phone'].includes(val)) {
    return '电话已解决';
  } else if (['end_look'].includes(val)) {
    return '电话找人';
  } else {
    return '处理中';
  }
}
// 协作工单状态转换
export function assistOrderState(val) {
  if (['create', 'forward'].includes(val)) {
    return '待接单';
  } else if (['start', 'back', null].includes(val)) {
    return '已退回';
  } else if (['close'].includes(val)) {
    return '已完成';
  } else if (['suspend'].includes(val)) {
    return '暂停处理';
  } else if (['end_examine'].includes(val)) {
    return '待评价';
  } else if (['complete'].includes(val)) {
    return '已完成';
  } else if (['end_termination'].includes(val)) {
    return '终止';
  } else if (['no_examine'].includes(val)) {
    return '审核未通过';
  } else if (['end_phone'].includes(val)) {
    return '电话已解决';
  } else if (['end_look'].includes(val)) {
    return '电话找人';
  } else {
    return '处理中';
  }
}
// 故障分类转换
export function faultTypes(val) {
  if (!val) {
    return '';
  }
  const data = val?.split(',').map((item) => {
    return _.find(store.state.dictionary.faultTypeList, { value: item, })?.name;
  });
  return data.join('/');
}
// 工单操作转换
const processMap = [
  {
    label: '电话已解决',
    value: 'end_phone',
  },
  {
    label: '多人协作',
    value: 'assist',
  },
  {
    label: '创建工单',
    value: 'start',
  },
  {
    label: '派送工单',
    value: 'create',
  }, {
    label: '暂停工单',
    value: 'suspend',
  }, {
    label: '接单',
    value: 'receiving',
  },
  {
    label: '退回工单',
    value: 'back',
  },
  {
    label: '转交',
    value: 'forward',
  },
  {
    label: '处理工单',
    value: 'not_complete',
  }, {
    label: '终止工单',
    value: 'end_termination',
  }, {
    label: '开启工单',
    value: 'open_suspend',
  }, {
    label: '重启工单',
    value: 'open_termination',
  }, {
    label: '完成工单',
    value: 'complete',
  }, {
    label: '未通过审核',
    value: 'no_examine',
  },
  {
    label: '审核通过',
    value: 'end_examine',
  }, {
    label: '电话已解决',
    value: 'end_phone',
  }, {
    label: '电话找人',
    value: 'end_look',
  }, {
    label: '无效电话',
    value: 'end_invalid',
  }
];

// 操作转换
export function processType(value) {
  return _.find(processMap, { value, })?.label;
}
// 工单操作原因转换
export function processReason(type, value) {

}
// 转交记录转换

export function transHistory(val) {
  if (!val) {
    return '';
  } else {
    return val.split(',').map(item => {
      return staffId(Number(item));
    }).join('>');
  }
}

// 过滤出非图片的附件
export function filterAttachment(val, isFile = false, field = 'url') {
  // const reg = /.(jpg|png|jpeg|svg|gif)/g;
  const reg = /\.(png|jpg|gif|jpeg|webp)$/;
  const f = val.filter(e => isFile ? !reg.test(e[field]) : reg.test(e));
  return f;
}
// 将JSON.stringify 格式转为数组
export function stringifyToArr(val) {
  if (!val) {
    return [];
  }
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (error) {
      console.error(error);
      return [];
    }
  } else if (val instanceof Array) {
    return val;
  } else {
    return [];
  }
}
/**
 * 运维小组id 转 运维小组名称
 */
export function teamIdToName(id) {
  const rs = store.state['team/center'].list;
  if (!id) {
    return '无';
  }
  const v = _.find(rs, (o) => {
    return o.id === id;
  });
  return v ? v.name : '无';
}

/**
 *  时间格式化
 */
export function date(val, fmt = 'YYYY-MM-DD hh:mm:ss') {
  return moment(val).format(fmt);
}
/**
 * 时间戳转换
 * @param {*} val
 * @param {*} fmt
 * @returns
 */
export function timestamp(val, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) {
    return val;
  }
  return moment(Number(val)).format(fmt);
}
/**
 *
 * 数字转中文
 */
export function numberToChinese(num) {
  var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
  var chnUnitChar = ['', '十', '百', '千'];
  var unitPos = 0;
  var strIns = ''; var chnStr = '';
  var needZero = false;
  const SectionToChinese = function (section) {
    var ori = section;
    var strIns = '';
    var chnStr = '';
    var unitPos = 0;
    var zero = true;
    while (section > 0) {
      var v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }
    if (ori < 20) {
      chnStr = chnStr.replace('一十', '十');
    }
    return chnStr;
  };

  while (num > 0) {
    var section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }
  return chnStr;
}
/**
 * 裁剪文本
 * @param  {} str 文本
 * @param  {} count 显示长度
 */
export function ellipsis(str, count) {
  let result = str;
  const len = str?.length || 0;
  if (len > count) {
    result = `${str.slice(0, count)}...`;
  }

  return result;
}

/**
 * 将数值四舍五入(保留2位小数)后格式化成金额形式
 *
 * @param money 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
export function formatCash(money) {
  let cents; // 用来拼接小数位
  money = money.toString();
  if (money === null) {
    money = '0';
  }
  if (money.indexOf('.') > 0) { // 处理小数位
    cents = `.${Number(money).toFixed(2).split('.')[1]}`; // 如果有小数位取出小数位 比如23.45 处理之后就是 .45
  } else {
    cents = '.00'; // 没有小数位的直接加上 .00
  }
  money = Math.floor(money); // 取出整数位
  money = ('' + money).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
  return money + cents;
}

export function member(val) {
  let members = '';
  const memberList = store.getters['user/center/uniqUserList'];
  if (!memberList.length) {
    store.dispatch('user/center/DISPATCHT_GET_USER_LIST');
  }
  if ((val instanceof Array && val.length) || (typeof val === 'string' && val.length) || (typeof val === 'number' && val)) {
    const valArray = val.toString().split(',');
    const filterUser = memberList?.filter(e => valArray.includes(e.userId.toString()));
    const value = filterUser.map(e => e.userName).join('、');
    members = value;
  } else {
    members = '-';
  }
  return members;
}

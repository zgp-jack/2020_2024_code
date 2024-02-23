import dayjs from 'dayjs';
import { isObject, } from 'lodash-es';
import { getJSON, } from '@/common/utils/localStorage';

const isLeapYear = require('dayjs/plugin/isLeapYear');
dayjs.extend(isLeapYear);
/**
 * 科室状态
 */
const deptStatus = (value) => {
  const statusMap = {
    0: '正常',
    1: '停用',
  };
  return statusMap[value];
};
/**
 * 时间格式化
 */
const timeFormat = (time, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (time) {
    return dayjs(time).format(fmt);
  }
  return '-';
};

/**
 * 计算设定时间与当前时间的差
 */
const diffTime = (time) => {
  if (time) {
    // const d = dayjs().diff(time, 'days');
    const c = dayjs().startOf('day');
    const e = dayjs(time).endOf('day');
    const r = e.diff(c, 'days');
    return r;
  }
  return '-';
};
/**
 * 获取今年有多少天
 */
// eslint-disable-next-line no-unused-vars
const getYearDays = () => {
  const currentYear = dayjs().year(); // 获取当前年份
  // 检查当前年份是否是闰年
  return dayjs().isLeapYear(currentYear) ? 366 : 365;
};

/**
 *
 * 设置天数显示
 * PS:https://day.js.org/docs/zh-CN/plugin/relative-time
 */
const setDayLabel = (day) => {
  if (day === '-') {
    return '-';
  }
  if (day > getYearDays()) {
    return {
      type: null,
      label: '一年以上',
    };
  } else if (day >= 0 && day <= 5) {
    return {
      type: 'danger',
      label: day + '天',
    };
  } else if (day <= 0) {
    return {
      type: 'danger',
      label: '到期处置',
    };
  } else {
    return {
      type: null,
      label: day + '天',
    };
  }
};

/**
 * 设置保养状态
 */
const setMaintainStatus = (day) => {
  if (day === '-') {
    return '-';
  }
  if (day <= 0) {
    return {
      type: 'danger',
      label: '待保养',
    };
  }
  return {
    type: null,
    label: day + '天',
  };
};

/**
 * 获取对象累某个属性值
 */
const getObjAttr = (obj, field) => {
  if (isObject(obj)) {
    return obj[field];
  }
  return '-';
};

/**
 * 获取科室名称
 */
const getDeptName = (deptId) => {
  const arr = getJSON('SYSTEM_DEPT_CACHED_LIST');
  const result = arr.filter(item => item.deptId === deptId) || [];
  return result[0]?.deptName;
};

const staffId = (reception) => {
  const arr = getJSON('SYSTEM_USER_CACHED_LIST');
  const result = arr.filter(item => item.userId === reception) || [];
  return result[0]?.nickName;
};

export default {
  deptStatus,
  timeFormat,
  diffTime,
  setDayLabel,
  getObjAttr,
  setMaintainStatus,
  getDeptName,
  staffId,
};

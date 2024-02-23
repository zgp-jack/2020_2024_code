/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-23 11:42:01
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-23 13:58:40
 * @Description: 日期工具
 */
// const weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const range = function (n) {
  return Array.apply(null, { length: n, }).map((_, n) => n);
};
// 获取一月中的第一天是星期几
export const getFirstDayOfMonth = function (date) {
  const temp = new Date(date.getTime());
  temp.setDate(1);
  return temp.getDay();
};
// 获取前一月最后几天数据
export const getPrevMonthLastDays = (date, amount) => {
  if (amount <= 0) return [];
  const temp = new Date(date.getTime());
  temp.setDate(0);
  const lastDay = temp.getDate();
  return range(amount).map((_, index) => lastDay - (amount - index - 1));
};

export const getMonthDays = (date) => {
  const temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const days = temp.getDate();
  return range(days).map((_, index) => index + 1);
};

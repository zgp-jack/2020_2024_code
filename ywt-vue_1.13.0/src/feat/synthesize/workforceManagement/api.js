/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-03-15 13:57:54
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-15 13:57:54
 * @Description:
 */
import Fetch from '@/utils/fetch';
const currentDutyWatchman = () => Fetch.post('/v1/get/duty_manager/current_duty_watchman', {});
export default {
  currentDutyWatchman,
};

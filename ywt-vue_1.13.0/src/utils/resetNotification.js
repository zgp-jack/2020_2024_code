/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-27 17:00:51
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-27 17:02:13
 * @Description:
 */
import {
  Notification,
} from 'element-ui';
let notificationInstance = null;
const resetNotification = (options) => {
  if (notificationInstance) {
    notificationInstance.close();
  }
  notificationInstance = Notification(options);
};
['error', 'success', 'info', 'warning'].forEach(type => {
  resetNotification[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetNotification(options);
  };
});
export const notification = resetNotification;

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
['error',
  'success',
  'info',
  'warning',
].forEach(type => {
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

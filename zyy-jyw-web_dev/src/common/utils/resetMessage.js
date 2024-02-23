import {
  Message,
} from 'element-ui';
let messageInstance = null;
import ServerError from './serverError';
import ClientError from './clientError';
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  options.duration = [
    'error',
    'warning',
  ].includes(options.type) ? 3000 : 1000;
  messageInstance = Message(options);
};
// TODO 通过此方式如果传入Error对象会报错
['error',
  'success',
  'info',
  'warning',
].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        duration: type === 'error' ? 3000 : 1000,
      };
    }
    options.type = type;
    // TODO 错误日志全部更新后，应该删除此处逻辑
    const errorTypes = [
      ClientError,
      ServerError,
    ];
    if (errorTypes.includes(options.constructor)) {
      options = {
        message: options.message,
        duration: 3000,
        type: 'error',
      };
    }
    return resetMessage(options);
  };
});
export const message = resetMessage;

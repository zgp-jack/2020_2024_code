import ClientError from './clientError';
import { notification as Notification, } from '../resetNotification';
export const ERROR_TYPE = {
  SERVER_ERROR: {
    ID: 1,
    MESSAGE: '服务端错误',
  },
  CLIENT_ERROR: {
    ID: 2,
    MESSAGE: '客户端错误',
  },
};

export const vueErrorHandler = (err, vm, info) => {
  console.warn('come from vueErrorHandler');
  if (!(err instanceof Error)) {
    return;
  }
  const unifiedError = unifyError(err);
  console.error(unifiedError.name, unifiedError);
  Notification({
    title: unifiedError.name,
    message: unifiedError.message,
    type: 'error',
  });
};
export const unhandledrejection = (event) => {
  console.warn('come from unhandledrejection: ');
  const { reason, } = event;
  console.log(reason);
  event.preventDefault();
  if (!(reason instanceof Error)) {
    reason.includes('url') && console.log('这里有个问题，可能是发生了重复请求，请排查！', reason);
    return;
  }
  const unifiedError = unifyError(reason);
  console.error(unifiedError.name, unifiedError);
  Notification({
    title: unifiedError.name,
    message: unifiedError.message,
    type: 'error',
  });
  console.log('ss');
};
const unifyError = (error) => {
  let unifiedError = error;
  const errorTypes = [
    SyntaxError,
    ReferenceError,
    RangeError,
    TypeError,
  ];
  if (errorTypes.includes(error.constructor)) {
    unifiedError = new ClientError({
      error,
    });
  }
  return unifiedError;
};

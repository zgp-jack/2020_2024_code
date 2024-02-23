/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-25 15:12:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-05-05 16:59:32
 * @Description:错误处理
 * 错误分为客户端错误，服务端错误，http请求错误
 */
import ClientError from './clientError';
import { notification as Notification, } from './resetNotification';
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
};

const unifyError = (error) => {
  let unifiedError = error;
  if ([SyntaxError, ReferenceError, RangeError, TypeError].includes(error.constructor)) {
    unifiedError = new ClientError({
      error,
    });
  }
  return unifiedError;
};

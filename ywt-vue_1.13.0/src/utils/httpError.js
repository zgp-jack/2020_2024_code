/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-25 16:12:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-26 15:51:40
 * @Description:
 */
export default class HttpError extends Error {
  constructor({ code, data, message = '网络错误', error, } = {}) {
    super();
    this.name = 'HTTP请求异常';
    this.message = message;
    this.code = code;
    switch (code) {
      case 1000:
        this.message = '网络超时';
        break;
      case 500:
        this.message = '服务器错误';
        break;
      case 404:
        this.message = '请求资源不存在';
        break;
    }
    this.stack = error?.stack;
  }
}

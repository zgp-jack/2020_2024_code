
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-26 11:02:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-26 16:07:22
 * @Description:服务端错误
 */
export default class ServerError extends Error {
  constructor({ code, data, message = '服务端错误', error, } = {}) {
    super();
    this.name = '服务端错误';
    this.code = code;
    this.message = message;
    this.stack = error?.stack;
    switch (code) {
      case -100:
        this.name = '登录失效';
        this.message = '请重新登录';
        break;
    }
  }
}

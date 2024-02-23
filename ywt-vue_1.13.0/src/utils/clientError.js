/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-26 10:08:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-26 15:38:23
 * @Description:客户端错误
 */

export default class ClientError extends Error {
  constructor({ code, data, message = '客户端错误', error, } = {}) {
    super();
    this.name = '客户端错误';
    if (error instanceof Error) {
      switch (error.constructor) {
        case ReferenceError:
          this.message = error.message;
          break;
        case RangeError:
          this.message = error.message;
          break;
        case SyntaxError:
          this.message = error.message;
          break;
        case TypeError:
          this.message = error.message;
          break;
        default:
          this.message = error.message;
      }
    }
    this.stack = error?.stack;
    this.message = this.message || message;
  }
}

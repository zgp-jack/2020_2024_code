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
      case 401:
        this.name = '未授权';
        this.message = '请登录';
        break;
    }
  }
}

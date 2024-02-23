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

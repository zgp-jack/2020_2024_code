import store from '@/store';
export default class PureWebSocket {
  #alive = false;
  #params = null;
  #reconnectTimer = null;
  #heartTimer = null;
  #messageFunc = null;
  ws = null;
  heartBeat = 10000;
  heartMsg = { code: 15, };
  autoReconnect = true;
  reconnectTime = 5000;
  reconnectTimes = 10;
  constructor(params) {
    this.#params = params;
    this.init();
  }
  init() {
    clearInterval(this.#reconnectTimer);
    clearInterval(this.#heartTimer);
    const params = this.#params;
    const { url, port, } = params;
    const globalParams = [
      'heartBeat',
      'heartMsg',
      'autoReconnect',
      'reconnectTime',
      'reconnectTimes',
    ];
    Object.keys(params).forEach(key => {
      if (globalParams.includes(key)) {
        this[key] = params[key];
      }
    });
    const wsUrl = port ? url + ':' + port : url;
    // delete this.ws;
    this.ws = new WebSocket(wsUrl);
    if (this.#messageFunc) {
      this.onMessage(this.#messageFunc);
    }
    this.ws.onopen = (event) => {
      this.#alive = true;
      store.state['TICKET_SERVICE_DESK'].socketStatus = 1;
      clearInterval(this.#reconnectTimer);
      this.healthCheck();
    };
    this.ws.onclose = (event) => {
      this.#alive = false;
      store.state['TICKET_SERVICE_DESK'].onlineList = 'WebSocket断开链接！';
      store.state['TICKET_SERVICE_DESK'].socketStatus = 2;
      console.log('断开链接', event);
      clearInterval(this.#heartTimer);
      if (this.autoReconnect) {
        this.reconnect();
      }
    };
    this.ws.onerror = (event) => {
      console.log('链接发生错误', event);
      store.state['TICKET_SERVICE_DESK'].socketStatus = 3;
    };
  }
  onMessage(func, all = false) {
    this.ws.onmessage = data => {
      this.#messageFunc = func;
      func(!all ? JSON.parse(data.data) : data);
    };
  }

  reconnect() {
    this.#reconnectTimer = setInterval(() => {
      if (this.reconnectTimes <= 0) {
        clearInterval(this.#reconnectTimer);
        console.log('超过重连次数');
        return;
      } else {
        this.reconnectTimes--;
      }
      this.init();
    }, this.reconnectTime);
  }

  healthCheck() {
    if (this.#alive) {
      this.#heartTimer = setInterval(() => {
        this.send(this.heartMsg);
      }, this.heartBeat);
    }
  }
  close() {
    if (this.#alive === true) {
      this.ws.close();
    }
  }
  send(text) {
    if (this.#alive) {
      text = typeof text === 'string' ? text : JSON.stringify(text);
      this.ws.send(text);
    }
  }
}

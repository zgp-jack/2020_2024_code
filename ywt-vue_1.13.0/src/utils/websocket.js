/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-04 15:11:41
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:57:35
 * @Description: websocket
 */
import store from '@/store';
import {
  Message,
} from 'element-ui';
import {
  bus,
} from '@/utils/bus';
import {
  findIndex,
} from 'lodash';
let canReconnect = true;
let lockReconnect = false;
let websockt = null;
let tt;
// 当前监听号码
let currentPhone = [];
export const initWebSocket = (phone) => {
  currentPhone = phone;
  const wsUri = `${store.state.login.uriConfig.wsUri}?token=${store.state.login.refreshToken}&phone=${phone.join(',')}`;
  websockt = new WebSocket(wsUri);
  websockt.onmessage = onMessage;
  websockt.onopen = onOpen;
  websockt.onerror = onError;
  websockt.onclose = onClose;
  canReconnect = true;
};
export const closeWebsocket = () => {
  if (websockt) {
    websockt.close();
    currentPhone = [];
    canReconnect = false;
  }
};
export const setCanReconnect = (val) => {
  canReconnect = val;
};
const onMessage = (event) => {
  try {
    heartCheck.start();
    const data = JSON.parse(event.data);
    if (data.code === 0) {
      console.log('websocket开始监听', currentPhone);
    } else if (data.code === 12) {
      console.log('你好，有弹屏信息');

      if (store.state.app.openedDrawerOrDialogCount > 0) {
        store.state.app.unrecivedPanelVisible = true;
        store.state.app.unrevivedData.push({ orign: { info: data.body, }, phone: data.body.phone, user: data.body.user, deptId: data.body.deptId, time: data.body.createTime, id: data.body.id, });
      } else {
        bus.$emit('openCreatOrderDrawer', { orign: { info: data.body, }, });
      }
    } else if (data.code === 11) {
      console.log('坐席变更');
      bus.$emit('seatChange');
    } else if (data.code === 14) {
      console.log('电话挂断');
      const index = findIndex(store.state.app.unrevivedData, (item) => item.id === data.body.id);
      if (index >= 0) {
        store.state.app.unrevivedData.splice(index, 1);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const onOpen = (event) => {
  console.log('websocket建立连接');
  heartCheck.start();
};
const onError = (event) => {
  Message({
    type: 'error',
    message: 'websocket连接时发生错误',
  });
  console.log('error', event);
  reconnect();
};
const onClose = (event) => {
  console.log('websoket断开链接');
  if (canReconnect) {
    reconnect();
  }
};
const reconnect = () => {
  if (lockReconnect) {
    return;
  }
  lockReconnect = true;
  tt && clearTimeout(tt);
  tt = setTimeout(() => {
    initWebSocket(currentPhone);
    lockReconnect = false;
  }, 4000);
};
const heartCheck = {
  timeout: 3000,
  timeoutObj: null,
  serverTimeoutObj: null,
  start: function () {
    console.log('start');
    const self = this;
    this.timeoutObj && clearTimeout(this.timeoutObj);
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
    this.timeoutObj = setTimeout(() => {
      websockt.send('123455');
      self.serverTimeoutObj = setTimeout(() => {
        websockt.close();
      }, self.timeout);
    }, self.timeout);
  },
};

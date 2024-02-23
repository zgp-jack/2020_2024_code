import { getJSON, setJSON, } from '@/common/utils/localStorage';
import Store from '@/store';
import {
  transform,
  mapKeys,
  omit,
  keys,
  find,
} from 'lodash';
const NAMESPACE = 'TICKET_SERVICE_DESK';
const state = {
  // 在线坐席人员信息
  onlineList: '暂未设置坐席人员',
  // 当前用户监听的电话列表
  phoneList: [],
  // websocket实例
  ws: null,
  // websocket连接状态 0-连接中 1-连接成功 2-断开连接 3-连接失败
  socketStatus: 0,
  // 坐席类型 人工坐席 ARTIFICIAL_SEAT 呼叫转移-CALL_DIVERT
  seatType: 'ARTIFICIAL_SEAT',
  openedDrawerOrDialogCount: 0,
  unrecivedPanelVisible: true,
  unrevivedData: [],
};
const mutations = {
  UPDATE_ONLINE_INFO: (state, onlineInfo) => {
    const { onlineInfoStr, selfPhone, } = onlineInfo;
    setJSON('mySeatPhone', selfPhone);
    state.onlineList = onlineInfoStr;
    state.phoneList = selfPhone;
  },
  UPDATE_CURRENT_PHONE_LIST: (state, phoneList) => {
    state.phoneList = phoneList;
  },
  OPEN_DIALOG: (state) => {
    state.openedDrawerOrDialogCount++;
  },
  CLOSE_DIALOG: (state) => {
    if (state.openedDrawerOrDialogCount > 0) {
      state.openedDrawerOrDialogCount--;
    } else {
      console.warn('弹窗数量统计有点问题！');
    }
  },
};
const actions = {
  // 当前坐席变更
  UPDATE_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const onlineInfo = convertOnlineInfo(onlineInfoMap, rootState.APP_LOGIN.userInfo.userId);
    commit('UPDATE_ONLINE_INFO', onlineInfo);
  },
  // 初始化当前坐席
  INIT_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const { otherPhone, } = convertOnlineInfo(onlineInfoMap, rootState.APP_LOGIN.userInfo.userId);
    const storePhone = getJSON('mySeatPhone') || [];
    const selfPhone = storePhone.filter(item => !otherPhone.includes(item));
    return new Promise((resolve, reject) => {
      resolve(selfPhone);
    });
  },
  openDialog({ commit, }) {
    commit('OPEN_DIALOG');
  },
  closeDialog({ commit, }) {
    commit('CLOSE_DIALOG');
  },
};
function staffId(id) {
  const nickName = find(Store.state['SYSTEM_USER'].list, { userId: Number(id), })?.nickName;
  return nickName;
}
function convertOnlineInfo(onlineInfoMap, selfId) {
  const mergedSamePhone = transform(onlineInfoMap, (result, value, key) => {
    (result[value] || (result[value] = [])).push(key);
  }, {},);
  // 其它用户上线的坐席
  let otherPhone = [];
  // 自己的坐席
  let selfPhone = [];
  const onlineInfo = mapKeys(omit(mergedSamePhone, [
    '',
  ]), (value, key) => {
    if (Number(key) !== selfId) {
      otherPhone = [...otherPhone, ...value,
      ];
    } else {
      selfPhone = value || [];
    }
    return `${staffId(key)}(${value.join(', ')})`;
  });
  return {
    onlineInfoStr: keys(onlineInfo).join(', ') || '暂无在线坐席',
    otherPhone,
    selfPhone,
  };
}
export default {
  namespaced: true,
  namespace: NAMESPACE,
  state,
  mutations,
  actions,
};

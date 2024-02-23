/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-09 17:39:10
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 13:57:31
 * @Description:呼叫中心
 */
import CallCenterApi from '@/apis/reportFault/callCenter';
import {
  transform,
  mapKeys,
  omit,
  keys,
} from 'lodash';
import {
  staffId,
} from '@/filters';
import * as sessionStorageUtil from '@/utils/sessionStorageUtil';
const state = {
  // 在线坐席人员信息
  onlineList: '获取坐席中...',
  // 当前用户监听的电话列表
  phoneList: [],
  // websocket实例
  ws: null,
};
const mutations = {
  UPDATE_ONLINE_INFO: (state, onlineInfo) => {
    const { onlineInfoStr, selfPhone, } = onlineInfo;
    sessionStorageUtil.setJSON('mySeatPhone', selfPhone);
    state.onlineList = onlineInfoStr;
    state.phoneList = selfPhone;
  },
  UPDATE_CURRENT_PHONE_LIST: (state, phoneList) => {
    state.phoneList = phoneList;
  },
};
const actions = {
  FETCH_ONLINE_INFO: async ({ commit, rootState, }) => {
    const data = await CallCenterApi.onlineInfoList();
    const currentUserId = rootState.login.userInfo.id;
    const onlineInfo = data.filter(item => !item.offlineTime)
      .map(item => {
        return `${staffId(item.user)}(${item.phone})`;
      }).join(', ') || '暂无在线坐席';
    const currentUserOnlinePhone = data.filter(item => !item.offlineTime && Number(item.user) === currentUserId);
    let phoneList = currentUserOnlinePhone[0]?.phone.split(',') || [];
    // 去除重复号码
    const uniqPhoneList = new Set([...phoneList]);
    phoneList = [...uniqPhoneList];
    commit('UPDATE_ONLINE_INFO', onlineInfo);
    commit('UPDATE_CURRENT_PHONE_LIST', phoneList);
    return { onlineInfo, phoneList, };
  },
  // 当前坐席变更
  UPDATE_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const onlineInfo = convertOnlineInfo(onlineInfoMap, rootState.login.userInfo.id);
    commit('UPDATE_ONLINE_INFO', onlineInfo);
  },
  // 初始化当前坐席
  INIT_ONLINE_INFO: async ({ commit, rootState, }, onlineInfoMap) => {
    const { otherPhone, } = convertOnlineInfo(onlineInfoMap, rootState.login.userInfo.id);
    // commit('UPDATE_ONLINE_INFO', onlineInfo);
    const storePhone = sessionStorageUtil.getJSON('mySeatPhone') || [];
    const selfPhone = storePhone.filter(item => !otherPhone.includes(item));
    return new Promise((resolve, reject) => {
      resolve(selfPhone);
    });
  },
};
function convertOnlineInfo(onlineInfoMap, selfId) {
  const mergedSamePhone = transform(onlineInfoMap, (result, value, key) => {
    (result[value] || (result[value] = [])).push(key);
  }, {});
  // 其它用户上线的坐席
  let otherPhone = [];
  // 自己的坐席
  let selfPhone = [];
  const onlineInfo = mapKeys(omit(mergedSamePhone, ['']), (value, key) => {
    if (Number(key) !== selfId) {
      otherPhone = [...otherPhone, ...value];
    } else {
      selfPhone = value || [];
    }
    return `${staffId(key)}(${value.join(', ')})`;
  });
  return { onlineInfoStr: keys(onlineInfo).join(', ') || '暂无在线坐席', otherPhone, selfPhone, };
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

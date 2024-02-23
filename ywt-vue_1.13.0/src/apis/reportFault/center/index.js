/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 19:28:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-06-03 17:17:58
 * @Description:服务台api
 */
import request from '@/utils/request';
import { isString, } from 'lodash';
// 通过号码获取报修人信息
export function getInfoByPhoneNum(phone) {
  return request({
    url: '/sysPhone/getInfoByPhoneNum',
    method: 'post',
    data: { phoneNum: phone, },
  });
}
// 工单数据查询
export function getOrderList(templateType, pageNum = 0, pageSize = 10, likeQuery = {}, search = '') {
  const data = {
    templateType,
    pageNum,
    pageSize,
  };

  const formatingLikeQuery = {};
  for (const key in likeQuery) {
    const value = likeQuery[key];
    let allValue = [];
    value.map(item => {
      if (isString(item)) {
        allValue = [...allValue, ...item.split('/')];
      } else {
        allValue = [...allValue, item];
      }
    });
    formatingLikeQuery[key] = [...new Set(allValue)];
  }
  if (Object.keys(formatingLikeQuery).length) {
    data['likeQuery'] = JSON.stringify(formatingLikeQuery);
  }

  if (search.trim()) {
    data['search'] = search;
  }
  return request({
    url: '/busOrderInfo/getProcessView',
    method: 'post',
    data,

  });
}

// 电话找人
export function findPersonByPhone(data) {
  return request({
    url: '/busOrderFault/createOrder',
    method: 'post',
    data,
  });
}
// 报修人信息查询
export function getPersonInfo(phoneNum) {
  return request({
    url: '/sysPhone/getInfoByPhoneNum',
    method: 'post',
    data: {
      phoneNum,
    },
  });
}
// 获取分机号
export function getLocalPhone() {
  return request({
    url: '/sysPhone/getLocalPhone',
    method: 'post',
    data: {},
  });
}
// 获取当前坐席数据
export function getCurrentAgent() {
  return request({
    url: '/sysSeatHistory/nowInfo',
    method: 'post',
    data: {},
  });
}

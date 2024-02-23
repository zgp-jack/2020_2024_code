/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:23:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-21 10:02:50
 * @Description:
 */
const ACCESSTOKEN = 'ACCESSTOKEN';
const REFRESHTOKEN = 'REFRESHTOKEN';

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESHTOKEN);
}
export function setRefreshToken(token) {
  return sessionStorage.setItem(REFRESHTOKEN, token);
}
export function removeRefreshToken() {
  return sessionStorage.removeItem(REFRESHTOKEN);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESSTOKEN);
}
export function setAccessToken(token) {
  return sessionStorage.setItem(ACCESSTOKEN, token);
}
export function removeAccessToken() {
  return sessionStorage.removeItem(ACCESSTOKEN);
}
export function removeToken() {
  sessionStorage.removeItem(REFRESHTOKEN);
  sessionStorage.removeItem(ACCESSTOKEN);
}

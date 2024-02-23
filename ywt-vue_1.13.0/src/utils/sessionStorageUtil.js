/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-20 18:17:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-07-22 12:28:23
 * @Description:sessionStorage封装
 */

export function setJSON(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}
export function getJSON(key) {
  try {
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}
export function removeJSON(key) {
  sessionStorage.removeItem(key);
}

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-21 21:18:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-21 21:42:54
 * @Description:localStorage封装
 */

export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function getJSON(key) {
  try {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
}


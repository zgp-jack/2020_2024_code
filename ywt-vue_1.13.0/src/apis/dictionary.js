/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 13:34:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-04-16 13:42:01
 * @Description: 字典api
 */
import request from '@/utils/request';

// 获取工程师数据字典
export function getEngineerList() {
  return request({
    url: '/outer/getEditionList',
    method: 'post',
    data: {
      dicList: 'user',
    },
  });
}

// 获取部门数据字典
export function getDepartmentList() {
  return request({
    url: '/outer/getEditionList',
    method: 'post',
    data: {
      dicList: 'unit',
    },
  });
}

// 获取基础数据字典
export function getDiclist() {
  return request({
    url: '/outer/getEditionList',
    method: 'post',
    data: {
      dicList: 'dic',
    },
  });
}

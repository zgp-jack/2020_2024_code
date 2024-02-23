/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-13 17:23:41
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-13 17:30:13
 * @Description:json封装
 */
/**
 *
 * @param  {} jsonString
 * @param  {} errorReturn=[] 解析错误返回的值
 */
const parse = (jsonString, errorReturn = []) => {
  let result = errorReturn;
  try {
    result = JSON.parse(jsonString);
  } catch (error) {
    console.error(error);
  }
  return result;
};

export default {
  parse,
};

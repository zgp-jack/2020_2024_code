/**
 * @file 校验工具
 * @author Pure <305737824@qq.com>
 * @module utils/validator
 */

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
/**
 * 是否为URL地址
 * @param {String} str
 * @returns {Boolean}
 */
export function isUrl(str) {
  return urlRegex.test(str);
}

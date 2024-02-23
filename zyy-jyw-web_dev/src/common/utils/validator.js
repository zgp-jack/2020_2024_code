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

/**
 * 是否为外链
 * @param {String} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 检验数据是否为空
 * @param {any} data
 * @returns {Boolean}
 */
export function isEmpty(data) {
  if (
    data === null ||
    data === '' ||
    data === undefined ||
    data.length === 0 ||
    JSON.stringify(data) === '{}'
  ) {
    return true;
  } else {
    return false;
  }
}

export const limitNumberAfterPoint = (message = '此项不能为空', point = 2) => {
  return (rule, value, callback) => {
    value = value?.toString();
    if (!value) {
      callback();
    } else if (value.indexOf('.') !== -1 && value.split('.').length > 2) {
      callback(new Error('请输入正确格式数字'));
    } else if (value.indexOf('.') !== -1 && value.split('.')[1].length > point) {
      callback(new Error(`小数点后仅支持${point}位`));
    } else {
      callback();
    }
  };
};

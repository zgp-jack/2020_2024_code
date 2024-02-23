/**
 *  判断是否是图片
 * @param {*} filename
 * @returns
 */
export function isImage(filename) {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filename);
}

/**
   * 获取文件后缀
   */
export function getSuffix(fileName) {
  if (fileName) {
    const suffix_reg = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    return fileName.match(suffix_reg)[1];
  }
  return '';
}

/**
 * 获取文件名后缀
 * @param {String} fileName
 * @returns {String}
 */
export function getFileSuffix(fileName) {
  const fileNameStr = fileName.toString();
  const arr = fileNameStr.split('.');
  if (arr.length) {
    return arr.pop().toLowerCase();
  } else {
    return '';
  }
}

/**
 * 判断文件是否符合类型
 * @param {String} accept
 * @param {String} fileName
 */
export function isAcceptFile(accept, fileName) {
  if (accept === '*') {
    return true;
  }
  const acceptArr = accept.toLowerCase().split(',');
  const acceptTypes = acceptArr.map(item => item.slice(1));
  return acceptTypes.includes(getFileSuffix(fileName));
}


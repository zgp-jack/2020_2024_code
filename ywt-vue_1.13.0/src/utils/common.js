import _ from 'lodash';
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 20:19:08
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-31 18:28:29
 * @Description:
 */
export function convertTocascader(list, parent_id = 0) {
  const parentObj = {

  };
  list.forEach(item => {
    parentObj[item.id] = item;
  });
  if (!parent_id) {
    return list.filter(item => !parentObj[item.parent_id])
      .map(item => {
        item.children = convertTocascader(list, item.id);
        item.label = item.name;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  } else {
    return list.filter(item => item.parent_id === parent_id)
      .map(item => {
        item.children = convertTocascader(list, item.id);
        item.label = item.name;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  }
}
export function convertToCascader(list, parent_id = 0, label = 'name') {
  const parentObj = {

  };
  list.forEach(item => {
    parentObj[item.id] = item;
  });
  if (!parent_id) {
    return list.filter(item => !parentObj[item.parent_id])
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  } else {
    return list.filter(item => item.parent_id === parent_id)
      .map(item => {
        item.children = convertToCascader(list, item.id, label);
        item.label = item[label];
        item.value = item.id;
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  }
}
let timer = null;
/**
 * 延迟回调处理方法
 * @param {延迟时间} wait
 * @param {回调方法} func
 */
export function delayCallBack(wait, func) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  timer = setTimeout(() => {
    // console.log(typeof func);
    if (func instanceof Function) {
      func();
    }
  }, wait);
}
/**
 * 将数组转为tree 结构
 * @param {} arr
 * @param {*} config
 * @param {*} pvalue
 */
export function arrayToTree(arr, config = { pfield: 'PID', ufield: 'ID', sub_name: 'Child', remove_null: false, }, pvalue = 0) {
  const rs = {};
  for (let i = 0; i < arr.length; i++) {
    const o = arr[i];
    if (o[config.pfield] === pvalue) {
      if (o[config.pfield] === 0 && o['indexNum']) {
        o['indexNum'] = Number(o['indexNum']);
      }
      const result = arrayToTree(arr, config, o[config.ufield]);
      if (result.length) {
        o[config.sub_name] = result;
      }
      if (config.remove_null && o[config.sub_name].length === 0) {
        delete o[config.sub_name];
      }
      rs[o[config.ufield]] = o;
    }
  }
  // 无限层级怎么算？
  return Object.values(rs);
}

export function dataToTree(data, config = { id: 'deptId', parentId: 'parentId', value: 'value', disabledValue: 'value', }, disabledValues = []) {
  const map = {};
  const arr = JSON.parse(JSON.stringify(data));

  const roots = [];

  // 构建节点映射表
  arr.forEach(item => {
    map[item[config.id]] = item;
    if (disabledValues?.length) {
      if (disabledValues.includes(item[config.disabledValue])) {
        Object.assign(map[item[config.id]], { disabled: true, });
      }
    }
  });
  // 遍历数组构建树
  arr.forEach(item => {
    const node = map[item[config.id]];

    if (!item[config.parentId]) {
      roots.push(node);
    } else {
      const parent = map[item[config.parentId]];
      if (parent?.children instanceof Array) {
        parent.children.push(node);
      } else {
        Object.assign(parent, { children: [], });
        parent.children.push(node);
      }
    }
  });
  return roots;
}

export function deleteEmptyChildrenProperty(arr, childrenLabel = 'children') {
  arr.forEach(item => {
    if (item[childrenLabel] && item[childrenLabel].length > 0) {
      deleteEmptyChildrenProperty(item[childrenLabel], childrenLabel);
    } else {
      delete item[childrenLabel];
    }
  });
  return arr;
}
/**
 *  文字超出 显示省略
 */

export function textOmit(val, len = 10) {
  if (!val) {
    return '';
  }
  if (typeof val !== 'string') {
    console.error(`the ${val} in string `);
  }
  return val.length <= len ? val : val.slice(0, len) + '...';
}

// 获取部门中 父子关系 id
export function subParentId(list, subId) {
  const rs = _.find(list, { id: subId, });
  return rs.dept_no.split(',').map(Number);
}

/**
 * 数组转字符串
 */
export function arrayToString(arr, char = ',') {
  if (arr instanceof Array) {
    arr = arr.join(char);
  }
  return arr;
}

/**
 * 字符串转数组
 */
export function stringToArray(str, char = ',', strToNumber = true) {
  if (str && (typeof str === 'string' || typeof str === 'number')) {
    str = str.toString().split(char).map(strToNumber ? Number : String);
    return str;
  }
  return [];
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

function trimExtraChar(value, char, regExp,) {
  const index = value.indexOf(char);
  let prefix = '';

  if (index === -1) {
    return value;
  }

  if (char === '-' && index !== 0) {
    return value.slice(0, index);
  }

  if (char === '.' && value.match(/^(\.|-\.)/)) {
    prefix = index ? '-0' : '0';
  }

  return (
    prefix + value.slice(0, index + 1) + value.slice(index).replace(regExp, '')
  );
}
/**
 * 格式化数字
 * @param {*} value
 * @param {*} allowDot
 * @param {*} allowMinus
 * @returns
 */
export function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot) {
    value = trimExtraChar(value, '.', /\./g);
  } else {
    value = value.split('.')[0];
  }

  if (allowMinus) {
    value = trimExtraChar(value, '-', /-/g);
  } else {
    value = value.replace(/-/, '');
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;

  return value.replace(regExp, '');
}

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
export function truncateFileName(fileName, maxLength = 20) {
  const extensionIndex = fileName.lastIndexOf('.'); // 获取文件后缀的位置

  if (fileName.length > maxLength && extensionIndex > 0) {
    const extension = fileName.slice(extensionIndex); // 获取文件后缀
    const truncatedName = fileName.slice(-maxLength + extension.length); // 截取最后的长度减去后缀长度的部分
    return truncatedName; // 返回省略号和截取的字符串
  } else {
    return fileName; // 如果不超出长度限制，直接返回原始字符串
  }
}

// import { isEmpty, } from 'lodash-es';

/**
 * 将扁平数据转换成树形数据
 * @param data
 * @param config
 * @returns {unknown[]}
 */
export function convertToTree(data, config = { id: 'deptId', parentId: 'parentId', }) {
  const map = {};
  const arr = JSON.parse(JSON.stringify(data));

  const roots = [];

  // 构建节点映射表
  arr.forEach(item => {
    map[item[config.id]] = item;
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
        if (parent) {
          Object.assign(parent, { children: [], });

          parent.children.push(node);
        } else {
          // 如果未找到parent
          roots.push(node);
        }
      }
    }
  });

  return roots;
}

/**
 * 根据屏幕分辨率转为百分比
 * @param px
 * @returns {string}
 */
export function pxToPercentage(px) {
  const windowWidth = window.screen.width;
  return (px / windowWidth * 100).toFixed(2) + '%';
}

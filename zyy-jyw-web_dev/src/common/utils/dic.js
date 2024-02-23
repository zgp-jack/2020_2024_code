import store from '@/store/index';
import { find, } from 'lodash-es';
import { convertToTree, } from './convert';

/**
 * 获取 字典列表
 * @param {*} key
 * @returns
 */
export const getDicList = (key, toTree = true) => {
  if (!key) {
    console.error('getDicList key  不能为空');
    return;
  }
  const list = store.state.SYSTEM_DIC.list;
  const val = find(list, { type: key, })?.data || [];
  if (toTree) {
    const tree = convertToTree(val, {
      id: 'id',
      parentId: 'parentId',
    });
    console.log(tree, 'tree');

    return tree;
  } else {
    return val;
  }
};

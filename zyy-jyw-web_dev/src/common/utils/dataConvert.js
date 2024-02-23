const toTree = (list, parentId = 0, { idKey = 'id', parentIdKey = 'parent_id', labelKey = 'name', disabledList = [], } = {}) => {
  const parentObj = {};
  list.forEach(item => {
    parentObj[item[idKey]] = item;
  });
  if (!parentId) {
    return list.filter(item => !parentObj[item[parentIdKey]])
      .map(item => {
        item.children = toTree(list, item[idKey], { idKey, parentIdKey, labelKey, disabledList, });
        item.label = item[labelKey];
        item.value = item[idKey];
        if (disabledList.includes(item[idKey])) {
          item.disabled = true;
        }
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  } else {
    return list.filter(item => item[parentIdKey] === parentId)
      .map(item => {
        item.children = toTree(list, item[idKey], { idKey, parentIdKey, labelKey, disabledList, });
        item.label = item[labelKey];
        item.value = item[idKey];
        if (disabledList.includes(item[idKey])) {
          item.disabled = true;
        }
        if (item.children.length === 0) {
          delete item.children;
        }
        return item;
      });
  }
};
export {
  toTree,
};

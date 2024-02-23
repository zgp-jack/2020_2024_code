/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-28 10:37:21
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-28 10:37:21
 * @Description:
 */
const collapseItemProp = {
  name: {
    type: String,
    default: '',
  },
  collapseItemExpand: {
    type: Boolean,
    default: true,
  },
  collapseItemDisabled: Boolean,
  itemCode: {
    type: String,
    default: '',
  },
};
export default collapseItemProp;

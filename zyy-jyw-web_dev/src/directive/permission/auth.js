import store from '@/store';

export default {
  inserted(el, binging, vnode) {
    const { value, } = binging;
    const all_permission = '*:*:*';
    const permissions = store.getters?.userInfo?.permissions;
    if (value) {
      const permissionFlag = value;
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission);
      });
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`请设置操作权限标签值`);
    }
  },
};

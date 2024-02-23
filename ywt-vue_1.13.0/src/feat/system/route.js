/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-21 19:13:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-15 02:10:11
 * @Description: 系统设置模块路由
 */
import Layout from '@/layout';
import MD5 from 'blueimp-md5';
const SystemRouter = {
  path: '/system',
  name: 'Xtsz',
  label: '系统设置',
  component: Layout,
  redirect: '/system/department',
  meta: {
    title: '系统设置',
    icon: 'system',
    add: true,
    order: 13,
  },
  children: [
    {
      path: 'department',
      name: 'XtszKsgl',
      label: '厂家/科室管理',
      component: () => import('./department/index'),
      meta: {
        title: '厂家/科室管理',
      },
    },
    {
      path: 'group',
      name: 'XtszFzgl',
      label: '分组管理',
      component: () => import('./group/index'),
      meta: {
        title: '分组管理',
      },
    },
    {
      path: 'user',
      name: 'XtszYhgl',
      label: '用户管理',
      component: () => import('./user/index'),
      meta: {
        title: '用户管理',
      },
    },
    {
      path: 'roles',
      name: 'XtszJsgl',
      label: '角色管理',
      component: () => import('./role/index'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'setting',
      name: 'XtszQtsz',
      label: '其他设置',
      component: () => import('./otherSetting/index'),
      meta: {
        title: '其他设置',
      },
    },
    {
      path: MD5('/system/dictionary'),
      name: 'XtszZdwh',
      label: '字典维护',
      component: () => import('./dictionaryNew/index'),
      meta: {
        title: '字典维护',
      },
    }
  ],
};
export default SystemRouter;

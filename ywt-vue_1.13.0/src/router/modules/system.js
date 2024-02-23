/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 09:54:13
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-16 14:31:18
 * @Description:系统设置模块路由
 */
import Layout from '@/layout';

const SystemRouter = {
  path: '/system',
  name: 'Xtsz',
  label: '系统设置',
  component: Layout,
  redirect: '/system/department',
  meta: {
    title: '系统设置',
    icon: 'el-icon-s-home',
  },
  children: [
    {
      path: 'department',
      name: 'XtszKsgl',
      label: '科室管理',
      component: () => import('@/views/system/department'),
      meta: {
        title: '科室管理',
      },
    },
    {
      path: 'user',
      name: 'XtszYhgl',
      label: '用户管理',
      component: () => import('@/views/system/user'),

      meta: {
        title: '用户管理',
      },
    },
    {
      path: 'group',
      name: 'XtszFzgl',
      label: '分组管理',
      component: () => import('@/views/system/group'),
      meta: {
        title: '分组管理',
      },
    },
    {
      path: 'roles',
      name: 'XtszJsgl',
      label: '角色管理',
      component: () => import('@/views/system/roles'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'dic',
      name: 'XtszZdwh',
      label: '字典维护',
      component: () => import('@/views/system/dictionary'),
      meta: {
        title: '字典维护',
      },
      redirect: '/system/dic/asset',
      children: [{
        path: 'asset',
        name: 'XtszZdwhZclb',
        label: '资产类别',
        component: () => import('@/views/system/dictionary/children/asset'),
        meta: {
          code: 'asset',
          title: '资产类别',
        },
      },

      {
        path: 'data',
        name: 'XtszZdwhSjzd',
        label: '数据字典',
        component: () => import('@/views/system/dictionary/children/data'),
        meta: {
          code: 'data',
          title: '数据字典',
        },
      },
      {
        path: 'tree',
        name: 'XtszZdwhSxzd',
        label: '树形字典',
        component: () => import('@/views/system/dictionary/tree'),
        meta: {
          title: '树形字典',
        },
      },
      {
        path: 'brand',
        name: 'XtszZdwhCjpp',
        label: '厂家品牌',
        component: () => import('@/views/system/dictionary/children/brand'),
        meta: {
          code: 'brand',
          title: '厂家品牌',
        },
      }],
    }
  ],
};
export default SystemRouter;

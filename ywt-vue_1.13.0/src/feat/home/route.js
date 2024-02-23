/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 20:15:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-01 14:24:25
 * @Description:首页模块路由
 */
import Layout from '@/layout';

const HomeRoute = {
  path: '/home',
  name: 'Home',
  label: '首页',
  disabled: true,
  component: Layout,
  redirect: '/home/dashboard',
  meta: {
    icon: 'home',
    add: false,
    order: 1,
  },
  children: [{
    path: 'dashboard',
    name: 'Sy',
    label: '首页',
    disabled: true,
    component: () => import('./index.vue'),
    meta: { title: '首页',
      icon: 'home',
      affix: true,
    },
  }],
};
export default HomeRoute;

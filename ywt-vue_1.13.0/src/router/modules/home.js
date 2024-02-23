/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:32:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:08:24
 * @Description: 首页模块路由
 */
import Layout from '@/layout';

const HomeRouter = {
  path: '/home',
  name: '首页',
  label: '首页',
  component: Layout,
  redirect: '/home/dashboard',
  children: [{
    path: 'dashboard',
    name: 'Sy',
    label: '首页',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', icon: 'el-icon-s-home', affix: true, },
  }],
};
export default HomeRouter;

/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 09:45:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-07 10:21:29
 * @Description:绩效模块路由
 */
import Layout from '@/layout';
const MeritsRoute = {
  path: '/merits',
  name: 'Jx',
  label: '绩效',
  component: Layout,
  redirect: '/merits/mine',
  meta: {
    title: '绩效',
    icon: 'merits',
    add: true,
    order: 9,
  },
  children: [
    {
      path: 'mine',
      name: 'JxWdjx',
      label: '我的绩效',
      component: () => import('./mine/index'),
      meta: {
        title: '我的绩效',
      },
    },
    {
      path: 'review',
      name: 'JxJxsh',
      label: '绩效审核',
      component: () => import('./review/index'),
      meta: {
        title: '绩效审核',
      },
    },
    {
      path: 'query',
      name: 'JxJxcx',
      label: '绩效查询',
      component: () => import('./query/index'),
      meta: {
        title: '绩效查询',
      },
    },
    {
      path: 'setting',
      name: 'JxJxsz',
      label: '绩效设置',
      component: () => import('./setting/index'),
      meta: {
        title: '绩效设置',
      },
    }
  ],
};
export default MeritsRoute;

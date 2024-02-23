/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 22:12:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:12:50
 * @Description: 报障模块路由
 */
import Layout from '@/layout';

const ReportFaultRouter = {
  path: '/reportFault',
  name: 'Bz',
  label: '报障',
  component: Layout,
  redirect: '/reportFault/center',
  meta: {
    title: '报障',
    icon: 'el-icon-s-home',
  },
  children: [
    {
      path: 'center',
      name: 'BzFwt',
      label: '服务台',
      component: () => import('@/views/reportFault/center'),
      meta: {
        title: '服务台',
      },
    },
    {
      path: 'myorder',
      name: 'BzWdgd',
      label: '我的工单',
      component: () => import('@/views/reportFault/myOrder'),
      meta: {
        title: '我的工单',
      },
    },
    {
      path: 'query',
      name: 'BzGdcx',
      label: '工单查询',
      meta: {
        title: '工单查询',
      },
      component: () => import('@/views/reportFault/query'),
    },
    {
      path: 'examine',
      name: 'BzGdsh',
      label: '工单审核',
      meta: {
        title: '工单审核',
      },
      component: () => import('@/views/reportFault/examine'),
    }, {
      path: 'statistics',
      name: 'BzTjfx',
      label: '统计分析',
      meta: {
        title: '统计分析',
      },
      component: () => import('@/views/reportFault/statistics'),
    }
  ],
};
export default ReportFaultRouter;

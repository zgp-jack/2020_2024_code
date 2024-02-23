/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 20:26:02
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-06-27 15:45:02
 * @Description: 报障(工单)模块路由
 */
import Layout from '@/layout';
import MD5 from 'blueimp-md5';

const TicketRoute = {
  path: '/reportFault',
  name: 'Bz',
  label: '报障',
  component: Layout,
  redirect: '/reportFault/center',
  meta: {
    title: '报障',
    icon: 'ticket',
    add: true,
    order: 3,
  },
  children: [
    {
      path: 'center',
      name: 'BzFwt',
      label: '服务台',
      // component: () => import('@/views/reportFault/center'),
      component: () => import('./serviceDesk/index'),
      meta: {
        title: '服务台',
      },
    },
    {
      path: MD5('/ticket/callRecord'),
      name: 'BzThjl',
      label: '通话记录',
      component: () => import('./callRecord/index'),
      meta: {
        title: '通话记录',
      },
    },
    {
      path: 'myorder',
      name: 'BzWdgd',
      label: '我的工单',
      component: () => import('./mine/index'),
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
      component: () => import('./query/index'),
    },
    {
      path: 'examine',
      name: 'BzGdsh',
      label: '工单审核',
      meta: {
        title: '工单审核',
      },
      component: () => import('./review/index'),
    }, {
      path: 'statistics',
      name: 'BzTjfx',
      label: '统计分析',
      meta: {
        title: '统计分析',
      },
      component: () => import('@/views/reportFault/statistics'),
    },
    {
      path: 'carry-in-service',
      name: 'BzSxgl',
      label: '送修管理',
      meta: {
        title: '送修管理',
      },
      component: () => import('./carryInService/index'),
    },
    {
      path: 'third-part',
      name: 'BzQtdrgd',
      label: '其他导入工单',
      meta: {
        title: '其他导入工单',
      },
      component: () => import('./thirdPart/index'),
    }
  ],
};
export default TicketRoute;

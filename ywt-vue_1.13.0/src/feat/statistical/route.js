/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 17:50:42
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-30 10:00:14
 * @Description: 统计分析模块路由
 */
import Layout from '@/layout';
import MD5 from 'blueimp-md5';
const StatisticalRoute = {
  path: '/statistical',
  name: 'Tjfx',
  label: '统计分析',
  component: Layout,
  redirect: '/statistical/manageBoard',
  meta: {
    title: '统计分析',
    icon: 'statistical',
    add: true,
    order: 11,
  },
  children: [

    {
      path: MD5('/statistical/manageBoard'),
      name: 'TjfxGlkb',
      label: '管理看板',
      component: () => import('./manageBoard/index'),
      meta: {
        title: '管理看板',
      },
    },
    {
      path: MD5('/statistical/ticket'),
      name: 'TjfxGd',
      label: '工单',
      component: () => import('./ticket/index'),
      meta: {
        title: '工单',
      },
    },
    {
      path: MD5('/statistical/project'),
      name: 'TjfxXm',
      label: '项目',
      component: () => import('./project/index'),
      meta: {
        title: '项目',
      },
    },
    {
      path: MD5('/statistical/task'),
      name: 'TjfxRw',
      label: '任务',
      component: () => import('./task/index'),
      meta: {
        title: '任务',
      },
    },
    {
      path: MD5('/statistical/inspection'),
      name: 'TjfxXj',
      label: '巡检',
      component: () => import('./inspection/index'),
      meta: {
        title: '巡检',
      },
    },
    {
      path: 'faultReportWorkloadList',
      name: 'faultReportWorkloadList',
      label: '详情',
      component: () => import('./ticket/faultReportWorkloadList.vue'),
      meta: {
        title: '详情',
      },
      beforeEnter: (to, from, next) => {
        to.meta.title = to.query.title;
        next();
      },
      hidden: true,
    }
  ],
};
export default StatisticalRoute;

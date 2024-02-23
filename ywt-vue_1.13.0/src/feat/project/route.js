/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 20:13:52
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-01 14:28:35
 * @Description: 项目模块路由
 */

import Layout from '@/layout';

const ProjectRoute = {
  path: '/project',
  name: 'Xm',
  label: '项目',
  component: Layout,
  redirect: '/project/needSetting',
  meta: {
    title: '项目',
    icon: 'project',
    add: true,
    order: 4,
  },
  children: [{
    path: 'needSetting',
    name: 'XmXqgl',
    label: '需求管理',
    component: () => import('@/views/project/needSetting/index.vue'),
    meta: {
      title: '需求管理',
    },
  }, {
    path: 'setUp',
    name: 'XmXmlxps',
    label: '项目立项/评审',
    component: () => import('@/views/project/setUp/index.vue'),
    meta: {
      title: '项目立项/评审',
    },
  }, {
    path: 'impose',
    name: 'XmWdxm',
    label: '项目实施',
    component: () => import('@/views/project/impose/index.vue'),
    meta: {
      title: '项目实施',
    },
  },
  {
    path: 'search',
    name: 'XmXmcx',
    label: '联合查询',
    component: () => import('@/views/project/projectSearch/index.vue'),
    meta: {
      title: '联合查询',
    },
  },
  {
    path: 'template',
    name: 'XmMbgl',
    label: '模板管理',
    component: () => import('@/views/project/template/index.vue'),
    meta: {
      title: '模板管理',
    },
  }, {
    path: 'demandKanBan',
    name: 'XmXqkb',
    label: '需求看板',
    component: () => import('@/views/project/board/demand.vue'),
    meta: {
      title: '需求看板',
    },
    hidden: true,
  }, {
    path: 'projectKanBan',
    name: 'XmXmkb',
    label: '项目看板',
    component: () => import('@/views/project/board/project.vue'),
    meta: {
      title: '项目看板',
    },
    hidden: true,

  }, {
    path: 'demandStatics',
    name: 'XmXqtj',
    label: '需求统计分析',
    component: () => import('@/views/project/demandStatistics/index.vue'),
    meta: {
      title: '需求统计分析',
    },
  }, {
    path: 'projectStatics',
    name: 'XmXmtj',
    label: '项目统计分析',
    component: () => import('@/views/project/projectStatistics/index.vue'),
    meta: {
      title: '项目统计分析',
    },
  }],
};
export default ProjectRoute;

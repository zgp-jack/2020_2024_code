/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:37:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-29 15:01:16
 * @Description:项目模块路由
 */
import Layout from '@/layout';

const ProjectRouter = {
  path: '/project',
  name: 'Xm',
  label: '项目',
  component: Layout,
  redirect: '/project/needSetting',
  meta: {
    title: '项目',
    icon: 'el-icon-s-home',
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
  }],
};
export default ProjectRouter;

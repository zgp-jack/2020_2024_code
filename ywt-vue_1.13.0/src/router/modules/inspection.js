/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:38:26
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:08:43
 * @Description:巡检模块路由
 */
import Layout from '@/layout';

const InspectionRouter = {
  path: '/inspection',
  name: 'Xj',
  label: '巡检',
  component: Layout,
  redirect: '/inspection/template',
  meta: {
    title: '巡检',
    icon: 'el-icon-s-home',
  },
  children: [
    {
      path: 'record',
      name: 'XjXjjl',
      label: '巡检记录',
      component: () => import('@/views/inspection/record'),
      meta: {
        title: '巡检记录',
      },
    },
    {
      path: 'task',
      name: 'XjXjrw',
      label: '巡检任务',
      component: () => import('@/views/inspection/task'),
      meta: {
        title: '巡检任务',
      },
    },
    {
      path: 'template',
      name: 'XjXjmbsz',
      label: '巡检模板设置',
      component: () => import('@/views/inspection/template'),
      redirect: '/template/settings',
      meta: {
        title: '巡检模板设置',
      },
      children: [{
        path: 'settings',
        name: 'XjXjmbszMbsz',
        label: '模板设置',
        component: () => import('@/views/inspection/template/settings'),
        meta: {
          title: '模板设置',
        },
      }, {
        path: 'associated',
        name: 'XjXjmbszMbgl',
        label: '模板关联',
        component: () => import('@/views/inspection/template/associated'),
        meta: {
          title: '模板关联',
        },
      }],
    }
  ],
};
export default InspectionRouter;

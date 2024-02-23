/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 20:25:07
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-10-17 14:56:39
 * @Description:综合模块路由
 */
import Layout from '@/layout';
import MD5 from 'blueimp-md5';

const SynthesizeRoute = {
  path: '/synthesize',
  name: 'Zh',
  label: '综合',
  component: Layout,
  redirect: '/synthesize/workforceManagement',
  meta: {
    title: '综合',
    icon: 'synthesize',
    add: true,
    order: 2,
  },
  children: [
    {
      path: MD5('/synthesize/workforceManagement'),
      name: 'ZhZbgl',
      label: '值班管理',
      component: () => import('@/feat/synthesize/workforceManagement'),
      meta: {
        title: '值班管理',
      },
      children: [
        {
          path: MD5('/synthesize/workforceManagement/shiftScheduling'),
          name: 'ZhBcgl',
          label: '班次管理',
          component: () => import('@/feat/synthesize/workforceManagement/shiftScheduling'),
          meta: {
            title: '班次管理',
          },
        },
        {
          path: MD5('/synthesize/workforceManagement/statisticsOnDuty'),
          name: 'ZhZbtj',
          label: '值班统计',
          component: () => import('@/feat/synthesize/workforceManagement/statisticsOnDuty'),
          meta: {
            title: '值班统计',
          },
        }
      ],
    },
    {
      path: 'whereAbouts',
      name: 'ZhRyqx',
      label: '人员去向',
      component: () => import('@/feat/synthesize/whereAbouts'),
      meta: {
        title: '人员去向',
      },
    },
    {
      path: 'notebook',
      name: 'ZhBwsx',
      label: '待办事项',
      component: () => import('@/views/synthesize/notebook'),
      meta: {
        title: '待办事项',
      },
    },
    {
      path: 'taskManagement',
      name: 'ZhRwgl',
      label: '任务管理',
      component: () => import('@/views/synthesize/taskManagement'),
      meta: {
        title: '任务管理',
      },
    },
    {
      path: 'meetingMange',
      name: 'Zhhygl',
      label: '会议管理',
      component: () => import('@/views/synthesize/meetingManage'),
      meta: {
        title: '会议管理',
      },
      redirect: '/synthesize/meetingMange/meetingManagement',
      children: [
        {
          path: 'meetingManagement',
          name: 'ZhHyyd',
          label: '会议预定',
          component: () => import('@/views/synthesize/meetingManage/children/meetingMangement'),
          meta: {
            title: '会议预定',
          },
        },
        {
          path: 'myMeeting',
          name: 'ZhWdhy',
          label: '我的会议',
          component: () => import('@/views/synthesize/meetingManage/children/myMeeting'),
          meta: {
            title: '我的会议',
          },
        },
        {
          path: 'meetingRoomMangement',
          name: 'ZhHygl',
          label: '会议室管理',
          component: () => import('@/views/synthesize/meetingManage/children/meetingRoomMangement'),
          meta: {
            title: '会议室管理',
          },
        }
      ],
    },
    {
      path: 'persona',
      name: 'zhRyhx',
      label: '人员画像',
      component: () => import('./persona/index'),
      meta: {
        title: '人员画像',
      },
    }
  ],
};
export default SynthesizeRoute;

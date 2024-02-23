/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:34:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:13:37
 * @Description:综合模块路由
 */
import Layout from '@/layout';

const SynthesizeRouter = {
  path: '/synthesize',
  name: 'Zh',
  label: '综合',
  component: Layout,
  redirect: '/synthesize/workforceManagement',
  meta: {
    title: '综合',
    icon: 'el-icon-s-home',
  },
  children: [
    {
      path: 'workforceManagement',
      name: 'ZhZbgl',
      label: '值班管理',
      component: () => import('@/views/synthesize/workforceManagement'),
      meta: {
        title: '值班管理',
      },
    }, {
      path: 'taskManagement',
      name: 'ZhRwgl',
      label: '任务管理',
      component: () => import('@/views/synthesize/taskManagement'),
      meta: {
        title: '任务管理',
      },
    }, {
      path: 'meetingManagement',
      name: 'ZhHyyd',
      label: '会议查看/预定',
      component: () => import('@/views/synthesize/meetingMangement'),
      meta: {
        title: '会议查看/预定',
      },
    }, {
      path: 'myMeeting',
      name: 'ZhWdhy',
      label: '我的会议',
      component: () => import('@/views/synthesize/myMeeting'),
      meta: {
        title: '我的会议',
      },
    }, {
      path: 'meetingRoomMangement',
      name: 'ZhHygl',
      label: '会议室管理',
      component: () => import('@/views/synthesize/meetingRoomMangement'),
      meta: {
        title: '会议室管理',
      },
    }
  ],
};
export default SynthesizeRouter;

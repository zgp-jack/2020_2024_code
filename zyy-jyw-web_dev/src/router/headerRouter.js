import Layout from '@/common/layout/index.vue';

// 顶部公用路由
const headerRouter = [{
  path: '/message',
  name: 'Message',
  label: '消息',
  component: Layout,
  redirect: '/message',
  meta: {
    title: '消息',
    icon: 'wrench',
  },
  children: [{
    path: '/message',
    name: 'Message',
    label: '消息',
    component: () => import('@/features/home/message/index.vue'),
    meta: {
      title: '消息',
      icon: 'wrench',
    },
  }, {
    path: '/giveAlarm',
    name: 'GiveAlarm',
    label: '工单告警',
    component: () => import('@/features/home/giveAlarm/index.vue'),
    meta: {
      title: '工单告警',
      icon: 'wrench',
    },
  }, {
    path: '/pending',
    name: 'Pending',
    label: '待办',
    component: () => import('@/features/home/pending/index.vue'),
    meta: {
      title: '待办',
      icon: 'wrench',
    },
  },
  ],
},
];

export default headerRouter;

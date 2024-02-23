import Layout from '@/common/layout';
// import App from '@/App.vue';

const TicketRoute = {
  path: '/ticket',
  name: 'Bz',
  label: '报障',
  component: Layout,
  redirect: './ticket/serviceDesk',
  meta: {
    title: '报障',
    icon: 'wheel',
    order: 8,
  },
  children: [
    {
      path: 'warranty',
      name: 'warranty',
      label: '报修',
      component: () => import('./warranty/index'),
      meta: {
        title: '报修',
      },
    },
    {
      path: 'serviceDesk',
      name: 'sb',
      label: '服务台',
      component: () => import('./serviceDesk/index'),
      meta: {
        title: '服务台',
      },
    }, {
      path: 'callRecord',
      name: 'callRecord',
      label: '通话记录',
      component: () => import('./callRecord/index'),
      meta: {
        title: '通话记录',
      },
    }, {
      path: 'myReviewed',
      name: 'myReviewed',
      label: '由我审核的',
      component: () => import('./myReviewed/index'),
      meta: {
        title: '由我审核的',
      },
    },
    {
      path: 'allWorkOrder',
      name: 'allWorkOrder',
      label: '全部工单',
      component: () => import('./allWorkOrder/index'),
      meta: {
        title: '全部工单',
      },
    },
    {
      path: 'myOrder',
      name: 'myOrder',
      component: () => import('./mine/index'),
      meta: {
        title: '我的工单',
      },
    },
    {
      // 统计分析
      path: 'statisticalAnalysis',
      name: 'statisticalAnalysis',
      component: () => import('./statisticalAnalysis/index'),
      meta: {
        title: '统计分析',
      },
    },
    {
      //   其他工单
      path: 'otherWorkOrder',
      name: 'otherWorkOrder',
      component: () => import('./otherWorkOrder/index'),
      meta: {
        title: '其他工单',
      },
    },
  ],
};
export default TicketRoute;

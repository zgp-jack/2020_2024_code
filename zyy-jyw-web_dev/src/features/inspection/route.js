import Layout from '@/common/layout';

const InspectionRoute = {
  path: '/inspection',
  name: 'inspection',
  label: '巡检',
  component: Layout,
  meta: {
    title: '巡检',
    icon: 'wrench',
    order: 9,
  },
  redirect: '/inspection/history',
  children: [
    {
      path: 'unit',
      name: 'InspectionUnit',
      label: '巡检单元',
      component: () => import('./inspectionUnit/index.vue'),
      meta: {
        title: '巡检单元',
      },
    },
    {
      path: 'plan',
      name: 'InspectionPlan',
      label: '巡检计划',
      component: () => import('./inspectionPlan/index.vue'),
      meta: {
        title: '巡检计划',
      },
    },
    {
      path: 'task',
      name: 'InspectionTask',
      label: '巡检任务',
      component: () => import('./inspectionTask/index.vue'),
      meta: {
        title: '巡检任务',
      },
    },
    {
      path: 'history',
      name: 'InspectionHistory',
      label: '巡检记录',
      component: () => import('./inspectionHistory/index.vue'),
      meta: {
        title: '巡检记录',
      },
    },
    {
      path: 'abnormalRectification',
      name: 'abnormalRectification',
      label: '异常整改',
      component: () => import('./abnormalRectification/index.vue'),
      meta: {
        title: '异常整改',
      },
    },
    {
      path: 'inspectionConfig',
      name: 'inspectionConfig',
      label: '巡检项配置',
      component: () => import('./inspectionConfig/index.vue'),
      meta: {
        title: '巡检项配置',
      },
    },
  ],
};
export default InspectionRoute;

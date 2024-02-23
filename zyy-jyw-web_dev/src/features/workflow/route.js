import Layout from '@/common/layout';

const WorkflowRoute = {
  path: '/workflow',
  name: 'workflow',
  label: '流程管理',
  component: Layout,
  meta: {
    title: '流程管理',
    icon: 'wrench',
    order: 12,
  },
  redirect: '/workflow/category',
  children: [
    {
      path: 'category',
      name: 'WorkflowCategory',
      label: '流程分类',
      component: () => import('./category/index.vue'),
      meta: {
        title: '流程分类',
      },
    },
    {
      path: 'model',
      name: 'WorkflowModel',
      label: '流程模型',
      component: () => import('./model/index.vue'),
      meta: {
        title: '流程模型',
      },
    },
    {
      path: 'deploy',
      name: 'WorkflowDeploy',
      label: '流程部署',
      component: () => import('./deploy/index.vue'),
      meta: {
        title: '流程部署',
      },
    },
  ],
};
export default WorkflowRoute;

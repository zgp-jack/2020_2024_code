import Layout from '@/common/layout/index.vue';

const LibraryManagement = {
  path: '/library',
  name: 'Library',
  label: '知识库',
  component: Layout,
  redirect: '/library/applyManagement',
  meta: {
    title: '知识库', icon: 'wrench', order: 10,
  },
  children: [
    {
      path: 'applyManagement',
      name: 'applyManagement',
      label: '申请知识',
      component: () => import('./applyManagement/index.vue'),
      meta: {
        title: '申请知识',
      },
    },
    {
      path: 'libraryManagement',
      name: 'libraryManagement',
      label: '知识管理',
      component: () => import('./libraryManagement/index.vue'),
      meta: {
        title: '知识管理',
      },
    },
  ],
};
export default LibraryManagement;

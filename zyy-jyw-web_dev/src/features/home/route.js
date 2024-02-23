import Layout from '@/common/layout';

const HomeRoute = {
  path: '/',
  name: 'Home',
  label: '首页',
  disabled: true,
  component: Layout,
  redirect: '/home',
  meta: {
    title: '首页',
    icon: 'wrench',
    add: false,
    order: 1,
  },
  children: [{
    path: '/home',
    name: 'Sy',
    label: '首页',
    disabled: true,
    component: () => import('./index.vue'),
    meta: {
      title: '首页',
      icon: 'wrench',
      affix: true,
    },
  },
  ],
};
export default HomeRoute;

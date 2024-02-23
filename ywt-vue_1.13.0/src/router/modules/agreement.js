/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:39:24
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:07:44
 * @Description:合同模块路由
 */
import Layout from '@/layout';

const AgreementRouter = {
  path: '/agreement',
  name: 'Ht',
  component: Layout,
  redirect: '/agreement/management',
  label: '合同',
  meta: {
    title: '合同',
    icon: 'el-icon-s-home',
  },
  children: [{
    path: 'management',
    name: 'HtHtgl',
    component: () => import('@/views/contract/management/index.vue'),
    label: '合同管理',
    meta: {
      title: '合同管理',
    },
  }, {
    path: 'plan',
    name: 'HtFkjhmb',
    component: () => import('@/views/contract/plan/index.vue'),
    label: '付款计划模板',
    meta: {
      title: '付款计划模板',
    },
  }
  ],
};
export default AgreementRouter;

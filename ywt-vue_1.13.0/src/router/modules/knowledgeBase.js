/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:42:04
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-14 14:05:46
 * @Description:知识库模块路由
 */
import Layout from '@/layout';

const KonwledgeBaseRouter = {
  path: '/knowledgeBase',
  name: 'Zsk',
  label: '知识库',
  component: Layout,
  redirect: '/knowledgeBase/retrieval',
  meta: {
    title: '知识库',
    icon: 'el-icon-s-home',
  },
  children: [
    {
      path: 'retrieval',
      name: 'ZskZskjs',
      label: '知识库检索',
      component: () => import('@/views/knowledgeBase/retrieval'),
      meta: {
        title: '知识库检索',
      },
    }
  ],
};
export default KonwledgeBaseRouter;

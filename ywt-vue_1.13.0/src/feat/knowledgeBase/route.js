/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-31 14:16:56
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-01 16:20:58
 * @Description:知识库模块路由
 */
import Layout from '@/layout';
const KnowledgeBaseRouter = {
  path: '/knowledgeBase',
  name: 'Zsk',
  label: '知识库',
  component: Layout,
  redirect: '/knowledgeBase/retrieval',
  meta: {
    title: '知识库',
    icon: 'knowledgeBase',
    add: true,
    order: 8,
  },
  children: [
    {
      path: 'retrieval',
      name: 'ZskZskjs',
      label: '知识库检索',
      component: () => import('./retrieval'),
      meta: {
        title: '知识库检索',
      },
    }
  ],
};
export default KnowledgeBaseRouter;

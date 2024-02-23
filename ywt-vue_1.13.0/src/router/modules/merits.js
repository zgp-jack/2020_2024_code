/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:43:06
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:09:55
 * @Description:绩效模块路由
 */
import Layout from '@/layout';

const MeritsRouter = {
  path: '/merits',
  name: '绩效',
  label: '绩效',
  component: Layout,
  meta: { title: '绩效',
    icon: 'el-icon-s-home',
  },
};
export default MeritsRouter;

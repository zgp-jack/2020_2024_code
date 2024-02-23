/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:04:09
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-03-17 15:23:47
 * @Description: 路由
 */
import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layout';
import HomeRoute from '@/feat/home/route';
Vue.use(Router);
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '/redirect/:path(.*)',
      component: () => import('@/views/redirect/index'),
    }],
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    component: () => import('@/feat/login'),
  },
  {
    path: '/big-screen',
    component: () => import('@/feat/bigScreen/index'),
    // redirect: '/big-screen/ticket',
    children: [
      {
        path: '/big-screen/ticket',
        name: '工单',
        component: () => import ('@/feat/bigScreen/ticket'),
      },
      {
        path: '/big-screen/project',
        name: '项目',
        component: () => import ('@/feat/bigScreen/project'),
      }
    ],
  }

];

// 通过读取feat目录下的route.js文件，获取所有的路由，meta.add决定是否加入该模块,meta.order决定显示顺序
const genAsyncRoutes = () => {
  const routeFiles = require.context('../feat', true, /route\.js$/);
  const routes = routeFiles.keys().reduce((routes, routePath) => {
    const routeObj = routeFiles(routePath).default;
    if (routeObj.meta.add) {
      routes[routeObj.meta.order] = routeObj;
    }
    return routes;
  }
  , []).filter(item => item);
  return routes;
};
export const asyncRoutes = genAsyncRoutes();
asyncRoutes.unshift(HomeRoute);
const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0, }),
  routes: constantRoutes,
});
const router = createRouter();

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};
export default router;

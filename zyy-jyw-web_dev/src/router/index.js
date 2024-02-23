import Vue from 'vue';
import Router from 'vue-router';
import headerRouter from './headerRouter';

Vue.use(Router);
export const constantRoutes = [
  // {
  //   path: '/',
  //   redirect: '/home',
  // },
  {
    path: '/login',
    component: () => import('@/features/login/login.vue'),
  },
];
const genAsyncRoutes = () => {
  const routeFiles = require.context('../features', true, /route\.js$/);
  const routes = routeFiles.keys().reduce((routes, routePath) => {
    const routeObj = routeFiles(routePath).default;
    routes[routeObj.meta.order] = routeObj;
    return routes;
  }, []).filter(item => item);
  return routes;
};
export const asyncRoutes = genAsyncRoutes();

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0, }),
  routes: [...constantRoutes, ...asyncRoutes, ...headerRouter,
  ],
});
const router = createRouter();
console.log(router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};
export default router;

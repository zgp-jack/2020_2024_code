/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-15 17:19:17
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-07 17:05:35
 * @Description:
 */

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from './router';
import store from './store';
import { getRefreshToken, } from '@/utils/auth';

NProgress.configure({ showSpinner: false, });

const whiteList = ['/login'];
let i = 0;
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const hasRefreshToken = getRefreshToken();
  if (hasRefreshToken) {
    if (to.path === '/login') {
      // next({ path: '/reportFault/center', });
      next({ path: '/', });
      NProgress.done();
    } else {
      if (i === 1) {
        next();
      } else {
        try {
          const accessRoutes = await store.dispatch('permission/GENERATE_ROUTES', 'admin');
          accessRoutes.forEach((route) => {
            router.addRoute(route);
          });
          router.addRoute({
            path: '*',
            redirect: '/home',
          });
          i++;
          next({ ...to, replace: true, });
        } catch (err) {
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});

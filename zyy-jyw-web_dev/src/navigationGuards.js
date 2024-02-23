import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from './router';
import store from './store';
import { getJSON, } from '@/common/utils/localStorage';
import { isEmpty, } from 'lodash-es';

NProgress.configure({ showSpinner: false, });

const whiteList = [
  '/login',
];
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  store.commit('APP_LOGIN/SET_USER_INFO', {
    user: getJSON('USER_INFO') || null,
  });
  const userInfo = store.getters.userInfo;
  console.log('store.getters: ', userInfo);
  if (!isEmpty(userInfo)) {
    if (to.path === '/login') {
      next({ path: '/', });
      NProgress.done();
    } else {
      next();
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

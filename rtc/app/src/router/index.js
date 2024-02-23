import Vue from 'vue';
import Router from 'vue-router';
import Phone from '../views/Phone';
import Device from '../views/Device';
import User from '../views/User';
import Group from '../views/Group';
import Login from '../views/Login'

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'phone',
    component: Phone,
    redirect: '/login',
    children: [
      
      {
        path: '/device',
        name: 'device',
        component: Device,
      },
      {
        path: '/group',
        name: 'group',
        component: Group,
      },
      {
        path: '/user',
        name: 'user',
        component: User,
      },
    ]
  },{
    path: '/login',
    name: 'login',
    component: Login,
  },],
});

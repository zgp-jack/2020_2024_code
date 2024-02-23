import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home'
import Login from '../views/Login';
import Room from '../views/realTime/Room';
import User from '../views/terminal/User';
import Group from '../views/group/Group';
import videoRecord from '../views/realTime/videoRecord'
import videoManager from '../views/record/videoManager'
import Venue from '../views/venue'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            redirect: '/room',
            children: [
                {
                    path: '/room',
                    name: 'room',
                    component: Room,
                },
                {
                    path: '/user',
                    name: 'User',
                    component: User,
                },
                {
                    path: '/group',
                    name: 'Group',
                    component: Group,
                },
                {
                    path: '/videoRecord',
                    name: 'videoRecord',
                    component: videoRecord,
                },
                {
                    path: '/videoManager',
                    name: 'videoManager',
                    component: videoManager,
                },
                {
                    path: '/venue',
                    name: 'venue',
                    component: Venue,
                }
            ]
        }
    ]
});
router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
        next()
    } else {
        // var token = sessionStorage.getItem('token')
        // if (!token) {
        //     next({
        //         path: '/login'
        //     })
        // } else {
        //     next()
        // }
        next();
    }
})
export default router;

export default [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue'),
        redirect: '/index',
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('../views/index')
            },
            {
                path: 'business',
                name: 'business',
                component: () => import('../views/business')
            },
            {
                path: '/room',
                name: 'room',
                component: () => import('../views/3d/Room'),
            },
            {
                path: 'host',
                name: 'host',
                component: () => import('../views/host'),
            },
            {
                path: 'network',
                name: 'network',
                component: () => import('../views/network'),
            },
            {
                path: 'networkTogologView',
                name: 'networkTogologView',
                component: () => import('../views/network/networkTogologView'),
            },
            {
                path: 'networkView',
                name: 'networkView',
                component: () => import('../views/network/networkView'),
            },
            {
                path: 'middleware',
                name: 'middleware',
                component: () => import('../views/middleware'),
            },
            {
                path: 'database',
                name: 'database',
                component: () => import('../views/database'),
            },
            {
                path: 'alarm',
                name: 'alarm',
                component: () => import('../views/alarm'),
            },
            {
                path: 'settingHost',
                name: 'settingHost',
                component: () => import('../views/setting/host'),
            },
            {
                path: 'settingNetwork',
                name: 'settingNetwork',
                component: () => import('../views/setting/network'),
            },
            {
                path: 'settingMiddleware',
                name: 'settingMiddleware',
                component: () => import('../views/setting/middleware'),
            },
            {
                path: 'settingBusiness',
                name: 'settingBusiness',
                component: () => import('../views/setting/business'),
            },
            {
                path: 'settingDatabase',
                name: 'settingDatabase',
                component: () => import('../views/setting/database'),
            },
            {
                path: 'settingRule',
                name: 'settingRule',
                component: () => import('../views/setting/rule'),
            },
            {
                path: 'settingPush',
                name: 'settingPush',
                component: () => import('../views/setting/push'),
            },
            {
                path: 'userManage',
                name: 'userManage',
                component: () => import('../views/system/user'),
            },
            {
                path: 'crewManageNew',
                name: 'crewManageNew',
                component: () => import('../views/system/company'),
            },
            {
                path: 'roleManage',
                name: 'roleManage',
                component: () => import('../views/system/role'),
            },
            {
                path: 'jurisdictionManage',
                name: 'jurisdictionManage',
                component: () => import('../views/system/permissions'),
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue')
    },
    {
        path: '/largeScreen',
        name: 'largeScreen',
        component: () => import('../views/largeScreen'),
    }
]
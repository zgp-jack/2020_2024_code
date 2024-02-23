import Layout from '@/common/layout';

const SystemRoute = {
  path: '/system',
  name: 'System',
  label: '系统设置',
  component: Layout,
  meta: {
    title: '系统设置',
    icon: 'wrench',
    order: 11,
  },
  redirect: '/system/user',
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      label: '用户管理',
      component: () => import('./user/index'),
      meta: {
        title: '用户管理',
      },
    },
    {
      path: 'phone',
      name: 'phoneManagement',
      label: '科室电话簿',
      component: () => import('./phone/index'),
      meta: {
        title: '科室电话簿',
      },
    },
    {
      path: 'menu',
      name: 'MenuManagement',
      label: '菜单管理',
      component: () => import('./menu/index'),
      meta: {
        title: '菜单管理',
      },
    },
    {
      path: 'formConfig',
      name: 'FormConfig',
      label: '表单配置',
      component: () => import('./formConfig/index'),
      meta: {
        title: '表单配置',
      },
    },
    {
      path: 'group',
      name: 'GroupManagement',
      label: '小组管理',
      component: () => import('./group/index'),
      meta: {
        title: '小组管理',
      },
    },
    {
      path: 'otherConfig',
      name: 'OtherConfig',
      label: '其他配置',
      component: () => import('./otherConfig/index'),
      meta: {
        title: '其他配置',
      },
    },
    {
      path: 'departmentManagement',
      name: 'departmentManagement',
      label: '科室管理',
      component: () => import('@/features/system/departmentManagement/index'),
      meta: {
        title: '科室管理',
      },
    },
    {
      path: 'dataDictionaryManagement',
      name: 'dataDictionaryManagement',
      label: '数据字典',
      component: () => import('@/features/system/dataDictionary/index'),
      meta: {
        title: '数据字典',
      },
    },
    {
      path: 'dicData/:dictId',
      name: 'dicData',
      label: '数据字典',
      hidden: true,
      component: () => import('@/features/system/dataDictionary/data.vue'),
      meta: {
        title: '字典数据',
      },
    },
    {
      path: 'roleManagement',
      name: 'roleManagement',
      label: '角色管理',
      component: () => import('@/features/system/roleManagement/index'),
      meta: {
        title: '角色管理',
      },
    },
    {
      path: 'authRole/:roleId',
      name: 'authRole',
      label: '分配用户',
      hidden: true,
      component: () => import('@/features/system/roleManagement/authUser.vue'),
      meta: {
        title: '分配用户',
      },
    },
    {
      path: 'thirdParty',
      name: 'thirdParty',
      label: '第三方管理',
      hidden: false,
      component: () => import('@/features/system/thirdParty/index.vue'),
      meta: {
        title: '第三方管理',
      },
    },
  ],
};
export default SystemRoute;

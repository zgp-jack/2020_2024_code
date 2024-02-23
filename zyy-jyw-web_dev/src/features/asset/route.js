import Layout from '@/common/layout/index.vue';

const AssetManagement = {
  path: '/asset',
  name: 'asset',
  label: '资产',
  component: Layout,
  redirect: '/asset/assetManagement/ledgerManagement',
  meta: {
    title: '资产', icon: 'wrench', order: 7,
  },
  children: [{
    redirect: '/assetManagement/ledgerManagement',
    path: 'assetManagement',
    name: 'assetManagement',
    label: '资产管理',
    component: () => import('./assetManagement/index.vue'),
    meta: {
      title: '资产管理',
    },
    children: [{
      path: 'ledgerManagement',
      name: 'ledgerManagement',
      label: '台账管理',
      component: () => import('./assetManagement/ledgerManagement/index.vue'),
      meta: {
        title: '台账管理',
      },
    }, {
      path: 'assetAllocation',
      name: 'assetAllocation',
      label: '资产调拨',
      component: () => import('./assetManagement/assetAllocation/index.vue'),
      meta: {
        title: '资产调拨',
      },
    },
    {
      path: 'assetTransfer',
      name: 'assetTransfer',
      label: '资产转移',
      component: () => import('./assetManagement/assetTransfer/index.vue'),
      meta: {
        title: '资产转移',
      },
    },

    {
      path: 'assetLending',
      name: 'assetLending',
      label: '资产借用',
      component: () => import('./assetManagement/assetLending/index.vue'),
      meta: {
        title: '资产借用',
      },
    },
    {
      path: 'assetDisposal',
      name: 'assetDisposal',
      label: '资产处置',
      component: () => import('./assetManagement/assetDisposal/index.vue'),
      meta: {
        title: '资产处置',
      },
    },
    ],
  },
  {
    path: 'consumableManagement',
    name: 'consumableManagement',
    label: '耗材管理',
    component: () => import('./consumableManagement/index.vue'),
    meta: {
      title: '耗材管理',
    },
    children: [{
      path: 'management',
      name: 'management',
      label: '耗材管理',
      component: () => import('./consumableManagement/management/index.vue'),
      meta: {
        title: '耗材管理',
      },
    }, {
      path: 'apply',
      name: 'apply',
      label: '耗材申领',
      component: () => import('./consumableManagement/apply/index.vue'),
      meta: {
        title: '耗材申领',
      },
    },
    ],
  },
  {
    path: 'approveManagement',
    name: 'approveManagement',
    label: '审批管理',
    component: () => import('./approveManagement/index.vue'),
    meta: {
      title: '审批管理',
    },
  },
  ],
};
export default AssetManagement;

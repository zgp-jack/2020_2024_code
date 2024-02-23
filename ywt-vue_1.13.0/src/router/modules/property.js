
/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 11:40:28
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:11:58
 * @Description:资产模块路由
 */
import Layout from '@/layout';

const PropertyRouter = {
  path: '/property',
  name: 'Zc',
  label: '资产',
  component: Layout,
  redirect: '/property/propertyManagement',
  meta: {
    title: '资产',
    icon: 'el-icon-s-home',
  },
  children: [{
    path: 'propertyManagement',
    name: 'ZcZcgl',
    label: '资产管理',
    component: () => import('@/views/property/propertyManagement'),
    redirect: '/propertyManagement/stadingBook',
    meta: {
      title: '资产管理',
    },
    children: [{
      path: 'standingBook',
      name: 'ZcZcglTzgl',
      label: '台账管理',
      component: () => import('@/views/property/propertyManagement/standingBook'),
      meta: {
        title: '台账管理',
      },
    }, {
      path: 'propertyTransfer',
      name: 'ZcZcglZczy',
      label: '资产转移',
      component: () => import('@/views/property/propertyManagement/propertyTransfer'),
      meta: {
        title: '资产转移',
      },
    }, {
      path: 'propertyBorrow',
      name: 'ZcZcglZcjy',
      label: '资产借用',
      component: () => import('@/views/property/propertyManagement/propertyBorrow'),
      meta: {
        title: '资产借用',
      },
    }, {
      path: 'propertyDisposals',
      name: 'ZcZcglZccz',
      label: '资产处置',
      component: () => import('@/views/property/propertyManagement/propertyDisposals'),
      meta: {
        title: '资产处置',
      },
    }],
  }, {
    path: 'consumableManagement',
    name: 'ZcHcgl',
    label: '耗材管理',
    component: () => import('@/views/property/consumable'),
    redirect: '/consumableManagement/CM_hcgl',
    meta: {
      title: '耗材管理',
    },
    children: [{
      path: 'CM_hcgl',
      name: 'ZcHcglHcgl',
      label: '耗材管理',
      component: () => import('@/views/property/consumable/management'),
      meta: {
        title: '耗材管理',
      },
    }, {
      path: 'CM_rkgl',
      name: 'ZcHcglRkgl',
      label: '入库管理',
      component: () => import('@/views/property/consumable/deposit'),
      meta: {
        title: '入库管理',
      },
    }, {
      path: 'CM_ckgl',
      name: 'ZcHcglCkgl',
      label: '出库管理',
      component: () => import('@/views/property/consumable/withdraw'),
      meta: {
        title: '出库管理',
      },
    }, {
      path: 'CM_hcsl',
      name: 'ZcHcglHcsl',
      label: '耗材申领',
      component: () => import('@/views/property/consumable/receive'),
      meta: {
        title: '耗材申领',
      },
    }, {
      path: 'CM_kccx',
      name: 'ZcHcglKccx',
      label: '库存查询',
      component: () => import('@/views/property/consumable/query'),
      meta: {
        title: '库存查询',
      },
    }],
  }, {
    path: 'approveManagement',
    name: 'ZcSpgl',
    label: '审批管理',
    component: () => import('@/views/property/approveManagement'),
    meta: {
      title: '审批管理',
    },
  }],
};
export default PropertyRouter;

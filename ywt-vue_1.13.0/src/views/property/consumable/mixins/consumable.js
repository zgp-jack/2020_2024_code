/*
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-09-17 15:30:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-09-17 15:45:31
 * @Description:耗材管理公共部分
 */
import { find, } from 'lodash';
export default {
  data() {
    return {
      // 导航按钮选项
      groupBtnOptions: [{
        count: null,
        name: '耗材登记',
        path: 'CM_hcgl',
      }, {
        count: null,
        name: '入库管理',
        path: 'CM_rkgl',
      }, {
        count: null,
        name: '出库管理',
        path: 'CM_ckgl',
      }, {
        count: null,
        name: '耗材申领',
        path: 'CM_hcsl',
      }, {
        count: null,
        name: '库存查询',
        path: 'CM_kccx',
      }],
      // 当前模块
      currentModule: '',
    };
  },
  methods: {
    handleModuleChange(moduleName) {
      const path = find(this.groupBtnOptions, { name: moduleName, })?.path;
      this.$router.push('/property/consumableManagement/' + path);
    },
  },
};

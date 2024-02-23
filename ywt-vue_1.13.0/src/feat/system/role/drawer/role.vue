<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-27 16:44:30
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-18 10:59:01
 * @Description:角色弹窗
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <span class="title">角色</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">基本信息</div>
        <el-form
          ref="form"
          label-width="120px"
          label-position="right"
          :inline="true"
          size="mini"
          :model="formData"
          :rules="rules"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="formData.roleName" />
          </el-form-item>
          <el-form-item label="所属科室" prop="deptId">
            <department-cascader v-model="formData.deptId" />
          </el-form-item>
          <el-form-item label="显示顺序">
            <el-input-number
              v-model="formData.orderNum"
              controls-position="right"
              :min="1"
              :max="100"
            />
          </el-form-item>
        </el-form>
      </pure-card>
      <empty-row />
      <el-row :gutter="16" class="permission">
        <el-col :span="8">
          <pure-card class="card">
            <div slot="header">菜单权限</div>
            <el-tree
              ref="menuTree"
              :data="menuList"
              show-checkbox
              node-key="path"
              :check-strictly="menuCheckStrictly"
              :default-checked-keys="formData.menus"
              :props="{label:'label'}"
            />
          </pure-card>
        </el-col>
        <el-col :span="8">
          <pure-card class="card">
            <div slot="header">操作权限</div>
            <el-tree
              ref="actionTree"
              :data="actionList"
              show-checkbox
              node-key="value"
              :default-checked-keys="formData.actions"
              :props="{label: 'description'}"
            />
          </pure-card>
        </el-col>
        <el-col :span="8">
          <pure-card class="card">
            <div slot="header">订阅权限</div>
          </pure-card>
        </el-col>
      </el-row>
    </div>
    <div class="footer">
      <el-button
        type="primary"
        size="mini"
        @click="onSubmit"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import RoleApi from '../api';

import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import emptyRow from '@/components/emptyRow.vue';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import {
  asyncRoutes,
} from '@/router';

import {
  cloneDeep,
} from 'lodash';
export default {
  name: 'RoleInfoDrawer',
  components: {
    emptyRow,
    DepartmentCascader,
  },
  mixins: [FormDialog],
  data() {
    return {
      name: '角色',
      formData: {
        id: null,
        roleName: null,
        deptId: null,
        orderNum: null,
      },
      detailApi: RoleApi.detail,
      checkedMenus: [],
      checkedActions: [],
      rules: {
        roleName: [{
          required: true, message: '请输入角色名', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',
        }],
      },
      menuList: [
      ],
      menuCheckStrictly: true,
      actionList: [],
    };
  },
  methods: {
    async beforeFetchDetail() {
      this.menuCheckStrictly = true;
      this.menuList = asyncRoutes;
      const permission = await RoleApi.permissionList();
      this.actionList = permission;
    },
    async afterFetchDetail() {
      // 将首页设置为固定项
      if (!this.formData.menus.includes('/home')) {
        this.formData.menus.unshift('/home');
      }
      if (!this.formData.menus.includes('dashboard')) {
        this.formData.menus.unshift('dashboard');
      }

      this.menuCheckStrictly = false;
    },
    async onSubmit() {
      try {
        const checkedMenus = this.$refs.menuTree.getCheckedKeys();
        const halfCheckedMenus = this.$refs.menuTree.getHalfCheckedKeys();
        const menus = [...checkedMenus, ...halfCheckedMenus];
        const formData = cloneDeep(this.formData);

        formData.menus = menus.join(',');
        formData.actions = this.$refs.actionTree.getCheckedKeys().join(',');
        if (this.operatorType === OPERATOR_TYPES.UPDATE) {
          await RoleApi.update(formData);
          this.$message({
            type: 'success',
            message: '更新角色成功',
          });
        } else {
          await RoleApi.create(formData);
          this.$message({
            type: 'success',
            message: '创建角色成功',
          });
        }
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
    height: 100%;
    display: flex;
    flex-direction: column;
    .permission {
        height: 100%;
        flex: 1;
        overflow: hidden;
        .el-col {
            height: 100%;
        }
        .card {
            height: 100%;
        }
        ::v-deep .pure-card__body {
            height: calc(100% - 50px);
            // height: 100%;
        }
    }
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
</style>

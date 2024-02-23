<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-09 16:03:03
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-10-21 16:07:21
 * @Description: 新增编辑角色
-->
<template>
  <div class="drawer">
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
              :default-checked-keys="checkedMenus"
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
              :default-checked-keys="checkedActions"
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
        @click="handleSave"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import emptyRow from '@/components/emptyRow.vue';
import {
  createRole,
  updateRole,
} from '@/apis/system/role';
import {
  asyncRoutes,
} from '@/router';
import RoleApi from '@/apis/system/role';
export default {
  components: { emptyRow,
    DepartmentCascader: () => import('@/feat/system/department/component/departmentCascader.vue'),
  },
  props: {
    roleId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        id: null,
        roleName: null,
        deptId: null,
        orderNum: null,
      },
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
  async created() {
    this.menuCheckStrictly = true;
    this.menuList = asyncRoutes;
    const permission = await RoleApi.permissionList();
    this.actionList = permission;
    if (this.roleId) {
      const result = await RoleApi.role(this.roleId);
      this.formData = Object.assign({}, result);
      this.checkedMenus = this.formData.menus;
      this.checkedActions = this.formData.actions;
    }
    this.menuCheckStrictly = false;
  },
  methods: {
    async genMenuList(routes) {
    },
    async handleSave() {
      try {
        const checkedMenus = this.$refs.menuTree.getCheckedKeys();
        const halfCheckedMenus = this.$refs.menuTree.getHalfCheckedKeys();
        const menus = [...checkedMenus, ...halfCheckedMenus];
        this.formData.menus = menus.join(',');
        this.formData.actions = this.$refs.actionTree.getCheckedKeys().join(',');
        if (this.formData.id) {
          await updateRole(this.formData);
          this.$message({
            type: 'success',
            message: '更新角色成功',
          });
        } else {
          await createRole(this.formData);
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

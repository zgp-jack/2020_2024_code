<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-15 17:43:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-05-05 17:14:06
 * @Description:科室角色选择弹窗
-->
<template>
  <div>
    <el-form
      ref="form"
      size="mini"
      label-width="108px"
      label-position="right"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="科室" prop="deptId">
              <department-cascader v-model="formData.deptId" @change="onDeptChanged" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select
                v-model="formData.roleId"
                clearable
                :filterable="true"
                :disabled="!roleList.length"
              >
                <el-option
                  v-for="(item ,index) in roleList"
                  :key="index"
                  :value="item.id"
                  :label="item.roleName"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col style="text-align:right">
        <pure-button
          label="保存"
          @click="onSubmit"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import RoleApi from '@/feat/system/role/api';

export default {
  name: 'UserPermissionDialog',
  components: {
    DepartmentCascader,
  },
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
    engineerId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        roleId: null,
        deptId: null,
        roleIdToName: null,
        deptIdToName: null,
      },
      roleList: [],
      rules: {
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',
        }],
        roleId: [{
          required: true, message: '请选择角色', trigger: 'change',
        }],
      },
    };
  },

  async created() {
    this.formData = Object.assign({}, this.formData, this.data);
    if (this.formData.deptId) {
      await this.onDeptChanged({ id: this.formData.deptId, isInit: true, deptName: this.formData.deptIdToName, });
    }
  },

  methods: {
    async onDeptChanged(val) {
      if (!val) {
        this.roleList = [];
        this.formData.roleId = null;
        return;
      }
      if (!val.isInit) {
        this.formData.roleId = null;
      }
      const { list, } = await RoleApi.list({ deptNo: val.id, });
      this.formData.deptIdToName = val.deptName;
      this.roleList = list;
      if (this.roleList.length > 0) {
        const roleId = this.formData.roleId;
        this.formData.roleId = roleId || this.roleList[0].id;
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        const role = this.roleList.find(item => item.id === this.formData.roleId);
        this.formData.roleIdToName = role.roleName;
        this.$emit('done', this.formData);
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
.form-item-wrapper {
     padding: 0;
    margin-bottom: 0;
}
.w-100 {
  width: 100%;
}
</style>

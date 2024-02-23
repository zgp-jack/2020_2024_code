<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-06-09 15:16:22
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-17 10:45:35
 * @Description: 添加权限
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
          <el-col :span="10">
            <el-form-item label="排序">
              <el-input-number v-model="formData.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:center">
            <el-form-item label-width="0px">
              <el-checkbox
                v-model="formData.primary"
                :true-label="1"
                :false-label="0"
              >设为默认</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用">
              <el-switch
                v-model="formData.state"
                :active-value="1"
                :inactive-value="0"
                inactive-text="否"
                active-text="是"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
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
      <el-form-item label-width="0px" class="form-item-wrapper">
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="formData.startDate"
                class="w-100"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择开始时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="formData.endDate"
                class="w-100"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择结束时间"
              />
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

import EngineerApi from '../api';

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
        primary: 0,
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
      await this.onDeptChanged(this.formData);
    }
  },

  methods: {
    async onDeptChanged(val) {
      try {
        const { list, } = await RoleApi.list({ deptNo: val.deptNo, });
        this.roleList = list;
        if (this.formData.roleId) {
          return;
        }
        this.formData.roleId = null;
        if (this.roleList.length > 0) {
          this.formData.roleId = this.roleList[0].id;
        }
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        const { roleId,
          deptId,
          startDate,
          endDate,
          primary,
          state,
          orderNum,
          id,
        } = this.formData;
        if (this.formData.id) {
          await EngineerApi.updateRole({
            deptId,
            roleId,
            startDate,
            endDate,
            primary,
            state,
            orderNum,
            id,
            userId: this.engineerId,
          });
          this.$message({
            type: 'success',
            message: '更新权限成功',
          });
        } else {
          const result = await EngineerApi.addRole({
            roleId,
            deptId,
            startDate,
            endDate,
            primary,
            state,
            orderNum,
            userId: this.engineerId,

          });
          this.formData.id = result;
          this.$message({
            type: 'success',
            message: '添加权限成功',
          });
        }
        const data = {
          id: this.formData.id,
          userState: state,
          primary,
          deptId,
          startDate,
          endDate,
        };
        this.$emit('done', data);
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

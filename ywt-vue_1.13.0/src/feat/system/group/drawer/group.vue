<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-12-21 19:24:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-04-17 17:19:59
 * @Description:分组弹窗
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <span class="title">{{ title }}</span>
    </div>
    <div class="body">
      <pure-card class="card">
        <div slot="header">分组信息</div>
        <el-form
          ref="form"
          label-width="100px"
          label-position="right"
          :model="formData"
          :rules="rules"
          size="mini"
        >
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="小组名" prop="name">
                <el-input v-model="formData.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管理科室" prop="deptId">
                <department-cascader v-model="formData.deptId" />
              </el-form-item>

            </el-col>
          </el-form-item>
          <el-form-item label="小组成员" prop="users">
            <engineer-multi-select v-model="formData.users" style="width:100%" multiple draggable />
          </el-form-item>
          <el-form-item label-width="0px" class="form-item-wrapper">
            <el-col :span="12">
              <el-form-item label="组长" prop="leader">
                <engineer-multi-select v-model="formData.leader" />
              </el-form-item>
            </el-col>

          </el-form-item>

          <el-form-item label="工作内容">
            <el-input v-model="formData.content" type="textarea" :rows="4" />
          </el-form-item>
        </el-form>
      </pure-card>
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
import GroupApi from '../api';

import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import EngineerMultiSelect from '@/feat/system/user/component/v2/engineerDraggableSelect';

import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';

import {
  bus,
} from '@/utils/bus';
export default {
  name: 'GroupInfoDrawer',
  components: {
    DepartmentCascader,
    EngineerMultiSelect,
  },
  mixins: [FormDialog],
  data() {
    return {
      name: '分组',
      formData: {},
      detailApi: GroupApi.detail,
      rules: {
        name: [{
          required: true, message: '请输入小组名', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择科室', trigger: 'change',
        }],
      },
    };
  },
  methods: {
    async handleSave() {
      try {
        await this.$refs.form.validate();
        if (this.operatorType === OPERATOR_TYPES.CREATE) {
          await GroupApi.create(this.formData);
        } else if (this.operatorType === OPERATOR_TYPES.UPDATE) {
          await GroupApi.update(this.formData);
        }
        bus.$emit('updateGroupTree');
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
    .card {
        height: 100%;
    }
     &::v-deep .pure-card__body {
      max-height:calc(100% - 34px);
      height: calc(100% - 34px);
  }
}
 .footer {
    height: 56px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .form-item-wrapper {
    padding: 0;
    margin-bottom: 0;
}
</style>

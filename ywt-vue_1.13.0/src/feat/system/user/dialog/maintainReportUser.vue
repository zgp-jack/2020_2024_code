<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-27 10:08:33
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2021-12-28 15:27:39
 * @Description:报修人维护
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="122px"
    size="mini"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="报修人姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在科室" prop="deptId">
          <department-cascader v-model="formData.deptId" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="报修人电话" prop="phone">
          <el-input v-model="formData.phone" disabled />
        </el-form-item>
      </el-col>

    </el-row>
    <el-form-item label-width="0px" class="form-item-wrapper" style="text-align: right">
      <pure-button type="default" label="确定" @click="submit" />
    </el-form-item>
  </el-form>
</template>

<script>
import EngineerApi from '../api';

import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';

import * as Regex from '@/utils/regex';

export default {
  name: 'MiantainReportUserDialog',
  components: {
    DepartmentCascader,
  },
  mixins: [FormDialog],
  props: {
    engineerId: {
      type: String,
      default: null,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        name: null,
        deptId: null,
        phone: null,
      },
      rules: {
        name: [{
          required: true, message: '请输入报修人姓名', trigger: 'blur',
        }],
        phone: [{
          required: true, message: '请输入报修人电话', trigger: 'blur',
        }, {
          pattern: Regex.phone, message: '请输入有效手机号码', trigger: 'blur',
        }],
        deptId: [{
          required: true, message: '请选择所在科室', trigger: 'change',
        }],
      },
    };
  },
  async created() {
    this.formData = Object.assign({}, this.formDta, this.data);
  },
  methods: {
    async submit() {
      try {
        await this.$refs.form.validate();
        const { name, } = this.formData;
        await EngineerApi.maintainPhone(this.formData);
        this.$message({
          type: 'success',
          message: this.operatorType !== OPERATOR_TYPES.CREATE ? '更新报修人信息成功' : '新增报修人信息成功',
        });
        this.$emit('done', { user: name, });
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
  .el-col-12 {
    padding:0;
  }
}
</style>

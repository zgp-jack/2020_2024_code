<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 15:37:08
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-11 17:38:59
 * @Description:确认送回科室面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      送回信息
    </template>
    <template #labelText>
      操作人：
    </template>
    <template #labelValue>
      {{ currentUser }}
    </template>
    <template #labelTime>
      创建时间：
    </template>
    <template #labelTimeValue>
      {{ currentTime }}
    </template>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="厂家送回至" prop="sendDeptId">
        <department-cascader v-model="formData.sendDeptId" class="w-100" @change="onDepartmentChange" />
      </el-form-item>
      <el-form-item label="科室地址" prop="sendDeptPlace">
        <el-input v-model="formData.sendDeptPlace" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="接收人">
            <el-input v-model="formData.receiveUser" :disabled="!formData.sendDeptId" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接收人电话">
            <el-input v-model="formData.receivePhone" :disabled="!formData.sendDeptId" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';

export default {
  name: 'ConfirmSendBackToDepartmentPanel',
  components: {
    DepartmentCascader,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: 'ConfirmSendBackToDepartmentPanel',
      formData: {
        sendDeptId: null,
        sendDeptPlace: null,
        receiveUser: null,
        receivePhone: null,
      },
      rules: {
        sendDeptId: [
          { required: true, message: '请选择科室', trigger: 'change', }
        ],
        sendDeptPlace: [
          { required: true, message: '请输入科室地址', trigger: 'blur', }
        ],
      },
      // 科室联系人
      deptContacts: [],
    };
  },
  created() {
  },
  methods: {
    async check(repairId) {
      await this.$refs.form.validate();
      await CarryInServiceApi.confirmSendBackToDepartment({ repairId, ...this.formData, });
    },
    async onDepartmentChange(data) {
      this.formData.sendDeptPlace = data?.deptPlace;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

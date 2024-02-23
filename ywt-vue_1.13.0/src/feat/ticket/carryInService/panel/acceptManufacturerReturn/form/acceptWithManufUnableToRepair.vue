<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-17 10:20:27
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-17 10:21:28
 * @Description:厂家无法维修
-->

<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="123px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="实际接收人">
          <el-input v-model="formData.receiveUser" placeholder="" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="接收人电话">
          <el-input v-model="formData.receivePhone" placeholder="" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="设备状态外观">
          <dic-select v-model="formData.deviceState" dic-key="repair_equipment_status" type="string" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="设备数据状态">
          <dic-select v-model="formData.deviceData" dic-key="repair_equipment_data" type="string" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="base-margin-top base-margin-bottom">
      <el-col :span="12">签名</el-col>
    </el-row>
    <el-form-item label="签名">
      <div v-if="formData.sign">
        <img class="autograph" :src="$store.state['login'].uriConfig.fileBaseUri+formData.sign">
      </div>
    </el-form-item>
    <el-form-item label="附件">
      <upload v-model="formData.enclosure" />
    </el-form-item>
  </el-form>
</template>

<script>
import CarryInServiceMixin from '../../../mixin';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import {
  cloneDeep,
} from 'lodash';
export default {
  components: {
    DicSelect,
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
      formData: {
        deviceState: null,
        deviceData: null,
        enclosure: null,
      },
      rules: {},
    };
  },
  async check() {
    await this.$refs.form.validate();
    return cloneDeep(this.formData);
  },
};
</script>

<style lang="scss" scoped>
.autograph  {
  width: 100%;
  height: auto;
}
</style>

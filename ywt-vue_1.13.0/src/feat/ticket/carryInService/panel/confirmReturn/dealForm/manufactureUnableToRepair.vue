<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 17:18:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-29 10:30:18
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
  isNil,
  omitBy,
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
        deviceState: '1',
        deviceData: '1',
        enclosure: null,
      },
      rules: {},
    };
  },
  created() {
    this.formData = Object.assign({}, this.formData, omitBy(this.data, isNil));
  },
  methods: {
    async check() {
      await this.$refs.form.validate();
      return cloneDeep(this.formData);
    },
  },

};
</script>

<style lang="scss" scoped>

</style>

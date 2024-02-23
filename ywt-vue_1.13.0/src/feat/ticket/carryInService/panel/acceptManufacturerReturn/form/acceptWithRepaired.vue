<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-16 17:56:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-17 10:12:45
 * @Description:已修好
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
    style="position: relative;"
  >
    <el-form-item label="结算方式" class="special-item">
      <dic-select v-model="formData.settlementMethod" dic-key="settlement_method" type="string" />
    </el-form-item>
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
      <el-col :span="12">发票信息</el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="发票返回">
          <el-radio-group v-model="formData.invoiceFlag">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="formData.invoiceFlag==='1'" :span="12">
        <el-form-item label="发票类型" prop="invoiceType">
          <dic-select v-model="formData.invoiceType" dic-key="Invoice_type" type="string" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item v-if="formData.invoiceFlag==='1'" label="发票号" prop="invoiceNum">
      <el-input v-model="formData.invoiceNum" />
    </el-form-item>
    <el-row class="base-margin-top base-margin-bottom">
      <el-col :span="12">测试报告</el-col>
    </el-row>
    <el-form-item label="测试报告">
      <el-radio-group v-model="formData.testReportFlag">
        <el-radio label="1">是</el-radio>
        <el-radio label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
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
import Moment from 'moment';
import {
  cloneDeep,
  omitBy,
  isNil,
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
        settlementMethod: null,
        deviceState: null,
        deviceData: null,
        returnUser: null,
        returnTime: Moment().format('YYYY-MM-DD HH:mm'),
        testReportEnclosure: '1',
        invoiceFlag: '1',
        invoiceType: null,
        invoiceNum: null,
        enclosure: null,
      },
      rules: {
        returnTime: [
          { required: true, message: '请选择送回时间', trigger: 'change', }
        ],
        invoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'change', }
        ],
        invoiceNum: [
          { required: true, message: '请输入发票号', trigger: 'blur', }
        ],
      },

    };
  },
  watch: {
    data: {
      handler(val) {
        this.formData = Object.assign({}, this.formData, omitBy(val, isNil));
      },
      deep: true,
    },
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
.special-item{
  position: absolute;
  right: 0px;
  top: -48px;
  width: 325px;
}
.autograph  {
  width: 100%;
  height: auto;
}
</style>

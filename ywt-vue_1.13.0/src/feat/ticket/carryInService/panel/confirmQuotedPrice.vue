<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-20 16:11:47
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-26 11:27:59
 * @Description:报价确认面板-Depressed
-->
<template>
  <pure-card class="max-height" :disabled="disabled">
    <div slot="header">
      报价确认
      <span class="createUser">
        操作人: <span>谢波</span>
      </span>
      <span class="createUser">
        操作时间:<span>2021-03-11 09:28:32</span></span>
    </div>
    <el-form
      ref="form"
      label-position="right"
      label-width="128px"
      size="mini"
      :disabled="disabled"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="是否维修">
        <el-radio-group v-model="formData.repairFlag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="维修确认人" prop="quoteEnterUser">
            <user-select v-model="formData.quoteEnterUser" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式">
            <el-input v-model="formData.phone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报价确认时间">
            <el-date-picker
              v-model="formData.selectTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="!needRepair" label="结算方式">
            <dic-select v-model="formData.settlementMethod" dic-key="settlement_method" type="string" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
      <template v-if="needRepair">
        <el-form-item label="厂家配送至" prop="sendDept">
          <department-cascader v-model="formData.sendDept" class="w-100" @change="onDepartmentChange" />
        </el-form-item>
        <el-form-item label="科室地址" prop="deptPlace">
          <el-input v-model="formData.deptPlace" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接收人">
              <user-select v-model="formData.receiveUser" @change="onReceiveUserChange" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收人电话">
              <el-input v-model="formData.receivePhone" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </el-form>
  </pure-card>
</template>

<script>
import {
  cloneDeep,
} from 'lodash';
import UserSelect from '@/views/project/components/userSelect/index';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import EngineerApi from '@/feat/system/user/api';
export default {
  components: {
    UserSelect,
    DicSelect,
    DepartmentCascader,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        repairFlag: 1,
        quoteEnterUser: null,
        phone: null,
        selectTime: null,
        settlementMethod: null,
        remark: null,
        sendDept: null,
        deptPlace: null,
        receiveUser: null,
        receivePhone: null,
      },
      rules: {
        quoteEnterUser: [
          { required: true, message: '请选择维修确认人', trigger: 'change', }
        ],
        sendDept: [
          { required: true, message: '请选择配送科室', trigger: 'change', }
        ],
        deptPlace: [
          { required: true, message: '请输入科室地址', trigger: 'blur', }
        ],
      },
    };
  },
  computed: {
    needRepair() {
      return this.formData.repairFlag === 1;
    },
  },
  methods: {
    async check() {
      await this.$refs['form'].validate();
      return cloneDeep(this.formData);
    },
    async onDepartmentChange(data) {
      this.formData.deptPlace = data?.deptPlace;
    },
    async onReceiveUserChange() {
      const data = await EngineerApi.detail(this.formData.receiveUser);
      this.formData.receivePhone = data?.mblNo;
    },
  },
};
</script>

<style lang="scss" scoped>
.createUser,
.createTime {
  color: #879bba;
  font-size: $--pure-little-font-size;
  span {
    font-weight: 400;
    color: #2d405e;
  }
}
</style>

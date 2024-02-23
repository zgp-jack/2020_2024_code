<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-01 14:03:08
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-12 10:38:19
 * @Description:报价审核-不邀标面板
-->
<template>
  <collapse-item
    :name="name"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <template #title>
      报价审核
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
      <el-form-item label="审核结果">
        <dic-radio v-model="formData.repairFlag" dic-key="quota_audit" type="string" />
      </el-form-item>
      <el-form-item v-if="formData.repairFlag==='2'" label="不通过原因" prop="failReason">
        <dic-select v-model="formData.failReason" dic-key="fail_reason" type="string" />
      </el-form-item>
      <el-row v-if="formData.repairFlag==='3'">
        <el-col :span="12">
          <el-form-item label="转交至 " prop="forwardUser">
            <user-select v-model="formData.forwardUser" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
  </collapse-item>
</template>

<script>
import CarryInServiceApi from '../api';
import CarryInServiceMixin from '../mixin';
import DicRadio from '@/feat/system/dictionary/normal/component/dicRadio.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import UserSelect from '@/views/project/components/userSelect/index';
export default {
  name: 'ExamineQuotePriceWithoutBidPanel',
  components: {
    DicRadio,
    DicSelect,
    UserSelect,
  },
  mixins: [CarryInServiceMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
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
      name: 'ExamineQuotePriceWithoutBidPanel',
      formData: {
        repairFlag: '1',
        failReason: '1',
        forwardUser: null,
        remark: null,
      },
      rules: {
        failReason: [
          { required: true, message: '请选择不通过原因', trigger: 'change', }
        ],
        forwardUser: [
          { required: true, message: '请选择转交人', trigger: 'change', }
        ],
      },
    };
  },
  created() {
    if (this.data.id) {
      this.formData = Object.assign({}, this.data);
    }
  },
  methods: {
    async check(repairId) {
      await this.$refs['form'].validate();
      return CarryInServiceApi.examineQuotePrice({ ...this.formData, repairId: repairId, });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-10 20:06:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-13 15:32:19
 * @Description:未通过弹窗
-->
<template>
  <div>
    <el-form label-position="right" label-width="108px" size="mini">
      <el-form-item label="未通过原因">
        <!-- <el-radio-group v-model="reason">
          <el-radio :label="1">待完善</el-radio>
          <el-radio :label="2">交付不全</el-radio>
          <el-radio :label="3">其他</el-radio>
        </el-radio-group> -->
        <not-pass-reason-radio v-model="formData.reason" />
      </el-form-item>
      <el-form-item label="详细说明">
        <el-input v-model="formData.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <el-row>

      <el-col style="text-align:right">
        <el-button
          size="mini"
          type="primary"
          @click="submit"
        >提交</el-button></el-col>
    </el-row>
  </div>
</template>

<script>

import notPassReasonRadio from '../radio/notPassReasonRadio.vue';
import TicketApi from '@/views/reportFault/api';
export default {
  components: {
    notPassReasonRadio,
  },
  props: {
    orderNum: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        reason: '1',
        remark: null,
      },
    };
  },
  methods: {
    async submit() {
      try {
        await TicketApi.notPassAudit({
          orderNum: this.orderNum,
          remark: this.formData.remark,
          processValue: this.formData.reason,
        });
        this.$emit('done');
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-05-10 19:20:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-12 18:43:29
 * @Description:退单弹窗
-->
<template>
  <div>
    <el-form label-position="right" label-width="90px" size="mini">
      <el-form-item label="退单原因">
        <send-back-reason-radio v-model="formData.reason" />
      </el-form-item>
      <el-form-item label="详细说明">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="4"
        />
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
import SendBackReasonRadio from '../radio/sendBackReasonRadio.vue';
import {
  sendBack,
} from '@/apis/reportFault/workOrder';
export default {
  components: {
    SendBackReasonRadio,
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
        await sendBack({
          orderNum: this.orderNum,
          remark: this.formData.remark,
          processValue: this.formData.reason,

        });
        this.$emit('done');
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
        this.$emit('done');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

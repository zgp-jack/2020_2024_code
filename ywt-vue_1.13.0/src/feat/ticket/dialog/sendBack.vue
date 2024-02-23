<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-19 14:44:31
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-08 15:27:00
 * @Description:退单弹窗
-->
<template>
  <el-form
    label-position="right"
    label-width="90px"
    size="mini"
  >
    <el-form-item label="退单原因">
      <dic-radio v-model="formData.processValue" dic-key="returnReception" />
    </el-form-item>
    <el-form-item label="详细说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
    <div class="align-right">
      <pure-button label="提交" @click="onSubmit" />
    </div>

  </el-form>
</template>
<script>
import TicketApi from '../api';
import DicRadio from '@/views/components/dictionary/dicRadio.vue';
export default {
  name: 'SendTicketBackDialog',
  components: {
    DicRadio,
  },
  props: {
    ticketId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      formData: {
        ticketId: null,
        remark: null,
        processValue: 1,
      },
    };
  },
  created() {
    if (!this.ticketId) {
      throw new Error('ticketId is required');
    }
    this.formData.ticketId = this.ticketId;
  },
  methods: {
    async onSubmit() {
      try {
        await TicketApi.sendBack(this.formData);
        this.$message.success('退单成功');
        this.$emit('done');
      } catch (error) {
        this.$message.error(`退单失败: ${error}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-09 15:34:11
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-02-09 17:01:08
 * @Description:未通过审核弹窗
-->
<template>
  <el-form
    label-position="right"
    label-width="108px"
    size="mini"
  >
    <el-form-item label="未通过原因">
      <dic-radio v-model="formData.processValue" dic-key="noExamine" type="string" />
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
  name: 'TicketNotPassAuditDialog',
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
        processValue: '1',
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
        await TicketApi.notPassAudit(this.formData);
        this.$message.success('审核未通过处理成功');
        this.$emit('done');
      } catch (error) {
        this.$message.error(`审核未通过处理失败: ${error}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>

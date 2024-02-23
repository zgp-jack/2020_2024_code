<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-25 16:30:45
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-14 09:36:45
 * @Description:终止表单
-->
<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
  >
    <el-form-item v-if="requiredDealTime" label="处理时间" required>
      <el-date-picker
        v-model="formData.createTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        align="right"
        :prefix-icon="'null'"
        :clear-icon="'null'"
        class="date-picker"
      />
    </el-form-item>
    <el-form-item label="终止原因">
      <dic-select v-model="formData.processValue" dic-key="stopReason" type="string" />
    </el-form-item>
    <el-form-item label="详细说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        :rows="4"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import TicketApi from '@/feat/ticket/api';
import moment from 'moment';
export default {
  name: 'EndTermination',
  components: {
    DicSelect,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        processValue: '1',
        remark: null,
        createTime: null,
      },
    };
  },
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      await TicketApi.terminate({
        ticketId,
        ...this.formData,
        makeTime: this.formData.createTime,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  width: 100%;
  ::v-deep .el-input__inner {
    padding: 0 16px;
  }
}
</style>

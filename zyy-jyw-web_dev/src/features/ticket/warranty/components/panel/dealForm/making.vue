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
    <el-form-item label="处理内容">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入处理内容"
        :rows="4"
        show-word-limit
        maxlength="1000"
      />
    </el-form-item>

    <el-form-item label="附件">
      <el-col :span="22" style="padding-left: 0px;">
        <upload v-model="formData.processEnclosure" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import TicketApi from '@/features/ticket/api';
import moment from 'moment';
export default {
  name: 'Making',
  components: {
    Upload: () => import('@/common/components/upload'),
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultData: {
      type: Object,
      default: () => ({}),
    },
    requiredDealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        remark: null,
        processEnclosure: [],
        // 处理时间
        createTime: null,
      },
    };
  },
  mounted() {

  },
  created() {
    this.formData = Object.assign({}, this.formData, this.defaultData);
    if (!this.formData.createTime) {
      this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
    }
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      await TicketApi.deal({
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

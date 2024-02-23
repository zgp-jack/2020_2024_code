<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
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
    <el-form-item label="终止原因" prop="reason">
      <dic-select v-model="formData.reason" placeholder="请选择终止原因" dic-key="obs_termination_reason" />
    </el-form-item>
    <el-form-item label="终止说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入终止说明"
        :rows="4"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import TicketApi from '@/features/ticket/api';
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
        reason: '1',
        remark: null,
        createTime: null,
      },
    };
  },
  computed: {
    rules() {
      return {
        reason: [{
          required: true, message: '请选择终止原因', trigger: 'blur',
        },
        ],
      };
    },
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

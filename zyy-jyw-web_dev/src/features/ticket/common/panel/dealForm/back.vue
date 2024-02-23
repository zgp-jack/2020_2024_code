<template>
  <el-form
    ref="form"
    label-position="right"
    size="mini"
    label-width="128px"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
  >
    <el-form-item label="退单原因" prop="reason">
      <dic-select v-model="formData.reason" dic-key="obs_return_reception" type="string" placeholder="请选择退单原因" />
    </el-form-item>
    <el-form-item label="退单说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入退单说明"
        :rows="4"
        show-word-limit
        maxlength="1000"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import TicketApi from '@/features/ticket/api';
import moment from 'moment';
export default {
  name: 'Back',
  components: {
    DicSelect,
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
          required: true, message: '请选择退单原因', trigger: 'blur',
        },
        ],
      };
    },
  },
  created() {
    this.formData = Object.assign({}, this.formData, this.defaultData);
  },
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      await TicketApi.sendBack({
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

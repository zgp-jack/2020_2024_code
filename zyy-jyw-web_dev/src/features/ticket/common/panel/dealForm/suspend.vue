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
    <el-form-item label="暂停原因" prop="reason">
      <dic-select v-model="formData.reason" dic-key="obs_pause_reason" type="string" placeholder="请选择暂停原因" />
    </el-form-item>
    <el-form-item label="暂停说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入暂停说明"
        :rows="4"
      />
    </el-form-item>
    <el-form-item label="附件">
      <el-col :span="22" style="padding-left: 0px;">
        <upload v-model="formData.enclosure" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import TicketApi from '@/features/ticket/api';
import moment from 'moment';
export default {
  name: 'Suspend',
  components: {
    DicSelect,
    Upload: () => import('@/common/components/upload'),
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
        enclosure: [],
        // 处理时间
        createTime: null,
      },
    };
  },
  computed: {
    rules() {
      return {
        reason: [{
          required: true, message: '请选择暂停原因', trigger: 'blur',
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
      await TicketApi.suspend({
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

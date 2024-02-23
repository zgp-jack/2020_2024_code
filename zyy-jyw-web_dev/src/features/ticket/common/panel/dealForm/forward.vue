<template>
  <el-form
    ref="form"
    label-position="right"
    label-width="128px"
    size="mini"
    :disabled="disabled"
    :model="formData"
    :rules="rules"
    style="padding-right: 10px;"
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
    <el-form-item label="转交至" prop="selectedSend">
      <el-input
        ref="sendUserInput"
        v-model="selectedSendEngineer.name"
        size="small"
        style="width: auto"
        placeholder="请选择转交人"
        @focus="handleOpenEngineerPanel"
      />
    </el-form-item>
    <el-form-item label="转交原因" prop="reason">
      <dic-select v-model="formData.reason" placeholder="请选择转交原因" dic-key="obs_trans_reason" type="string" />
    </el-form-item>
    <el-form-item label="转交说明">
      <el-input
        v-model="formData.remark"
        type="textarea"
        placeholder="请输入转交说明"
        :rows="4"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import TicketApi from '@/features/ticket/api';
import EngineerPanel from '@/features/system/user/drawer/user.vue';
import moment from 'moment';
export default {
  name: 'Forward',
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
        // 处理时间
        createTime: null,
      },
      // 指派人信息
      selectedSendEngineer: { name: null,
        id: null,
      },
    };
  },
  computed: {
    rules() {
      const selectedSend = (rule, value, callback) => {
        if ((!this.selectedSendEngineer.teamId) && (!this.selectedSendEngineer.engineerId)) {
          callback(new Error('请选择转交人'));
        } else {
          callback();
        }
      };
      return {
        selectedSend: [
          { required: true, validator: selectedSend, message: '请选择转交人', },
        ],
        reason: [{
          required: true, message: '请选择转交原因', trigger: 'blur',
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
      const data = {};
      if (this.selectedSendEngineer.isTeam) {
        data.sendObjId = this.selectedSendEngineer.teamId;
        data.sendObjType = 2;
      } else {
        data.sendObjId = this.selectedSendEngineer.engineerId;
        data.sendObjType = 1;
        data.sendTeam = this.selectedSendEngineer.teamId || null;
        if (data.sendUser === this.userInfo?.userId) {
          data.sendType = 1;
        }
      }
      await TicketApi.transfer({
        ticketId,
        ...this.formData,
        sendTeam: data.sendTeam,
        sendObjId: data.sendObjId,
        sendObjType: data.sendObjType,
      });
    },
    convertTransHistor(val) {
      if (!val) {
        // return staffId(this.selfId);
      } else {
        return val
          .split(',')
          .join('>');
      }
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$drawer({
        width: '688px',
        component: () => <EngineerPanel onDone={this.handleSelectedEngineer} defaultSelectedData={this.selectedSendEngineer}/>,
      });
    },
    handleSelectedEngineer(data) {
      this.$refs.sendUserInput.blur();
      this.selectedSendEngineer = Object.assign({}, data);
      this.$refs.sendUserInput.blur();
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

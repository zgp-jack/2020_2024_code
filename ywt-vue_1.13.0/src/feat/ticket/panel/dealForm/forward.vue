<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-25 18:18:49
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-14 09:37:24
 * @Description:转交
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
    <el-form-item label="原处理人:">
      <span style="color: #879bba">{{
        convertTransHistor(formData.makeHisUserToName)
      }}</span>
    </el-form-item>
    <el-form-item label="转交至">
      <el-input
        ref="sendUserInput"
        v-model="selectedSendEngineer.name"
        style="width: auto"
        @focus="handleOpenEngineerPanel"
      />
    </el-form-item>
    <el-form-item label="转交原因">

      <dic-select v-model="formData.processValue" dic-key="transReason" type="string" />
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
import { staffId, } from '@/filters';
import EngineerPanel from '@/views/sharedComponents/engineer/engineerPanel.vue';
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
        processValue: '1',
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
  mounted() {
    this.formData.createTime = this.formData.createTime = moment().format('YYYY-MM-DD HH:mm:ss');
  },
  methods: {
    async onSubmit(ticketId) {
      await this.$refs.form.validate();
      if (!this.selectedSendEngineer.id) {
        throw new Error('请选择转交人');
      }
      let sendTeam = null;
      let sendUser = null;
      if (this.selectedSendEngineer.isTeam) {
        sendTeam = this.selectedSendEngineer.id?.split('-')[1];
      } else {
        sendUser = this.selectedSendEngineer.id?.split('-')[2];
      }
      await TicketApi.transfer({
        ticketId,
        ...this.formData,
        sendTeam,
        sendUser,
        makeTime: this.formData.createTime,
      });
    },
    convertTransHistor(val) {
      if (!val) {
        return staffId(this.selfId);
      } else {
        return val
          .split(',')
          .join('>');
      }
    },
    async handleOpenEngineerPanel() {
      this.$refs.sendUserInput.blur();
      this.$innerDrawer({
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

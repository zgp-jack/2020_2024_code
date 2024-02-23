<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
    class="drawer"
  >
    <div class="header">
      <div class="title">
        {{ createPattern === 'warranty' ? '报修' : title }}
        <span v-if="id">
          <span class="ticket-id">工单编号：{{ id }}</span>
        </span>
      </div>

    </div>
    <div class="body">
      <el-row
        v-if="operatorType==='CREATE' || operatorType==='EDIT' "
        :gutter="16"
        class="h-100"
        justify="space-around"
        type="flex"
      >
        <el-col
          :span="12"
          class="h-100"
        >
          <ticket-fault-info-panel
            ref="faultInfo"
            :fault="formData.fault"
            :operator-type="operatorType"
            :create-pattern="createPattern"
            class="fault-info-panel"
          />
        </el-col>
        <el-col
          :span="12"
          class="middle-col"
        >
          <div>
            <ticket-answer-info-panel
              ref="answerInfo"
              :info="formData.info"
              :create-pattern="createPattern"
              class="answer-info-panel"
            />
          </div>
          <div class="flex-container">
            <ticket-related-info-panel
              ref="relatedInfo"
              class="related-info-panel"
            />
          </div>
        </el-col>
      </el-row>
      <el-row
        v-else-if="operatorType==='UPDATE' "
        :gutter="16"
        class="h-100"
        justify="space-around"
        type="flex"
      >
        <el-col
          :span="10"
          class="h-100"
        >
          <ticket-deal-form-panel
            ref="processInfo"
            :fault-info="formData.fault"
            :is-assist="id.includes('#')"
            class="deal-form-panel"
            v-bind="$attrs"
          />
        </el-col>
        <el-col
          :span="10"
          class="h-100"
        >
          <ticket-deal-info-panel
            v-if="formData['fault']"
            :data="formData"
            class="deal-info-panel"
          />
        </el-col>
        <el-col
          :span="4"
          class="h-100"
        >
          <ticket-history-info-panel
            :id="id"
            class="history-info-panel"
          />
        </el-col>
      </el-row>
      <el-row
        v-else-if="operatorType==='VIEW' "
        :gutter="16"
        class="h-100"
        justify="space-around"
        type="flex"
      >
        <el-col
          :span="14"
          class="h-100"
        >
          <ticket-deal-info-panel
            v-if="formData['fault']"
            :data="formData"
            class="deal-info-panel"
          />
        </el-col>
        <el-col
          :span="10"
          class="h-100"
        >
          <ticket-history-info-panel
            :id="id"
            class="history-info-panel"
          />
        </el-col>
      </el-row>
    </div>
    <div
      v-if="operatorType==='CREATE'"
      class="footer"
    >
      <pure-button
        :label="createPattern ==='warranty'?'提交':'创建工单'"
        @click="onCreateTicket"
      />
      <pure-button
        :label="createPattern ==='warranty'?'提交并继续报修':'创建并继续新增'"
        type="major"
        @click="onCreateTicket('createToNew')"
      />
      <pure-button
        label="取消"
        type=""
        @click="$emit('cancel')"
      />
    </div>
    <div
      v-else-if="operatorType==='UPDATE'"
      class="footer"
    >
      <pure-button
        label="提交"
        @click="onUpdateTicket"
      />
    </div>
    <div
      v-else-if="operatorType==='EDIT'"
      class="footer"
    >
      <pure-button
        label="提交"
        @click="onUpdateAnswerAndFaultInfo"
      />
    </div>
    <div
      v-else-if="operatorType==='VIEW'"
      class="footer"
    >
      <pure-button
        label="取消"
        type=""
        @click="$emit('cancel')"
      />
    </div>
  </div>
</template>

<script>
import DrawerMixin from '@/common/mixins/drawer';
import TicketApi from '@/features/ticket/api';
import TicketHistoryInfoPanel from './panel/historyInfo.vue';
import TicketDealInfoPanel from './panel/dealInfo.vue';
import TicketDealFormPanel from './panel/dealForm';
import TicketFaultInfoPanel from './panel/faultInfo.vue';
import TicketRelatedInfoPanel from './panel/relatedInfo.vue';
import TicketAnswerInfoPanel from './panel/answerInfo.vue';

export default {
  name: 'TicketDrawer',
  components: {
    TicketHistoryInfoPanel,
    TicketDealInfoPanel,
    TicketDealFormPanel,
    TicketFaultInfoPanel,
    TicketRelatedInfoPanel,
    TicketAnswerInfoPanel,
  },
  mixins: [
    DrawerMixin,
  ],
  props: {
    // 弹窗或面板打开目的
    createPattern: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '工单',
      formData: {},
      detailApi: TicketApi.detail,
    };
  },
  watch: {
    formData(val) {
      console.log(val);
    },
  },
  methods: {
    async onCreateTicket(params) {
      try {
        const fault = await this.$refs.faultInfo.check();
        const info = await this.$refs.answerInfo.check();
        const data = {
          ...info,
          ...fault,
        };
        if (this.createPattern === 'warranty') {
          await TicketApi.addRepairOrderData(data);
        } else {
          await TicketApi.create(data);
        }
        if (params !== 'createToNew') {
          this.$emit('done');
        } else {
          this.$refs.faultInfo.reset();
          this.$refs.answerInfo.reset();
          this.$emit('refresh');
        }
      } catch (error) {
        console.log(error);
        error && this.$message.error(error);
      }
    },
    async onUpdateTicket() {
      try {
        await this.$refs.processInfo.onSubmit(this.id);
        this.$message.success('操作成功');
        this.$emit('done');
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    async onUpdateAnswerAndFaultInfo() {
      console.log(this.formData);
      try {
        const fault = await this.$refs.faultInfo.check();
        const info = await this.$refs.answerInfo.check();
        const data = {
          ...fault,
          info,
          orderNum: this.id,
        };
        await TicketApi.update(data);
        this.$emit('done');
      } catch (error) {
        console.error(error);
        error && this.$message.error(error);
      }
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.body {
  height: 100%;

  .card {
    height: 100%;
  }

  &::v-deep .pure-card__body {
    max-height: calc(100% - 34px);
    height: calc(100% - 34px);
  }
}

.ticket-id {
  padding-left: 10px;
  font-size: 12px;
  @include font_color_imp('color-text-minor');
}

.history-info-panel {
  height: 100%;

  &::v-deep .pure-card__body {
    height: calc(100% - 36px);
  }
}

.deal-form-panel {
  height: 100%;

  &::v-deep .pure-card__body {
    height: calc(100% - 72px);
  }
}

.fault-info-panel {
  height: 100%;

  &::v-deep .pure-card__body {
    height: calc(100% - 71px);
  }
}

.deal-info-panel {
  height: 100%;

  &::v-deep .pure-card__body {
    height: calc(100% - 120px);
  }
}
</style>

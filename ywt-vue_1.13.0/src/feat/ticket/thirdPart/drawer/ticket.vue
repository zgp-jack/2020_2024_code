<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-30 09:48:25
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 14:24:03
 * @Description:第三方工单抽屉
-->
<template>
  <div
    v-loading="loading"
    class="drawer"
    :element-loading-text="loadingText"
  >
    <div class="header">
      <div class="title">
        {{ title }}
        <span v-if="id">
          <pure-tag v-if="id.includes('#')" :label="'协'" />
          <span class="ticket-id">工单编号:{{ id }}</span>
        </span>

      </div>
    </div>
    <div class="body">

      <el-row
        v-if="operatorType==='VIEW'"
        class="h-100"
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <template v-if="formData.evaluateFlag">
          <el-col :span="12" class="h-100">
            <ticket-evaluation-info-panel key="ss" class="evaluation-info-panel" :ss="formData" :disabled="true" />
          </el-col>
          <el-col :span="12" class="middle-col">
            <div>
              <ticket-answer-info-panel key="test" :info="formData" :disabled="true" :default-expand="false" :show-expand="true" class="answer-info-panel" />
            </div>
            <div>
              <ticket-fault-info-panel key="test2" :info="formData" class="process-flow-panel" :default-expand="false" :disabled="true" :show-expand="true" />
            </div>
            <div>
              <ticket-dispatch-info-panel :info="formData" :disabled="true" :show-expand="true" class="process-flow-panel" :default-expand="false" />
            </div>
            <div class="flex-container">
              <ticket-process-info-panel class="fault-info-panel" :disabled="true" :info="formData" :show-expand="true" />
            </div>

          </el-col>
        </template>
        <template v-else>
          <el-col :span="12" class="h-100">
            <ticket-process-info-panel class="fault-info-panel" :disabled="true" :info="formData" />
          </el-col>
          <el-col :span="12" class="middle-col">
            <div>
              <ticket-answer-info-panel :info="formData" :disabled="true" :show-expand="true" class="answer-info-panel" />
            </div>
            <div>
              <ticket-fault-info-panel :info="formData" class="process-flow-panel" :disabled="true" :show-expand="true" />
            </div>
            <div class="flex-container">
              <ticket-dispatch-info-panel :info="formData" :disabled="true" class="process-flow-panel" :show-expand="true" />
            </div>

          </el-col>
        </template>

      </el-row>
    </div>
  </div>
</template>

<script>
import TicketApi from '../api';
import TicketAnswerInfoPanel from '../panel/answerInfo.vue';
import TicketFaultInfoPanel from '../panel/faultInfo.vue';
import TicketProcessInfoPanel from '../panel/processInfo.vue';
import TicketDispatchInfoPanel from '../panel/dispatchInfo.vue';
import TicketEvaluationInfoPanel from '../panel/evaluationInfo.vue';
import FormDialog from '@/minxins/common/formDialog';
import PureTag from '@/components/tag/tag.vue';
export default {
  name: 'TicketInfoDrawer',
  components: {
    TicketAnswerInfoPanel,
    TicketFaultInfoPanel,
    TicketProcessInfoPanel,
    TicketDispatchInfoPanel,
    TicketEvaluationInfoPanel,
    PureTag,
  },
  mixins: [FormDialog],
  data() {
    return {
      name: '工单',
      detailApi: TicketApi.detail,
      formData: {
      },
      answerInfo: {

      },
    };
  },
  async mounted() {

  },
  methods: {
    async afterFetchDetail() {
      console.log(this.formData);
    },

  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100%;
  .card {
      height: 100%;
  }
  &::v-deep .pure-card__body {
    max-height:calc(100% - 34px);
    height: calc(100% - 34px);
  }
}
    .middle-col {
    display: flex;
    flex-direction: column;
  }
    .flex-container {
    flex:1;
    overflow: hidden;
  }
.footer {
  height: 56px;
  padding-top: 12px;
  padding-bottom: 12px;
}
  .ticket-id {
    padding-left: 36px;
    font-size: 14px;
    color: #879bba;
  }
    .answer-info-panel {
    margin-bottom: 16px;
  }
  .fault-info-panel
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 71px);
    }
  }
  .process-flow-panel {
     margin-bottom: 16px;
    &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
  }
.evaluation-info-panel {
  height: 100%;
   &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
}
</style>

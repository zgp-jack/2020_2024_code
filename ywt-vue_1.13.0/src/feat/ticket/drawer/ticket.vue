<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-24 16:54:00
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-26 10:05:15
 * @Description:工单抽屉弹窗
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
        v-if="operatorType==='CREATE'"
        class="h-100"
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <el-col :span="12" class="h-100">
          <ticket-fault-info-panel ref="faultInfo" class="fault-info-panel" :type="createPattern" :operator-type="operatorType" />

        </el-col>
        <el-col :span="12" class="middle-col">
          <div>
            <ticket-answer-info-panel ref="answerInfo" :create-pattern="createPattern" :info="formData.info" class="answer-info-panel" />
          </div>

          <div class="flex-container">
            <ticket-related-info-panel ref="relatedInfo" class="related-info-panel" @linkedTicket="onLinkedTicket" />
          </div>
        </el-col>
      </el-row>
      <el-row
        v-else-if="operatorType==='UPDATE'"
        class="h-100"
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <el-col :span="10" class="h-100">
          <ticket-process-info-panel
            ref="processInfo"
            :is-assist="id.includes('#')"
            class="fault-info-panel"
            :sponsor="formData.info.user"
            :fault-info="formData.fault"
            v-bind="$attrs"
          />
        </el-col>
        <el-col :span="10" class="middle-col">

          <div>
            <ticket-answer-info-panel :info="formData.info" :disabled="true" :show-expand="true" class="answer-info-panel" />
          </div>
          <div class="flex-container">
            <ticket-fault-info-panel :fault="formData.fault" class="fault-info-panel" :disabled="true" :show-expand="true" :operator-type="operatorType" />
          </div>
        </el-col>
        <el-col :span="4" class="h-100">
          <ticket-process-flow-panel :id="id" class="process-flow-panel" operator-type="UPDATE" :disabled="true" />
        </el-col>
      </el-row>
      <el-row
        v-else-if="operatorType==='VIEW'||operatorType==='EDIT'"
        class="h-100"
        :gutter="16"
        type="flex"
        justify="space-around"
      >
        <template v-if="hasEvaluated()">
          <el-col :span="10" class="h-100">
            <ticket-evaluation-info-panel class="evaluation-info-panel" :evaluate="formData.evaluate" :show-expand="true" />
          </el-col>
          <el-col :span="10" class="middle-col">
            <div>
              <ticket-answer-info-panel key="evaluate" :info="formData.info" :default-expand="false" class="answer-info-panel" :disabled="true" :show-expand="true" />
            </div>
            <div>
              <ticket-fault-info-panel key="evaluateFault" :fault="formData.fault" :default-expand="false" class="fault-info-panel base-margin-bottom" :disabled="true" :show-expand="true" :operator-type="operatorType" />
            </div>
            <div class="flex-container">
              <ticket-process-info-panel class="fault-info-panel" :disabled="true" :ticket-id="id" />
            </div>
          </el-col>
          <el-col :span="4" class="h-100">
            <ticket-process-flow-panel :id="id" class="process-flow-panel" :disabled="true" />
          </el-col>
        </template>
        <template v-else>
          <el-col :span="10" class="h-100">
            <ticket-process-info-panel class="fault-info-panel" :disabled="true" :ticket-id="id" />
          </el-col>
          <el-col :span="10" class="middle-col">
            <div>
              <ticket-answer-info-panel ref="answerInfo2" :info="formData.info" :disabled="operatorType!=='EDIT'" :show-expand="true" class="answer-info-panel" :operator-type="operatorType" />
            </div>
            <div class="flex-container">
              <ticket-fault-info-panel ref="faultInfo2" :fault="formData.fault" class="fault-info-panel" :disabled="operatorType!=='EDIT'" :show-expand="true" :operator-type="operatorType" />
            </div>
          </el-col>
          <el-col :span="4" class="h-100">
            <ticket-process-flow-panel :id="id" class="process-flow-panel" :disabled="true" />
          </el-col>
        </template>

      </el-row>
    </div>
    <div v-if="operatorType==='CREATE'" class="footer">
      <pure-button
        label="创建工单"
        @click="onCreateTicket"
      />
      <pure-button
        v-if="createPattern!=='byManual'"
        label="电话已解决"
        @click="onPhoneSolved"
      />
      <pure-button
        v-if="createPattern!=='byManual'"
        label="电话找人"
        @click="onPhoneFind"
      />
      <pure-button
        v-if="createPattern!=='byManual'"
        label="无效电话"
        @click="onPhoneInvalid"
      />

    </div>
    <div v-else-if="operatorType==='UPDATE'" class="footer">
      <pure-button
        label="提交"
        @click="onUpdateTicket"
      />
    </div>
    <div v-else-if="operatorType==='EDIT'" class="footer">
      <pure-button
        label="提交"
        @click="onUpdateAnswerAndFaultInfo"
      />
    </div>
  </div>
</template>

<script>
import TicketApi from '../api';
import TicketAnswerInfoPanel from '../panel/answerInfo.vue';
import TicketFaultInfoPanel from '../panel/faultInfo.vue';
import TicketProcessInfoPanel from '../panel/processInfo.vue';
import TicketProcessFlowPanel from '../panel/processFlow.vue';
import TicketRelatedInfoPanel from '../panel/relatedInfo.vue';
import TicketEvaluationInfoPanel from '../panel/evaluationInfo.vue';
import FindPersonDrawer from './findPerson.vue';
import FormDialog, { OPERATOR_TYPES, } from '@/minxins/common/formDialog';
import PureTag from '@/components/tag/tag.vue';
export default {
  name: 'TicketInfoDrawer',
  components: {
    TicketAnswerInfoPanel,
    TicketFaultInfoPanel,
    TicketProcessFlowPanel,
    TicketRelatedInfoPanel,
    TicketProcessInfoPanel,
    TicketEvaluationInfoPanel,
    PureTag,
  },
  mixins: [FormDialog],
  props: {
    // 创建方式: 弹屏-byPop, 手动-byManual, 通话记录-byCallRecord
    createPattern: {
      type: String,
      default: 'byManual',
    },
    answerInfo: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      name: '工单',
      detailApi: TicketApi.detail,
      formData: {
        fault: {},
        info: {},
        make: {},
        evaluate: {},
      },
    };
  },
  async mounted() {
    if (this.operatorType === OPERATOR_TYPES.CREATE && this.answerInfo) {
      this.formData.info = this.answerInfo;
      this.onAnswerInfoChange(this.answerInfo.phone, this.answerInfo.deptId, this.answerInfo.id);
    }
  },
  methods: {
    async afterFetchDetail() {
      console.log(this.formData);
    },
    hasEvaluated() {
      return this.formData?.evaluate?.id;
    },
    async onCreateTicket() {
      try {
        const fault = await this.$refs.faultInfo.check();
        const info = await this.$refs.answerInfo.check();
        const data = {
          ...fault,
          info,
        };
        await TicketApi.create(data);
        this.$emit('done');
      } catch (error) {
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
    async onPhoneSolved() {
      try {
        const fault = await this.$refs.faultInfo.check();
        const info = await this.$refs.answerInfo.check();
        const data = {
          ...fault,
          info,
          sendType: 3,
        };
        await TicketApi.create(data);
        this.$emit('done');
      } catch (error) {
        error && this.$message.error(error);
      }
    },
    async onPhoneFind() {
      this.$innerDrawer({
        width: '548px',
        component: () => <FindPersonDrawer callRecordId={this.formData.info.id} onDone={() => this.$emit('done')}/>,
      });
    },

    async onPhoneInvalid() {
      await TicketApi.invalidPhone(this.formData.info.id);
      this.$message.success('操作成功');
      this.$emit('done');
    },
    /**
     * 通过报修科室或者报修电话查询关联工单
     * @param {String} phone 报修电话
     * @param {Number} deptId 报修科室id
     * @param {Number} callRecordId 通话记录id
     */
    async onAnswerInfoChange(phone, deptId, callRecordId) {
      this.$refs.relatedInfo.fetchData(phone, deptId, callRecordId);
    },
    onLinkedTicket() {
      this.$emit('done');
    },
    async onUpdateAnswerAndFaultInfo() {
      try {
        const fault = await this.$refs.faultInfo2.check();
        const info = await this.$refs.answerInfo2.check();
        const data = {
          ...fault,
          info,
        };
        await TicketApi.create(data);
        this.$emit('done');
      } catch (error) {
        console.error(error);
        error && this.$message.error(error);
      }
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
    .process-flow-panel,.evaluation-info-panel {
    height: 100%;
    &::v-deep .pure-card__body{
      height: calc(100% - 40px);
    }
  }
   .related-info-panel
  {
    height: 100%;
    &::v-deep .pure-card__body {
      height: calc(100% - 40px);
    }
  }
</style>

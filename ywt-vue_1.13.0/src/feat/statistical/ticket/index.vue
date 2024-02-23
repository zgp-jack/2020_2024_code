<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 17:52:18
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-01-10 10:37:50
 * @Description:统计分析-工单
-->
<template>
  <el-container>
    <el-main>
      <div class="pure-top">
        <div class="content">
          <el-row type="flex" align="middle">
            <span class="title">统计分析</span>
            <el-date-picker
              v-model="period"
              size="mini"
              type="daterange"
              align="right"
              unlink-panels
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
            <pure-button label="查询" class="base-margin-left" @click="onQuery" />
          </el-row>
        </div>
      </div>

      <div class="main">
        <div class="pure-placeholder" />
        <RepairFailureWorkloadStatistics ref="repairFailureWorkloadStatistics" :time="period" />
        <service-desk-panel ref="serviceDeskPanel" class="base-margin-top" :date-time="period" />
        <el-row class="base-margin-top" :gutter="12">
          <el-col :span="8">
            <common-fault-panel ref="commonFaultPanel" />
          </el-col>
          <el-col :span="8">
            <repair-department-panel ref="repairDepartmentPanel" />
          </el-col>
          <el-col :span="8" />
        </el-row>
        <ticket-count-panel class="base-margin-top" />
        <el-row class="base-margin-top" :gutter="12">
          <el-col :span="12">
            <completion-ratio-panel ref="completionRatioPanel" />
          </el-col>
          <el-col :span="12">
            <service-timeliness-panel ref="serviceTimelinessPanel" />
          </el-col>
        </el-row>
        <service-response-panel ref="serviceResponsePanel" class="base-margin-top" />
        <clinical-satisfaction-panel v-show="false" ref="clinicalSatisfactionPanel" class="base-margin-top" />
        <el-row class="base-margin-top" :gutter="12">
          <el-col :span="12">
            <knowledge-base-panel ref="knowledgeBasePanel" />
          </el-col>
          <el-col :span="12">
            <knowledge-base-ref-panel ref="knowledgeBaseRefPanel" />
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import RepairFailureWorkloadStatistics from './panel/repairFailureWorkloadStatistics';
import CompletionRatioPanel from './panel/completionRatio.vue';
import CommonFaultPanel from './panel/commonFault.vue';
import RepairDepartmentPanel from './panel/repairDepartment.vue';
import ServiceDeskPanel from './panel/serviceDesk.vue';
import TicketCountPanel from './panel/ticketCount.vue';
import ServiceTimelinessPanel from './panel/serviceTimeliness.vue';
import ServiceResponsePanel from './panel/serviceResponse.vue';
import ClinicalSatisfactionPanel from './panel/clinicalSatisfaction.vue';
import KnowledgeBasePanel from './panel/knowledgeBase.vue';
import KnowledgeBaseRefPanel from './panel/knowledgeBaseRef.vue';
import Moment from 'moment';
export default {
  name: 'TjfxGd',
  components: {
    CompletionRatioPanel,
    CommonFaultPanel,
    RepairDepartmentPanel,
    ServiceDeskPanel,
    TicketCountPanel,
    ServiceResponsePanel,
    ServiceTimelinessPanel,
    ClinicalSatisfactionPanel,
    KnowledgeBasePanel,
    KnowledgeBaseRefPanel,
    RepairFailureWorkloadStatistics,
  },
  data() {
    return {
      period: [Moment().startOf('month').format('YYYY-MM-DD'), Moment().endOf('month').format('YYYY-MM-DD')],
      list: [{}],
      groupBtnOptions: [{
        count: null,
        name: '按任务类型',
      }, {
        count: null,
        name: '按工程师',
      }, {
        count: null,
        name: '按项目',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1按任务类型2按工程师3按项目4按供应商
      nameLabel: '任务类型',
      queryCondition: {
        startTime: Moment().startOf('month').format('YYYY-MM-DD'),
        endTime: Moment().endOf('month').format('YYYY-MM-DD'),
        template: 1,
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  methods: {
    onQuery() {
      this.startTime = this.period?.[0];
      this.endTime = this.period?.[1];
      this.queryCondition.startTime = this.startTime;
      this.queryCondition.endTime = this.endTime;
      this.$refs.knowledgeBaseRefPanel.changeQueryCondition(this.queryCondition);
      this.$refs.knowledgeBasePanel.changeQueryCondition(this.queryCondition);
      this.$refs.clinicalSatisfactionPanel.changeQueryCondition(this.queryCondition);
      this.$refs.serviceDeskPanel.changeQueryCondition(this.queryCondition);
      this.$refs.commonFaultPanel.changeQueryCondition(this.queryCondition);
      this.$refs.completionRatioPanel.changeQueryCondition(this.queryCondition);
      this.$refs.repairDepartmentPanel.changeQueryCondition(this.queryCondition);
      this.$refs.serviceResponsePanel.changeQueryCondition(this.queryCondition);
      this.$refs.serviceTimelinessPanel.changeQueryCondition(this.queryCondition);
      this.$refs.repairFailureWorkloadStatistics.changeQueryCondition(this.queryCondition);
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-top {
  .title {
    font-size: 24px;
    margin-right: 48px;
  }
  height: 64px;
  background: #ffffff;
  width: calc(100% + 12px);
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  padding-top: 16px;
  z-index: 50;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.main {
   overflow-x: hidden ;
  .pure-placeholder {
     height: 64px;
  }
}

</style>

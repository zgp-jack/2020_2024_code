<template>
  <div class="comp-other-config-global">
    <el-tabs v-model="activeName" tab-position="left" @tab-click="changeTab">
      <el-tab-pane label="工单审核" name="workOrderAudit">
        <CompReportErrorWorkOrderAudit />
      </el-tab-pane>
      <el-tab-pane label="自动派单" name="automaticOrder">
        <AutomaticOrder ref="automaticOrderRef" />
      </el-tab-pane>
      <el-tab-pane label="催单规则" name="reminderRule">
        <ReminderRule />
      </el-tab-pane>
      <el-tab-pane label="工单评价" name="evaluate">
        <CompReportErrorWorkOrderEvaluate />
      </el-tab-pane>
      <!-- <el-tab-pane label="服务台考勤" name="attendance">
        <CompReportErrorAttendance />
      </el-tab-pane>-->
      <el-tab-pane label="服务时效性" name="timeliness">
        <CompReportErrorTimeliness />
      </el-tab-pane>
      <!-- <el-tab-pane label="工单提示配置" name="workOrderTips">
        <CompReportErrorWorkOrderTips />
      </el-tab-pane> -->
      <el-tab-pane label="工单提醒配置" name="workOrderReminder">
        <WorkOrderReminder />
      </el-tab-pane>
      <!--<el-tab-pane label="工单接单科室" name="acceptDepartment">
        <CompReportErrorWorkOrderAcceptDepartment />
      </el-tab-pane>-->
      <el-tab-pane label="工单期望完成时间" name="expextedCompletionTime">
        <ExpextedCompletionTime />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CompReportErrorWorkOrderAudit from './report-error-work-order-audit.vue';
// import CompReportErrorAttendance from './report-error-attendance.vue';
import CompReportErrorTimeliness from './report-error-timeliness.vue';
// import CompReportErrorWorkOrderTips from './report-error-work-order-tips.vue';
// import CompReportErrorWorkOrderAcceptDepartment from './report-error-work-order-accept-department.vue';
import CompReportErrorWorkOrderEvaluate from './report-error-work-order-evaluate.vue';
import WorkOrderReminder from './workOrderReminder.vue';
import ReminderRule from './reminderRule.vue';
import ExpextedCompletionTime from './expextedCompletionTime.vue';
import AutomaticOrder from './automaticOrder.vue';

export default {
  components: {
    CompReportErrorWorkOrderAudit,
    // CompReportErrorAttendance,
    CompReportErrorTimeliness,
    // CompReportErrorWorkOrderTips,
    // CompReportErrorWorkOrderAcceptDepartment,
    CompReportErrorWorkOrderEvaluate,
    WorkOrderReminder,
    ReminderRule,
    ExpextedCompletionTime,
    AutomaticOrder,
  },
  data() {
    return {
      activeName: 'workOrderAudit',
    };
  },
  methods: {
    changeTab(val) {
      if (val.name === 'automaticOrder') {
        this.$refs.automaticOrderRef.getData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comp-other-config-global {
  ::v-deep {
    .el-tabs__header {
      width: 150px;
      margin-right: 0;
      background: #fff;
    }
  }
}
</style>

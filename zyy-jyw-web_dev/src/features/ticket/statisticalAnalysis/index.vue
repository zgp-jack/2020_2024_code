/**
* @file index.vue
* @author huang
* @date 2023/8/28
* @description  统计分析
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <el-container>
    <el-header height="auto">
      <div class="form-box">
        <el-form
          inline
          size="small"
        >
          <el-form-item>
            <template #label>
              <span class="label">
                公共查询条件
              </span>
            </template>
            <use-department-list v-model="searchParam.deptId" placeholder="院区/科室" :show-all-levels="false" collapse-tags size="mini" clearable class="item" />
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchParam.searchDate" type="daterange" />
          </el-form-item>
          <el-form-item>
            <pure-button
              icon="search"
              label="查询"
              type="minor"
              @click="onQueryRecord"
            />

            <pure-button
              icon="reset"
              label="重置"
              type="patch"
              @click="onResetRecord"
            />
          </el-form-item>
        </el-form>
      </div>

    </el-header>
    <el-main class="main">
      <el-row
        :gutter="16"
        class="row"
      >
        <el-col :span="12">
          <!-- 工单来源-->
          <ticket-source-chart ref="ticketSource" />
        </el-col>
        <el-col :span="12">
          <!--          故障分类-->
          <fault-class-chart ref="faultClass" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">
          <work-order-num-chart ref="workOrderNum" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">
          <common-malfunctions-table ref="commonMalfunctions" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">
          <service-desk-table />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import TicketSourceChart from './chart/ticketSource.vue';
import FaultClassChart from './chart/faultClass.vue';
import WorkOrderNumChart from './chart/workOrderNum.vue';
import CommonMalfunctionsTable from './table/commonMalfunctions.vue';
import ServiceDeskTable from './table/serviceDesk.vue';
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';

export default {
  components: {
    UseDepartmentList,
    TicketSourceChart,
    FaultClassChart,
    WorkOrderNumChart,
    CommonMalfunctionsTable,
    ServiceDeskTable,
  },
  data() {
    return {
      searchParam: { searchDate: '', },
    };
  },
  mounted() {
  },
  methods: {
    onQueryRecord() {
      this.searchParam.startTime = this.searchParam.searchDate?.[0];
      this.searchParam.endTime = this.searchParam.searchDate?.[1];
      this.$refs.ticketSource.fetchSourceData(this.searchParam);
      this.$refs.faultClass.fetchFaultTypeData(this.searchParam);
      this.$refs.workOrderNum.changeQueryCondition(this.searchParam);
      this.$refs.commonMalfunctions.getTableData(this.searchParam);
    },
    onResetRecord() {
      this.searchParam = {};
      this.onQueryRecord();
    },
  },
};
</script>

<style lang='scss'
  scoped
>
::v-deep .el-form-item {
  margin-bottom: 0 !important;
}

.row {
  margin-bottom: 16px;
}

.main {
  padding-top: 16px;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

.label {
  font-size: 18px;
  font-weight: bold;
  color: #282827 !important;
}

.form-box {
  padding: 16px;
  background-color: #fff;
  border-radius: 4px;
}
</style>

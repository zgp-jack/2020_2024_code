<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2023-01-10 09:43:35
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-01-10 10:04:01
 * @Description:服务响应分析
-->
<template>
  <el-card style="height:598px">

    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
    >
      <template slot="header">
        <el-row
          type="flex"
          align="middle"
          class="query base-margin-left base-margin-top base-margin-right"
        >
          <el-col :span="12">

            <span class="label">服务响应分析</span>
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按人员" @change="handleTabChange" />
          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column :label="nameLabel" prop="myName" />

      <el-table-column label="完成工单" prop="endedOrder">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.endedOrder }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="平均响应时间(分)" prop="averageResponseTime" />
      <el-table-column label="响应超时" prop="overtimeTotal">
        <template slot-scope="{row}">
          <el-tag size="mini" type="danger">{{ row.overtimeTotal }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="同工单两次以上催响" prop="twiceOvertimeTotal">
        <template slot-scope="{row}">
          <el-tag size="mini" type="warning">{{ row.twiceOvertimeTotal }}</el-tag>
        </template>
      </el-table-column>
    </pure-table>
  </el-card>
</template>

<script>
import TicketApi from '../api';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import PureTable from '@/feat/component/pureTable';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  components: {
    PureButtonGroup,
    PureTable,
  },
  data() {
    return {
      tableData: [],
      list: [],
      listApi: TicketApi.serviceResponse,
      groupBtnOptions: [{
        count: null,
        name: '按人员',
      }, {
        count: null,
        name: '按小组',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1按人员2按小组3按供应商
      nameLabel: '科室',
      queryCondition: {
        startTime: Moment().startOf('month').format('YYYY-MM-DD'),
        endTime: Moment().endOf('month').format('YYYY-MM-DD'),
        template: 1,
      },
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        const params = {
          ...this.queryCondition,
          pageSize: this.$refs.pureTable.pageSize,
          pageNum: this.$refs.pureTable.currentPage,
        };
        this.downButtonDisable = true;
        const res = await TicketApi.serviceResponseExportExcel(params);
        const fileName = `服务响应统计分析-[${this.nameLabel}]}.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.queryCondition.startTime = this.startTime;
      this.queryCondition.endTime = this.endTime;
    },

    handleTabChange(val) {
      switch (val) {
        case '按人员':
          this.template = '1';
          this.nameLabel = '姓名';
          break;
        case '按小组':
          this.template = '2';
          this.nameLabel = '小组';
          break;
        case '按供应商':
          this.template = '3';
          this.nameLabel = '供应商';
          break;
      }
      this.queryCondition.template = this.template;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card__body {
  height: 100%;
  padding: 0;
}
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
</style>

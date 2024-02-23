<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-02 15:49:50
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 20:49:10
 * @Description:需求统计
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
            <span class="label">需求统计</span>

          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column label="姓名" prop="name">
        <template slot-scope="{row}">
          {{ row.sponsor }}
        </template>
      </el-table-column>
      <el-table-column label="需求总数" prop="itemCount">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.demandTotal }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="需求立项" prop="itemEstablish">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.itemEstablish }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="S级" prop="technicalAnalysis">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.levelS }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="M级" prop="technicalAnalysis">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.levelM }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="L级" prop="technicalAnalysis">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.levelL }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需求未通过" prop="endInvReject">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.endInvReject }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需求转工单" prop="endProjectOrder">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.endProjectOrder }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已结束" prop="endProject">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.endProject }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="需求总占比" prop="demandRatio">
        <template slot-scope="{row}">
          {{ row.demandRatio | toPr }}
        </template>
      </el-table-column>
    </pure-table>

  </el-card>
</template>

<script>
import ProjectApi from '../api';
import PureTable from '@/feat/component/pureTable';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  filters: {
    toPr(val) {
      if (val) {
        return parseFloat(val * 100).toPrecision(3) + '%';
      }
      return '-';
    },
  },
  components: {
    // PureButtonGroup,
    PureTable,
  },
  data() {
    return {
      tableData: [],
      list: [],
      listApi: ProjectApi.requirementList,
      groupBtnOptions: [{
        count: null,
        name: '按小组',
      }, {
        count: null,
        name: '按工程师',
      }, {
        count: null,
        name: '按科室',
      }, {
        count: null,
        name: '按涉及系统',
      }],
      queryCondition: {
        startTime: Moment().startOf('month').format('YYYY-MM-DD'),
        endTime: Moment().endOf('month').format('YYYY-MM-DD'),
        template: 1,
      },
      startTime: null,
      endTime: null,
      template: 1, // 1小组2按工程师3按科室4按涉及系统
      nameLabel: '小组',
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await ProjectApi.requirementListExportExcel(this.queryCondition);
        const fileName = `需求统计分析.xlsx`;
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
        case '按小组':
          this.template = '1';
          this.nameLabel = '小组';
          break;
        case '按工程师':
          this.template = '2';
          this.nameLabel = '姓名';
          break;
        case '按科室':
          this.template = '3';
          this.nameLabel = '科室';
          break;
        case '按涉及系统':
          this.template = '4';
          this.nameLabel = '涉及系统';
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

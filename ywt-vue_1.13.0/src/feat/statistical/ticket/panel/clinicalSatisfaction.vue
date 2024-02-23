<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-07 00:53:19
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 01:39:24
 * @Description:临床满意度分析
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

            <span class="label">临床满意度分析</span>
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按科室" @change="handleTabChange" />
          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column :label="nameLabel" prop="name" />
      <el-table-column label="评价总数" prop="countNum" />
      <el-table-column label="非常满意">
        <el-table-column label="数量" prop="verySatisfiedNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.verySatisfiedNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="verySatisfiedRatio" />
      </el-table-column>
      <el-table-column label="满意">
        <el-table-column label="数量" prop="satisfiedNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.satisfiedNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="satisfiedRatio" />
      </el-table-column>
      <el-table-column label="一般">
        <el-table-column label="数量" prop="averageNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.averageNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="averageRatio" />
      </el-table-column>
      <el-table-column label="不满意">
        <el-table-column label="数量" prop="dissatisfiedNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="warning">{{ row.dissatisfiedNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="dissatisfiedRatio" />
      </el-table-column>
      <el-table-column label="非常不满意">
        <el-table-column label="数量" prop="veryDissatisfiedNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="danger">{{ row.veryDissatisfiedNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="veryDissatisfiedRatio" />
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
      listApi: TicketApi.clinicalSatisfaction,
      groupBtnOptions: [{
        count: null,
        name: '按科室',
      }, {
        count: null,
        name: '按故障',
      }, {
        count: null,
        name: '按人员',
      }, {
        count: null,
        name: '按供应商',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1按人员2按小组3按供应商
      nameLabel: '科室',
      queryCondition: {
        startDate: Moment().startOf('month').format('YYYY-MM-DD'),
        endDate: Moment().endOf('month').format('YYYY-MM-DD'),
        queryType: 1,
      },
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await TicketApi.clinicalSatisfactionExportExcel(this.queryCondition);
        const fileName = `临床满意度统计分析-[${this.nameLabel}].xlsx`;
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
      this.queryCondition.startDate = this.startTime;
      this.queryCondition.endDate = this.endTime;
    },

    handleTabChange(val) {
      switch (val) {
        case '按科室':
          this.template = '1';
          this.nameLabel = '科室';
          break;
        case '按故障':
          this.template = '2';
          this.nameLabel = '故障类型';
          break;
        case '按人员':
          this.template = '3';
          this.nameLabel = '姓名';
          break;
        case '按供应商':
          this.template = '4';
          this.nameLabel = '供应商';
          break;
      }
      this.queryCondition.queryType = this.template;
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

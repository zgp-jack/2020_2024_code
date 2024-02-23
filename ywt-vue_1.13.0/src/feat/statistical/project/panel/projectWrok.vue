<!-- 项目工作统计 -->

<template>
  <el-card style="height:598px">
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
      :cell-style="tableCellStyle"
      :span-method="arraySpanMethod"
    >
      <template slot="header">
        <el-row
          type="flex"
          align="middle"
          class="query base-margin-left base-margin-top base-margin-right"
        >
          <el-col :span="20">
            <span class="label">项目工作统计</span>
            <el-date-picker
              v-model="queryCondition.date"
              :clearable="false"
              type="week"
              format="yyyy 第 WW 周"
              placeholder="选择周"
              value-format="yyyy-MM-dd"
              :picker-options="{
                firstDayOfWeek:1
              }"
            />
          </el-col>

          <el-col :span="4" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />
          </el-col>

        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column
        label="姓名"
        prop="principalName"
        width="auto"
        align="left"
        fixed="left"
        min-width="139px"
      >
        <template #default="{row}">
          {{ row.principalName || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        label="项目"
        prop="title"
        width="auto"
        align="left"
        fixed="left"
        min-width="220px"
        show-overflow-tooltip
      >
        <template #default="{row}">
          <DemandOrProjectName :data="row" />
        </template>
      </el-table-column>
      <el-table-column label="效率指标" align="left">
        <el-table-column
          label="本周任务完成率"
          prop="thisWeekFinishRate"
          width="auto"
          align="left"
          min-width="160px"
        >
          <template #default="{row}">
            {{ row.thisWeekFinishRate | ratePr }}
          </template>
        </el-table-column>
        <el-table-column
          label="总体任务完成率"
          prop="finishRate"
          width="auto"
          align="left"
          min-width="160px"
        >
          <template #default="{row}">
            {{ row.finishRate | ratePr }}
          </template>
        </el-table-column>
        <el-table-column
          label="总体超期任务率"
          prop="overdueFinishRate"
          width="auto"
          align="left"
          min-width="160px"
        >
          <template #default="{row}">
            {{ row.overdueFinishRate | ratePr }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="工作量指标" align="left">
        <el-table-column
          label="总任务数"
          prop="totalWork"
          width="180px"
          align="left"
          min-width="180px"
        />
        <el-table-column
          label="已完成任务总数"
          prop="finishWork"
          width="180px"
          align="left"
          min-width="180px"
        />
        <el-table-column
          label="已超期任务总数"
          prop="overdue"
          width="180px"
          align="left"
          min-width="180px"
        />
        <el-table-column
          label="计划下周内完成任务总数"
          prop="planNextWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="下周以后完成任务总数"
          prop="afterNextWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="未给出时间任务"
          prop="noTime"
          width="180px"
          align="left"
          min-width="180px"
        />
      </el-table-column>

      <el-table-column label="数据统计" align="left">
        <el-table-column
          label="截止上周遗留任务总数"
          prop="legacyLastWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="本周完成遗留任务"
          prop="finishLegacy"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="本周未完成的遗留任务"
          prop="notFinishLegacy"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="本周计划完成任务总数"
          prop="planThisWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="本周已完成计划任务"
          prop="finishPlanThisWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
        <el-table-column
          label="本周未完成的计划任务"
          prop="notFinishPlanThisWeek"
          width="220px"
          align="left"
          min-width="220px"
        />
      </el-table-column>
    </pure-table>

  </el-card>
</template>

<script>
import ProjectApi from '../api';
import PureTable from '@/feat/component/pureTable';
import DemandOrProjectName from '@/views/project/components/tableCell/demandOrProjectName.vue';

import moment from 'moment';
import downLoadFile from '@/utils/downLoad';

const cellBackgroundColorConfig = {
  'thisWeekFinishRate': '#F3FAEF',
  'totalWork': '#F1F4FD',
  'overdue': '#FEF3F3',
  'legacyLastWeek': '#F1F4FD',
  'finishPlanThisWeek': '#F1F4FD',
};

export default {
  filters: {
    ratePr(val) {
      if (val) {
        return val.toFixed(2) + '%';
      }
      return '-';
    },
  },
  components: {
    // PureButtonGroup,
    PureTable,
    DemandOrProjectName,
  },
  data() {
    return {
      listApi: ProjectApi.projectWorkList,
      queryCondition: {
        date: '',
      },
      rowspan: [],
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
      downButtonDisable: false,
    };
  },
  created() {
    const period = moment().endOf('weeks').subtract(1, 'weeks').add('days', 1).toDate();
    this.queryCondition.date = moment(period).format('YYYY-MM-DD');
  },
  methods: {
    getSpanArr(list) {
      const newArr = [];
      const obj = {};

      for (let i = 0; i < list.length; i++) {
        if (i === 0) {
          obj.row = 1;
          obj.col = 1;
          newArr.push(obj);
        } else {
          if (list[i].principal === list[i - 1].principal) {
            newArr.push({ row: 0, col: 0, });
            const index = list.findIndex(item => {
              return item.principal === list[i - 1].principal;
            });
            newArr[index].row++;
          } else {
            newArr.push({ row: 1, col: 1, });
          }
        }
      }
      return newArr;
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex, }) {
      const tableData = this.$refs.pureTable.data;
      const arr = this.getSpanArr(tableData);
      if (columnIndex === 1) {
        const row = arr[rowIndex].row;
        const col = arr[rowIndex].col;
        return {
          rowspan: row,
          colspan: col,
        };
      }
    },
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await ProjectApi.projectWorkListExportExcel(this.queryCondition.date);
        const fileName = `项目工作统计分析.xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    tableCellStyle({ row, column, rowIndex, columnIndex, }) {
      return {
        backgroundColor: cellBackgroundColorConfig[column.property],
      };
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

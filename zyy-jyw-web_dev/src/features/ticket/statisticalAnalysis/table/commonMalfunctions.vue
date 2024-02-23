/**
* @file commonMalfunctions.vue
* @author huang
* @date 2023/8/31
* @description 常见故障
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <chart-panel title="常见故障">

    <el-row :gutter="16">
      <el-col :span="10">
        <div class="table-area">
          <el-table
            :data="leftTableData"
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column
              label="故障分类"
              prop="dictLabel"
            />
            <el-table-column
              label="总数"
              prop="num"
            />
          </el-table>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="table-area">
          <el-table :data="rightTableData">
            <el-table-column
              label="报修科室"
              prop="deptName"
            />
            <el-table-column
              label="数量"
              prop="num"
            />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </chart-panel>
</template>

<script>
import ChartPanel from '../panel/index.vue';
import StatisticalAnalysisApi from '../api';
// import { downloadFile, } from '@/common/utils/download';

export default {
  components: {
    ChartPanel,
  },
  data() {
    return {
      tableData: [],
      leftTableDataRow: null,
      queryParams: {
        deptId: '',
        startTime: '',
        endTime: '',
      },
    };
  },
  computed: {
    leftTableData() {
      return this.tableData;
    },
    rightTableData() {
      // 默认获取第一个值
      if (this.leftTableDataRow) {
        return this.leftTableDataRow?.child || [];
      }
      const defaultData = this.leftTableData[0];
      return defaultData?.child || [];
    },
  },

  mounted() {
    this.getTableData();
  },
  methods: {
    handleRowClick(row, column, event) {
      this.leftTableDataRow = row;
    },
    async getTableData(query) {
      this.queryParams = query;
      console.log('xxxxxxxxxxxxxxxxxx');
      const { rows, } = await StatisticalAnalysisApi.getCommonFaultType(this.queryParams);
      this.tableData = rows;
    },
    // 导出
    // async exportData() {
    //   const res = await StatisticalAnalysisApi.exportCommonMalfunctions();
    //   downloadFile(res);
    // },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.table-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;

  ::v-deep .el-table {

    thead {
      @include font_color_imp('color-assist-gray');

      font-size: 16px;

      th.el-table__cell {
        @include background_color_imp('color-assist-4');
      }
    }

  }
}
</style>

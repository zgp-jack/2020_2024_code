<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-26 10:55:14
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-15 09:43:01
 * @Description:常见故障
-->
<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <span class="label">常见故障</span>
      </el-col>
      <el-col :span="12" class="right">
        <i class="el-icon-download" @click="onExport" />

      </el-col>
    </el-row>
    <el-row style="margin-top:12px">
      <el-col :span="24">
        <el-table
          border
          :data="tableData"
          :span-method="objectSpanMethod"
          max-height="500px"
        >
          <el-table-column label="序号" prop="id" type="index" width="80" align="left" />
          <el-table-column label="故障描述" prop="faultName" align="left" />
          <el-table-column label="数量" prop="count" align="left" />
          <el-table-column label="报修科室" prop="deptName" align="left" />
          <el-table-column label="数量" prop="deptCount" align="left" />

        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import StatisticsApi from '@/apis/reportFault/statistics';
import downLoadFile from '@/utils/downLoad';
export default {
  data() {
    return {
      tableData: [],
      deptId: null,
      startTime: null,
      endTime: null,

    };
  },
  methods: {
    // 查询条件变更后操作
    async  changeQueryCondition(condition = {}) {
      this.deptId = condition.deptId;
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.fetchData();
    },
    // 转换后台获取的数据
    flatData(serverData) {
      const data = [];
      serverData.map(item => {
        item.children.map(innerItem => {
          data.push({ faultName: item.faultName, count: item.value, deptName: innerItem.deptName, deptCount: innerItem.value, });
        });
      });
      return data;
    },
    async fetchData() {
      try {
        const data = await StatisticsApi.normalFault({ deptId: this.deptId, startTime: this.startTime, endTime: this.endTime, });
        this.tableData = this.flatData(data);
        this.tableData = this.mergeTableRow(this.tableData, ['faultName']);
      } catch (error) {
        console.log(error);
      }
    },
    mergeTableRow(data, merge) {
      if (!merge || merge.length === 0) {
        return data;
      }
      merge.forEach((m) => {
        const mList = {};
        data = data.map((v, index) => {
          const rowVal = v[m];
          if (mList[rowVal] && mList[rowVal].newIndex === index) {
            mList[rowVal]['num']++;
            mList[rowVal]['newIndex']++;
            data[mList[rowVal]['index']][m + '-span'].rowspan++;
            v[m + '-span'] = {
              rowspan: 0,
              colspan: 0,
            };
          } else {
            mList[rowVal] = { num: 1, index: index, newIndex: index + 1, };
            v[m + '-span'] = {
              rowspan: 1,
              colspan: 1,
            };
          }
          v['count-span'] = v[m + '-span'];
          return v;
        });
      });
      return data;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex, }) {
      const span = column['property'] + '-span';
      if (row[span]) {
        return row[span];
      }
    },
    async  onExport() {
      const res = await StatisticsApi.exportNormalFault({
        deptId: this.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      downLoadFile(res.url, '常见故障.xlsx');
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  font-size: 18px;
  font-weight: 600;
  color: #2d405e;
  margin-right: 28px;
}
.el-table--border ::v-deep th,
.el-table--border ::v-deep td {
  border-right: 1px solid #ecf0f7;
  border-bottom: 1px solid #ecf0f7;
}
.right {
  text-align: right;
}
.el-icon-download {
  color: #409EFF;
  cursor: pointer;
  margin-left: 12px;
}
</style>

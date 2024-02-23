<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-26 10:58:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-07-14 17:41:15
 * @Description:服务台
-->
<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <span class="label">服务台</span>
      </el-col>
      <el-col :span="12" class="right">
        <i class="el-icon-download" @click="onExport" />

      </el-col>
    </el-row>
    <el-row style="margin-top:12px">
      <el-col :span="24">
        <el-table
          ref="table"
          border
          :data="tableData"
          max-height="500px"
        >
          <el-table-column label="序号" align="left" type="index" width="80" />
          <el-table-column label="姓名" align="left" prop="name" />
          <el-table-column label="电话总数" align="left" prop="phoneNum" />
          <el-table-column label="接听率" align="left">
            <el-table-column label="数量" align="left" prop="answerNum" />
            <el-table-column label="占比" align="left" prop="answerProp" />
          </el-table-column>
          <el-table-column label="已接未建单率" align="left">
            <el-table-column label="数量" align="left" prop="noCreateNum" />
            <el-table-column label="占比" align="left" prop="noCreateProp" />
          </el-table-column>
          <el-table-column label="电话解决率" align="left">
            <el-table-column label="数量" align="left" prop="makeNum" />
            <el-table-column label="占比" align="left" prop="makeProp" />
          </el-table-column>
          <el-table-column label="建单率" align="left">
            <el-table-column label="数量" align="left" prop="createNum" />
            <el-table-column label="占比" align="left" prop="createProp" />
          </el-table-column>
          <el-table-column label="派单率" align="left">
            <el-table-column label="数量" align="left" prop="transferNum" />
            <el-table-column label="占比" align="left" prop="transferProp" />
          </el-table-column>
          <el-table-column label="无效电话率" align="left">
            <el-table-column label="数量" align="left" prop="invalidNum" />
            <el-table-column label="占比" align="left" prop="invalidProp" />
          </el-table-column>
          <el-table-column label="电话找人率" align="left">
            <el-table-column label="数量" align="left" prop="lookNum" />
            <el-table-column label="占比" align="left" prop="lookProp" />
          </el-table-column>
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
    async fetchData() {
      try {
        this.tableData = await StatisticsApi.center({ deptId: this.deptId, startTime: this.startTime, endTime: this.endTime, });
      } catch (error) {
        console.log(error);
      }
    },
    async onExport() {
      const res = await StatisticsApi.exportCenter({
        deptId: this.deptId,
        startTime: this.startTime,
        endTime: this.endTime,
      });
      downLoadFile(res.url, '服务台.xlsx');
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


<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-07 01:05:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 01:37:34
 * @Description: 知识库引用统计
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
          <el-col :span="20">
            <span class="label">知识库引用统计</span>
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />
          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column label="知识名称" prop="title" />
      <el-table-column label="引用次数" prop="quoteCount" />
      <el-table-column label="创建人" prop="createUserToName" />

    </pure-table>
  </el-card>
</template>

<script>
import TicketApi from '../api';
import PureTable from '@/feat/component/pureTable';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  components: {
    PureTable,
  },
  data() {
    return {
      listApi: TicketApi.knowledgeBaseRef,

      startTime: null,
      endTime: null,
      nameLabel: '姓名',
      queryCondition: {
        startDate: Moment().startOf('month').format('YYYY-MM-DD'),
        endDate: Moment().endOf('month').format('YYYY-MM-DD'),
      },
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await TicketApi.knowledgeBaseRefExportExcel(this.queryCondition);
        const fileName = `知识库引用统计分析.xlsx`;
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

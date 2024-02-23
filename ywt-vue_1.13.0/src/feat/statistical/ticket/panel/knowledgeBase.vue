<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-07 01:05:57
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-07 01:23:37
 * @Description: 知识库统计
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

            <span class="label">知识库统计</span>
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按故障" @change="handleTabChange" />
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column :label="nameLabel" prop="name" />
      <el-table-column label="知识数量" prop="countNum">
        <template slot-scope="{row}">
          <el-tag size="mini" type="info">{{ row.countNum }}</el-tag>
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
      listApi: TicketApi.knowledgeBase,
      groupBtnOptions: [{
        count: null,
        name: '按故障',
      }, {
        count: null,
        name: '按人员',
      }],
      startTime: null,
      endTime: null,
      template: 1, // 1按人员2按小组3按供应商
      nameLabel: '姓名',
      queryCondition: {
        startDate: Moment().startOf('month').format('YYYY-MM-DD'),
        endDate: Moment().endOf('month').format('YYYY-MM-DD'),
        queryType: '1',
      },
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await TicketApi.knowledgeBaseExportExcel(this.queryCondition);
        const fileName = `知识库统计分析.xlsx`;
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
        case '按故障':
          this.template = '1';
          this.nameLabel = '故障类型';
          break;
        case '按人员':
          this.template = '2';
          this.nameLabel = '姓名';
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

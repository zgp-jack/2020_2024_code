<!--
  项目统计分析
-->

<template>
  <pure-table
    :list-api="listApi"
    :query-condition="queryCondition"
  >
    <template #header>
      <el-row
        type="flex"
        align="middle"
        class="query base-margin-left base-margin-top base-margin-right"
      >
        <el-col :span="2">
          <span class="label">项目统计</span>
        </el-col>
        <el-col :span="12">
          <pure-button-group :options="groupBtnOptions" default-active="按项目类型" @change="handleTabChange" />
        </el-col>
      </el-row>
    </template>
    <template #indexColumn>
      序号
    </template>
    <el-table-column
      :label="labelName"
      prop="name"
      width="auto"
      align="left"
      fixed="left"
      min-width="139px"
    >
      <template #default="{row}">
        {{ row.name || '-' }}
      </template>
    </el-table-column>
    <el-table-column
      label="项目总数"
      prop="itemCount"
      width="auto"
      align="left"
      fixed="left"
      min-width="220px"
      show-overflow-tooltip
    />
    <el-table-column label="已完成" align="left">
      <el-table-column
        label="未超时"
        prop="complete"
        width="auto"
        align="left"
        min-width="160px"
      >
        <template #default="{row}">
          <el-tag size="mini">{{ row.complete }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="超时"
        prop="overtime"
        width="auto"
        align="left"
        min-width="160px"
      >
        <template #default="{row}">
          <el-tag size="mini">{{ row.overtime }}</el-tag>
        </template>
      </el-table-column>

    </el-table-column>
    <el-table-column label="未完成" align="left">
      <el-table-column
        label="未超时"
        prop="incomplete"
        width="180px"
        align="left"
        min-width="180px"
      >
        <template #default="{row}">
          <el-tag size="mini">{{ row.incomplete }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="超时"
        prop="timeout"
        width="180px"
        align="left"
        min-width="180px"
      >
        <template #default="{row}">
          <el-tag size="mini">{{ row.timeout }}</el-tag>
        </template>
      </el-table-column>

    </el-table-column>

  </pure-table>
</template>

<script>
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';

import tableStyle from '../style/table';
// import PaginationTable from '@/minxins/common/paginationTable';
import ProjectAPI from '@/apis/project';
import moment from 'moment';
import PureTable from '@/feat/component/pureTable';

export default {
  name: 'ProjectsStatics',
  components: {
    PureTable,
    PureButtonGroup,
  },
  filters: {
    demandRatio(val) {
      let ratio = 0;
      if (val) {
        ratio = val * 100;
      }
      return ratio.toFixed(2) + '%';
    },
  },
  data() {
    return {
      tableStyle,
      data: [],
      queryCondition: {
        template: 1,
      },
      labelName: '项目类型',
      groupBtnOptions: [{
        count: null,
        name: '按项目类型',
      }, {
        count: null,
        name: '按项目负责人',
      }, {
        count: null,
        name: '按项目级别',
      }, {
        count: null,
        name: '按供应商',
      }, {
        count: null,
        name: '按小组',
      }],
      listApi: ProjectAPI.search.projectStatistics,
      template: 1,
      loading: false,
      formFilterData: {
        date: '',
        principal: null,
        keyword: '',
      },
    };
  },
  mounted() {
    // this.initData();
  },
  methods: {
    handleTabChange(val) {
      switch (val) {
        case '按项目类型':
          this.template = 1;
          this.labelName = '项目类型';
          break;
        case '按项目负责人':
          this.template = 2;
          this.labelName = '项目负责人';

          break;
        case '按项目级别':
          this.template = 3;
          this.labelName = '项目级别';

          break;
        case '按小组':
          this.template = 5;
          this.labelName = '小组';
          break;
        default :
        // 按供应商
          this.template = 4;
          this.labelName = '供应商';
          break;
      }
      this.queryCondition.template = this.template;
    },
    initData() {
      this.formFilterData.date = moment().endOf('weeks').subtract(1, 'weeks').add('days', 1).toDate();
      this.queryCondition.pageSize = 10;
      this.queryCondition.pageNum = 1;
      this.queryCondition.template = 1;
      this.queryCondition.date = moment(this.formFilterData.date).format('YYYY-MM-DD');
      this.fetchData();
    },
    onSearch() {
      this.queryCondition.pageSize = 10;
      this.queryCondition.pageNum = 1;
      this.queryCondition.template = this.template;
      this.queryCondition.date = moment(this.formFilterData.date).format('YYYY-MM-DD');
      this.queryCondition.keyword = this.formFilterData.keyword;

      this.fetchData();
    },
    onClear() {
      this.$set(this.formFilterData, 'date', '');
      this.$set(this.formFilterData, 'keyword', '');
      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.formStyle {
  margin: 16px 16px 0 16px;
}
.span {
  &-button {
    margin-left: 24px;
    opacity: 0.4;
    font-weight: 400;
    font-size: 18px;
    color: #334266;
    cursor: pointer;
  }
}
</style>

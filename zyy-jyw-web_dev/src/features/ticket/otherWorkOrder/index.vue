/**
* @file index.vue
* @author huang
* @date 2023/9/1
* @description Add a brief description of the file here.
* @projectName
* @email newflyhuang@gmail.com
*/
<template>
  <TableLayout>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
      style="padding: 0px 10px"
    >
      <template #header>
        <query-panel
          @query="handleQuery"
          @reset="handleReset"
        >
          <el-form-item>
            <el-input
              v-model="queryParams.keywords"
              style="width: 260px"
              placeholder="故障描述/电话/建单人/处理人/科室"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryParams.time"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </query-panel>

      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column prop="faultRemark" label="故障描述" />
      <el-table-column prop="createTime" label="报修时间" />
      <el-table-column prop="phone" label="报修电话" />
      <el-table-column prop="deptName" label="报修科室" />
      <el-table-column prop="createUser" label="建单人" />
      <el-table-column prop="sendUser" label="处理人" />
      <el-table-column prop="state" label="状态" :formatter="formatState" />

    </pure-table>
  </TableLayout>
</template>

<script>

import QueryPanel from '@/common/components/query/queryPanel.vue';
import OtherWorkOrderApi from './api';
import PureTable from '@/common/components/table/index.vue';
import {
  OTHER_ORDER_STATE_MAP,
} from '../ticket.config';

export default {
  components: { PureTable, QueryPanel, },
  data() {
    return {
      queryParams: {
        faultRemark: '',
        startTime: '',
        endTime: '',
        time: [],
      },
      listApi: OtherWorkOrderApi.getOtherWorkOrderList,
      queryCondition: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.pureTable.fetchData(1);
    });
  },
  methods: {
    // 查询
    handleQuery() {
      this.queryParams.startTime = this.queryParams.time[0];
      this.queryParams.endTime = this.queryParams.time[1];
      this.queryCondition = {
        ...this.queryParams,
      };
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    // 重置
    handleReset() {
      this.queryParams = {
        faultRemark: '',
        startTime: '',
        endTime: '',
        time: [],
      };
      this.queryCondition = {};
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    formatState(row) {
      return (<PureTypeText type={row.state}
        config={OTHER_ORDER_STATE_MAP}
      />);
    },
  },

};
</script>

<style lang='scss'
  scoped
>

</style>

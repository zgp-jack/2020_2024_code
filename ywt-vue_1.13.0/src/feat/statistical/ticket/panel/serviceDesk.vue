<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-02 23:32:02
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-22 15:16:53
 * @Description:工单-服务台
-->
<template>
  <el-card style="height:598px">
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
      :hide-index="true"
    >
      <template slot="header">
        <el-row
          type="flex"
          align="middle"
          class="query base-margin-left base-margin-top base-margin-right"
        >
          <el-col :span="12">

            <span class="label">服务台</span>
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按人员" @change="handleTabChange" />
          </el-col>
          <el-col :span="12" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <el-table-column :label="nameLabel" prop="name" />
      <el-table-column label="值班天数" prop="day" width="100" />
      <el-table-column v-if="nameLabel==='姓名'" label="在线时间||（小时）" prop="onlineTime" :render-header="renderHeader" width="100" />
      <!-- <el-table-column v-if="nameLabel==='姓名'" label="迟到早退||（次）" prop="workLateAndEarlyNum" :render-header="renderHeader" width="100">
        <template slot-scope="{row}">
          <el-tag size="mini" type="danger">{{ row.workLateAndEarlyNum }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="电话总数" prop="phoneNum" width="100" />

      <el-table-column label="接听率">
        <el-table-column label="数量" prop="answerNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.answerNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="answerProp" />
      </el-table-column>
      <el-table-column label="已接未建单率">
        <el-table-column label="数量" prop="noCreateNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.noCreateNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="noCreateProp" />
      </el-table-column>
      <el-table-column label="电话解决率">
        <el-table-column label="数量" prop="makeNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.makeNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="makeProp" />
      </el-table-column>
      <el-table-column label="建单率">
        <el-table-column label="数量" prop="createNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.createNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="createProp" />
      </el-table-column>
      <el-table-column label="无效电话率">
        <el-table-column label="数量" prop="invalidNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.invalidNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="invalidProp" />
      </el-table-column>
      <el-table-column label="电话找人率">
        <el-table-column label="数量" prop="lookNum">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.lookNum }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="占比" prop="lookProp" />
      </el-table-column>
    </pure-table>
  </el-card>
</template>

<script>
import TicketApi from '../api';
import PureTable from '@/feat/component/pureTable';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  components: {
    PureTable,
    PureButtonGroup,
  },
  props: {
    dateTime: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tableData: [],
      listApi: TicketApi.serviceDeskList,
      queryCondition: {
        startDate: Moment().startOf('month').format('YYYY-MM-DD'),
        endDate: Moment().endOf('month').format('YYYY-MM-DD'),
        type: 1,
      },
      nameLabel: '姓名',
      groupBtnOptions: [{
        count: null,
        name: '按人员',

      }, {
        count: null,
        name: '按院区',
      }],
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const params = {
          startDate: this.dateTime?.[0] || '',
          endDate: this.dateTime?.[1] || '',
          type: this.queryCondition.type,
        };

        const res = await TicketApi.serviceExportExcel(params);
        const fileName = `工单服务台统计分析-${params.startDate}__${params.endDate}.xlsx`;
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
        case '按人员':
          this.nameLabel = '姓名';
          this.queryCondition.type = 1;
          break;
        case '按院区':
          this.nameLabel = '院区';
          this.queryCondition.type = 2;
          break;
      }
    },
    renderHeader(h, { column, }) {
      return h('div', { }, [
        h('span', {}, column.label.split('||')[0]),
        h('br'),
        h('span', {}, column.label.split('||')[1])
      ]);
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

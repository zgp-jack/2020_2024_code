<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-09-06 23:13:40
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-20 17:18:38
 * @Description:报修量分析
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

            <span class="label">报修量分析</span>
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="按科室" @change="handleTabChange" />
            <pure-button-group style="display:inline" :options="groupBtnOptions2" default-active="按月" @change="handleTabChange2" />
            <el-date-picker
              v-if="queryCondition.timeType==='1'"
              v-model="month"
              size="mini"
              type="month"
              placeholder="选择月"
              :clearable="false"
              value-format="yyyy-MM"
              @change="onChangeMonth"
            />
            <el-date-picker
              v-if="queryCondition.timeType==='3'"
              v-model="year"
              size="mini"
              type="year"
              value-format="yyyy-MM"
              :clearable="false"
              placeholder="选择年"
              @change="onChangeYear"
            />
            <quarter v-if="queryCondition.timeType==='2'" :default-val="quarter" @getQuarterly="getQuarterly" />
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button size="mini" icon="el-icon-download" :disabled="downButtonDisable" @click="onDownExcel" />

          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column :label="nameLabel" prop="name" show-overflow-tooltip="" />
      <el-table-column label="报修">
        <el-table-column label="数量" prop="orderAmount">
          <template slot-scope="{row}">
            <el-tag size="mini" type="info">{{ row.orderAmount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="同比" prop="withRatioRepair">
          <template slot-scope="{row}">

            <span :class="row.withRatioRepair.includes('-')?'down':'up'">
              <i v-if="row.withRatioRepair.includes('-')" class="el-icon-bottom" />
              <i v-if="!row.withRatioRepair.includes('-')" class="el-icon-top" />
              {{ row.withRatioRepair.replace('-','') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="环比" prop="ringRatioRepair">
          <template slot-scope="{row}">
            <span :class="row.ringRatioRepair.includes('-')?'down':'up'">
              <i v-if="row.ringRatioRepair.includes('-')" class="el-icon-bottom" />
              <i v-if="!row.ringRatioRepair.includes('-')" class="el-icon-top" />
              {{ row.ringRatioRepair.replace('-','') }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="好评">
        <el-table-column label="占比" prop="proportionPraise" />
        <el-table-column label="同比" prop="withRatioPraise">
          <template slot-scope="{row}">

            <span :class="row.withRatioPraise.includes('-')?'down':'up'">
              <i v-if="row.withRatioPraise.includes('-')" class="el-icon-bottom" />
              <i v-if="!row.withRatioPraise.includes('-')" class="el-icon-top" />
              {{ row.withRatioPraise.replace('-','') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="环比" prop="ringRatioPraise">
          <template slot-scope="{row}">
            <span :class="row.ringRatioPraise.includes('-')?'down':'up'">
              <i v-if="row.ringRatioPraise.includes('-')" class="el-icon-bottom" />
              <i v-if="!row.ringRatioPraise.includes('-')" class="el-icon-top" />
              {{ row.ringRatioPraise.replace('-','') }}
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </pure-table>

  </el-card>
</template>

<script>
import TicketApi from '../api';
import Quarter from '../components/quarter.vue';
import PureButtonGroup from '@/feat/statistical/components/groupButton.vue';
import PureTable from '@/feat/component/pureTable';
import Moment from 'moment';
import downLoadFile from '@/utils/downLoad';
export default {
  components: {
    PureButtonGroup,
    PureTable,
    Quarter,
  },
  data() {
    return {
      tableData: [],
      list: [],
      listApi: TicketApi.ticketCountList,
      month: Moment().startOf('month').format('YYYY-MM'),
      year: Moment().startOf('month').format('YYYY-MM'),
      quarter: Moment().startOf('month').format('YYYY-MM'),
      groupBtnOptions: [{
        count: null,
        name: '按科室',
      }, {
        count: null,
        name: '按故障',
      }
      //  {
      //   count: null,
      //   name: '按系统',
      // }
      ],
      groupBtnOptions2: [{
        count: null,
        name: '按月',
      }, {
        count: null,
        name: '按季度',
      }, {
        count: null,
        name: '按年',
      }],
      queryCondition: {
        queryDate: Moment().startOf('month').format('YYYY-MM'),
        queryType: '1',
        timeType: '1',
      },

      nameLabel: '科室',
      downButtonDisable: false,
    };
  },

  methods: {
    async onDownExcel() {
      try {
        this.downButtonDisable = true;
        const res = await TicketApi.ticketExportExcel(this.queryCondition);
        const fileName = `工单报修量统计分析-[${this.nameLabel}].xlsx`;
        downLoadFile(res, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    getQuarterly(val) {
      this.queryCondition.queryDate = val;
    },
    onChangeMonth(val) {
      this.queryCondition.queryDate = val;
    },
    onChangeYear(val) {
      this.queryCondition.queryDate = val;
    },
    handleTabChange(val) {
      let type = '1';
      switch (val) {
        case '按科室':
          type = '1';
          this.nameLabel = '科室';
          break;
        case '按故障':
          type = '2';
          this.nameLabel = '故障类型';
          break;
        case '按系统':
          type = '3';
          this.nameLabel = '系统类型';
          break;
      }
      this.queryCondition.queryType = type;
    },
    handleTabChange2(val) {
      let type = '1';
      switch (val) {
        case '按月':
          type = '1';
          this.queryCondition.queryDate = this.month;
          break;
        case '按季度':
          type = '2';
          this.queryCondition.queryDate = this.quarter;
          break;
        case '按年':
          type = '3';
          this.queryCondition.queryDate = this.year;
          break;
      }
      this.queryCondition.timeType = type;
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
.down {
color: #F26161;
}
.up {
  color: #5FBF30;
}
</style>

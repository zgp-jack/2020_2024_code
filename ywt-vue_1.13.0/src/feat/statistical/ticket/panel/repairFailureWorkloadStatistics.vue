// 故障报修工作量统计
<template>
  <el-card style="height:598px">
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      @cell-click="cellClick"
    >
      <template slot="header">
        <el-row
          type="flex"
          align="middle"
          class="query base-margin-left base-margin-top base-margin-right"
        >
          <el-col :span="20">
            <span class="label">故障报修工作量统计</span>
            <pure-button-group
              style="display:inline"
              :options="groupBtnOptions"
              default-active="按院区"
              @change="handleTabChange"
            />
          </el-col>
          <el-col :span="4" style="text-align:right">
            <el-button
              size="mini"
              icon="el-icon-download"
              :disabled="downButtonDisable"
              @click="onDownExcel"
            />
          </el-col>
        </el-row>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <el-table-column
        :label="nameLabel"
        prop="name"
        width="140px"
        fixed="left"
      />
      <el-table-column label="工作量指标">
        <el-table-column label="接听率">
          <el-table-column label="数量" prop="answerCount" />
          <el-table-column label="占比" prop="answerRate">
            <template #default="{row}"> {{ row.answerRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="建单率">
          <el-table-column label="数量" prop="createOrderCount" />
          <el-table-column label="占比" prop="createOrderRate">
            <template #default="{row}"> {{ row.createOrderRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="电话解决率">
          <el-table-column label="数量" prop="endPhoneCount" />
          <el-table-column label="占比" prop="endPhoneRate">
            <template #default="{row}"> {{ row.endPhoneRate }}% </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="派单率">
          <el-table-column label="数量" prop="sendOrderCount" />
          <el-table-column label="占比" prop="sendOrderRate">
            <template #default="{row}"> {{ row.sendOrderRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="工单完成率">
          <el-table-column label="数量" prop="endOrderCount" />
          <el-table-column label="占比" prop="endOrderRate">
            <template #default="{row}"> {{ row.endOrderRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="超时完成率">
          <el-table-column label="数量" prop="overTimeCount" />
          <el-table-column label="占比" prop="overTimeRate">
            <template #default="{row}"> {{ row.overTimeRate }}% </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>

      <el-table-column label="未完成指标">
        <el-table-column label="未建单率">
          <el-table-column label="数量" prop="noDealCount" />
          <el-table-column label="占比" prop="noDealRate">
            <template #default="{row}"> {{ row.noDealRate }}% </template>
          </el-table-column>
        </el-table-column>

        <!-- <el-table-column label="未派单率">
          <el-table-column label="数量" prop="waitDeliveryCount" />
          <el-table-column label="占比" prop="waitDeliveryRate">
            <template #default="{row}"> {{ row.waitDeliveryRate }}% </template>
          </el-table-column>
        </el-table-column> -->
        <el-table-column label="未接单率">
          <el-table-column label="数量" prop="sendMeCount" />
          <el-table-column label="占比" prop="sendMeRate">
            <template #default="{row}"> {{ row.sendMeRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="未完成率">
          <el-table-column label="数量" prop="mineNotDoneCount" />
          <el-table-column label="占比" prop="mineNotDoneRate">
            <template #default="{row}"> {{ row.mineNotDoneRate }}% </template>
          </el-table-column>
        </el-table-column>
      </el-table-column>

      <el-table-column label="满意度指标">
        <el-table-column label="接听电话好评率">
          <el-table-column label="好评量" prop="answerGoodCount" />
          <el-table-column label="好评率" prop="answerGoodRate">
            <template #default="{row}"> {{ row.answerGoodRate }}% </template>
          </el-table-column>
          <el-table-column label="自评量" prop="answerBadCount" />
          <el-table-column label="自评率" prop="answerBadRate">
            <template #default="{row}"> {{ row.answerBadRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="处理速度好评率">
          <el-table-column label="好评量" prop="makeSpeedGoodCount" />
          <el-table-column label="好评率" prop="makeSpeedGoodRate">
            <template #default="{row}"> {{ row.makeSpeedGoodRate }}% </template>
          </el-table-column>
          <el-table-column label="自评量" prop="makeSpeedBadCount" />
          <el-table-column label="自评率" prop="makeSpeedBadRate">
            <template #default="{row}"> {{ row.makeSpeedBadRate }}% </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="处理效果好评率">
          <el-table-column label="好评量" prop="makeEffectGoodCount" />
          <el-table-column label="好评率" prop="makeEffectGoodRate">
            <template #default="{row}">
              {{ row.makeEffectGoodRate }}%
            </template>
          </el-table-column>
          <el-table-column label="自评量" prop="makeEffectBadCount" />
          <el-table-column label="自评率" prop="makeEffectBadRate">
            <template #default="{row}"> {{ row.makeEffectBadRate }}% </template>
          </el-table-column>
        </el-table-column>
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
import { mapMutations, } from 'vuex';
export default {
  components: {
    PureButtonGroup,
    PureTable,
  },
  props: {
    time: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableData: [],
      list: [],
      listApi: TicketApi.faultRepairCount,
      // 1按院区 2按小组 3按人员
      groupBtnOptions: [
        {
          count: null,
          name: '按院区',
        },
        {
          count: null,
          name: '按人员',
        },
        {
          count: null,
          name: '按小组',
        }
      ],
      startTime: null,
      endTime: null,
      template: 1, // 1按人员2按小组3按供应商
      nameLabel: '院区',
      queryCondition: {
        startTime: Moment()
          .startOf('month')
          .format('YYYY-MM-DD'),
        endTime: Moment()
          .endOf('month')
          .format('YYYY-MM-DD'),
        type: 1,
      },
      downButtonDisable: false,
    };
  },

  methods: {
    cellClassName({ row, column, rowIndex, columnIndex, }) {
      const props = [
        'answerCount',
        'createOrderCount',
        'endPhoneCount',
        'sendOrderCount',
        'endOrderCount',
        'overTimeCount',
        'noDealCount',
        'waitDeliveryCount',
        'sendMeCount',
        'mineNotDoneCount',
        'answerGoodCount',
        'makeSpeedGoodCount',
        'makeEffectGoodCount',
        'answerBadCount',
        'makeSpeedBadCount',
        'makeEffectBadCount'
      ];
      if (props.includes(column['property'])) {
        return 'custom-cell';
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex, }) {
      const blueProps = [
        'answerCount',
        'endOrderCount',
        'createOrderCount',
        'endPhoneCount',
        'sendOrderCount',
        'overTimeCount',
        'answerGoodCount',
        'makeSpeedGoodCount',
        'makeEffectGoodCount'
      ];
      const yellowProps = [
        'noDealCount',
        'waitDeliveryCount',
        'sendMeCount',
        'mineNotDoneCount'
      ];
      const redProps = [
        'answerBadCount',
        'makeSpeedBadCount',
        'makeEffectBadCount'
      ];
      if (blueProps.includes(column['property'])) {
        return {
          backgroundColor: '#e0eefc',
          color: '#469AE7',
          cursor: 'pointer',
        };
      } else if (yellowProps.includes(column['property'])) {
        return {
          backgroundColor: '#fff2e5',
          color: '#F0A968',
          cursor: 'pointer',
        };
      } else if (redProps.includes(column['property'])) {
        return {
          backgroundColor: '#feefeb',
          color: '#FF3D3D',
          cursor: 'pointer',
        };
      }
    },
    ...mapMutations('statistical/index', ['SET_QUERY_DATA']),
    cellClick(row, column, cell, event) {
      // 状态 1接听 2建单 3电话解决 4派单 5工单完成 6超时完成 7未建单 8未派单 9未接单 10 未完成 11接听电话好评 12接听电话自评 13处理速度好评 14处理速度自评 15处理效果好评 16处理效果自评

      const titleMap = {
        'answerCount': {

          title: '工作量指标-接听率-数量',
          status: 1,
        },
        'createOrderCount': {

          title: '工作量指标-建单率-数量',
          status: 2,
        },
        'endPhoneCount': {

          title: '工作量指标-电话解决率-数量',
          status: 3,
        },
        'sendOrderCount': {

          title: '工作量指标-派单率-数量',
          status: 4,
        },
        'endOrderCount': {

          title: '工作量指标-工单完成率-数量',
          status: 5,
        },
        'overTimeCount': {

          title: '工作量指标-超时完成率-数量',
          status: 6,
        },
        'noDealCount': {

          title: '未完成指标-未建单率-数量',
          status: 7,
        },
        'waitDeliveryCount': {

          title: '未完成指标-未派单率-数量',
          status: 8,
        },
        'sendMeCount': {

          title: '未完成指标-未接单率-数量',
          status: 9,
        },
        'mineNotDoneCount': {

          title: '未完成指标-未完成率-数量',
          status: 10,
        },
        'answerGoodCount': {

          title: '满意度指标-接听电话好评率-好评量',
          status: 11,
        },
        'answerBadCount': {

          title: '满意度指标-接听电话好评率-自评量',
          status: 12,
        },
        'makeSpeedGoodCount': {

          title: '满意度指标-处理速度好评率-好评量',
          status: 13,
        },
        'makeSpeedBadCount': {

          title: '满意度指标-处理速度好评率-自评量',
          status: 14,
        },
        'makeEffectGoodCount': {

          title: '满意度指标-处理效果好评率-好评量',
          status: 15,
        },
        'makeEffectBadCount': {

          title: '满意度指标-处理效果好评率-自评量',
          status: 16,
        },

      };
      if (titleMap[column.property]) {
        const query = {
          startTime: this.startTime || this.time[0],
          endTime: this.endTime || this.time[1],
          type: this.template,
          id: row.id,
          ...titleMap[column.property],
        };
        this.SET_QUERY_DATA(query);
        this.$router.push({
          path: '/statistical/faultReportWorkloadList',
        });
      }
    },
    async onDownExcel() {
      try {
        const params = {
          ...this.queryCondition,
          pageSize: this.$refs.pureTable.pageSize,
          pageNum: this.$refs.pureTable.currentPage,
        };
        this.downButtonDisable = true;
        const res = await TicketApi.faultRepairCountExport(params);
        const fileName = `故障报修工作量统计-[${this.nameLabel}]}.xlsx`;
        downLoadFile(res.url, fileName);
      } catch (err) {
        this.$message.error(err);
      } finally {
        this.downButtonDisable = false;
      }
    },
    // 查询条件变更后操作
    async changeQueryCondition(condition = {}) {
      this.startTime = condition.startTime;
      this.endTime = condition.endTime;
      this.queryCondition.startTime = this.startTime;
      this.queryCondition.endTime = this.endTime;
    },

    handleTabChange(val) {
      switch (val) {
        case '按院区':
          this.template = '1';
          this.nameLabel = '院区';
          break;
        case '按小组':
          this.template = '2';
          this.nameLabel = '小组';
          break;
        case '按人员':
          this.template = '3';
          this.nameLabel = '人员';
          break;
      }
      this.queryCondition.type = this.template;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-cell {
  ::v-deep .cell {
    overflow: none !important;
    padding: 0 !important;
  }
}
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

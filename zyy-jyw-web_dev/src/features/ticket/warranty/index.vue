<template>
  <el-container>

    <el-main>
      <pure-table
        ref="pureTable"
        :list-api="listApi"
        :query-condition="queryData"
        class="pureTable"
      >
        <template #header>
          <query-panel
            @query="onQuery"
            @reset="onReset"
          >
            <el-form-item>
              <el-input v-model="queryData.faultRemark" placeholder="故障描述" />
            </el-form-item>
            <!-- <el-form-item>
              <fault-type-select
                v-model="queryData.faultType"
                style="width: 100%"
              />
            </el-form-item> -->
            <el-form-item>
              <dic-select
                v-model="queryData.currState"
                class="item"
                dic-key="obs_fault_state"
                placeholder="工单状态"
                size="mini"
              />
            </el-form-item>
            <el-form-item>
              <user-select
                v-model="queryData.createUser"
                collapse-tags
                multiple
                placeholder="建单人"
              />
            </el-form-item>
            <dic-select v-model="queryData.source" dic-key="obs_fault_source" placeholder="故障来源" size="mini" class="dic-item" />
            <el-form-item>
              <el-date-picker
                v-model="queryData.time"
                format="yyyy-MM-dd"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="报修开始日期"
                end-placeholder="报修结束日期"
                @change="datePicker"
              />
            </el-form-item>
            <template #right>
              <pure-button
                v-auth="'obs:repair:add'"
                icon="add"
                label="报修"
                @click="onCreateTicket('warranty')"
              />
            </template>
          </query-panel>
        </template>
        <template #indexColumn>
          序号
        </template>
        <el-table-column
          label="故障描述"
          prop="faultRemark"
          show-overflow-tooltip
        >
          <template #default="{row}">
            <span class="operate-btn" @click="onWarrantyViewTicket(row.orderNum)">
              <pure-tag
                v-if="row['orderNum'].includes('#')"
                label="协"
                type="danger"
                @click="onViewTicket(row.parentOrderNum)"
              />
              <pure-tag
                v-if="row.hurryCount"
                :label="row.hurryCount"
                :max="99"
                icon="clock"
                type="warning"
              />
              {{ row.faultRemark }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="报修科室"
          prop="deptName"
        />
        <el-table-column
          label="故障分类"
          prop="faultTypeToName"
        />
        <el-table-column
          label="报修电话"
          prop="phone"
        />
        <el-table-column
          label="报修时间"
          prop="createTime"
        />
        <el-table-column
          label="建单人"
          prop="createUserToName"
        />
        <el-table-column
          label="报障来源"
          prop="sourceToName"
        />
        <el-table-column
          label="状态"
          prop="currStateToName"
        >
          <template #default="{row}">
            <span
              :class="['state--'+row.currState,'state','prefix-dot']"
            >{{ row.currStateToName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop=""
        >
          <template #default="{row}">
            <span class="operate-btn" @click="onViewTicket(row.orderNum)">查看</span>
            <span v-if="row.currState !== 'wait_appraisal' && row.currState !== 'wait_audit' && row.currState !== 'terminated' && row.currState !== 'ended'" v-auth="'obs:repair:reminder'" class="operate-btn" @click="editFun(row)">催单</span>
            <span v-if="row.currState === 'wait_appraisal'" v-auth="'obs:repair:evaluate'" class="operate-btn" @click="revoke(row)">评价</span>
            <span v-if="row.currState !== 'wait_appraisal' && row.currState !== 'wait_audit' && row.currState !== 'terminated' && row.currState !== 'ended'" v-auth="'obs:repair:termination'" class="operate-btn delete" @click="onDelete(row.orderNum)">终止</span>
          </template>
        </el-table-column>
      </pure-table>
    </el-main>
  </el-container>
</template>
<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import PureButton from '@/common/components/button/index.vue';
import { pxToPercentage, } from '@/common/utils/convert';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import {
  CONSUMABLE_APPLAY_AUDIT_STATE,
  CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
} from '@/features/library/config';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import WarrantyApi from './api';
import TicketMixin from '../mixin';
import Abort from './components/abort.vue';
import EvaluationInfo from './components/evaluationInfo.vue';
import TicketDrawer from './components/ticket.vue';

export default {
  components: {
    UserSelect,
    PureButton,
    DicSelect,
    QueryPanel,
  },
  mixins: [
    TicketMixin,
  ],
  data() {
    return {
      listApi: WarrantyApi.getListData,
      stateList: CONSUMABLE_APPLAY_AUDIT_STATE,
      CONSUMABLE_APPLAY_AUDIT_STATE_MAP,
      queryData: {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
        // 申请科室
        inDept: null,
        operatorType: '',
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 查看工单
     * @param {String} ticketId 工单编号
     */
    async onWarrantyViewTicket(ticketId) {
      this.$drawer({
        component: () => <TicketDrawer operatorType='VIEW' id={ticketId}
        />,
      });
    },
    async onCreateTicket(createPattern = 'byManual') {
      this.$drawer({
        width: '65.47%',
        component: () => <TicketDrawer
          operatorType='CREATE'
          createPattern={createPattern}
          onDone={this.onPerformedOperation}
          onRefresh ={this.onPerformedOperation}
        />,
      });
    },
    onPerformedOperation() {
      if (this.$refs.pureTable) {
        this.$refs.pureTable.fetchData();
      } else {
        console.warn('未给PureTable组件设置ref="pureTable"');
      }
    },
    datePicker(val) {
      if (val) {
        this.queryData.createInfoStartDate = val[0] || '';
        this.queryData.createInfoEndDate = val[1] || '';
      } else {
        this.queryData.createInfoStartDate = '';
        this.queryData.createInfoEndDate = '';
      }
    },
    onQuery() {
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onReset() {
      this.queryData = {
        time: [],
        // 审核结果(0待审核 1驳回 2通过)
        auditState: null,
        // 申请时间结束
        createEndTime: '',
        // 申请时间开始
        createStartTime: '',
        // 申请人
        createUser: null,
        // 申请科室
        inDept: null,
      };
      this.onQuery();
    },
    // 初始化
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    // 去评价
    revoke(row) {
      this.$drawer({
        width: pxToPercentage(860),
        component: () => <EvaluationInfo data={row}
          onDone={this.cancel}
        />,
      });
    },
    async onDelete(orderNum) {
      this.$dialog({
        width: '600px',
        component: () => <Abort
          rejectApi={WarrantyApi.updateTermination}
          orderNum={orderNum}
          onDone={this.cancel}
        />,
      });
    },
    cancel() {
      this.$refs.pureTable.fetchData();
    },
    /* 催单操作 */
    editFun(row) {
      this.$confirm('是否确认对工单进行催单操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const params = {
            orderNum: row.orderNum,
            currState: row.currState,
          };
          WarrantyApi.updateReminder(params).then((res) => {
            this.$message.success('催单成功');
            this.init();
          }).catch((err) => {
            this.$message.error(err);
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消',
          });
        });
    },
  },
};
</script>
<style lang='scss'
  scoped
>
.operate-btn {
  margin-right: 16px;
  font-size: 14px;
  color: #006666;
  cursor: pointer;

  &.delete {
    color: #ff836b;
  }
}
.pureTable {
  padding: 0 16px;
}
.dic-item{
  margin-right: 10px;
}
</style>

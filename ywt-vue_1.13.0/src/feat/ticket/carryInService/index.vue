<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-07-19 14:11:38
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-08-16 11:23:57
 * @Description:送修管理
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :list-api="listApi"
        :columns="columns"
        :query-condition="queryCondition"
        :operation-column-width="245"
      >
        <template slot="header">
          <el-row
            type="flex"
            align="middle"
            class="query base-margin-left base-margin-top base-margin-right"
          >
            <el-col :span="20">
              <el-form
                size="mini"
                inline
                :model="queryForm"
              >
                <el-form-item>
                  <el-input v-model="queryForm.query" class="w-200" prefix-icon="el-icon-search" placeholder="关键字" />
                </el-form-item>
                <el-form-item>
                  <el-date-picker
                    v-model="queryForm.time"
                    size="mini"
                    class="w-298"
                    type="daterange"
                    range-separator="至"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    start-placeholder="送修时间"
                    end-placeholder="送修时间"
                  />
                </el-form-item>
                <el-form-item>
                  <department-cascader v-model="queryForm.deptId" class="w-200" placeholder="报修科室" />
                </el-form-item>
                <el-form-item>
                  <tree-dic-cascader
                    v-model="queryForm.deviceType"
                    :dic-key="'assetsType'"
                    class="w-200"
                    placeholder="设备分类"
                  />
                </el-form-item>
                <el-form-item>
                  <dic-select v-model="queryForm.currState" type="string" class="w-200" dic-key="repair_state" placeholder="所有状态" />
                </el-form-item>
                <el-form-item>
                  <pure-button label="查询" class="base-margin-right" type="wire-frame" @click="onQuery" />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="4" class="align-right">
              <pure-button label="新增送修" type="default" @click="onCreateCarryInfo" />
            </el-col>
          </el-row>
        </template>
        <template slot="indexColumn">
          序号
        </template>
        <template slot="columns" slot-scope="{row,prop}">
          <span v-if="prop==='cost'">
            {{ row[prop]||'-' }}
          </span>
          <span v-else-if="prop==='currStateToName'" :class="'state--'+row.currState">
            {{ row[prop] }}
          </span>
          <span v-else-if="prop==='faultRemark'">
            {{ row[prop] | faultRemarkFormatter }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
        <template slot="operationColumn" slot-scope="{row}">
          <more-button :slice-number="3">
            <pure-button
              type="text"
              label="查看"
              @click="onView(row.id,row.currState)"
            />
            <pure-button
              v-if="['receive_manage'].includes(row.currState)"
              type="text"
              label="接收处置"
              @click="onDealAccept(row.id)"
            />
            <pure-button
              v-if="['part_quote','quote_complete'].includes(row.currState)"
              type="text"
              label="结束报价"
              @click="onEndQuotePrice(row.id)"
            />
            <pure-button
              v-if="['auctions_failed'].includes(row.currState)"
              type="text"
              label="流标处理"
              @click="onDealFailureTender(row.id)"
            />
            <pure-button
              v-if="['wait_quote_audit'].includes(row.currState)"
              type="text"
              label="报价审核"
              @click="onExamineQuotePrice(row.id)"
            />
            <pure-button
              v-if="['quote_audit_notpass','cant_repair','cancel_quote','cancel_repair','repair_complete'].includes(row.currState)"
              type="text"
              label="确认送回科室"
              @click="onConfirmSendBackToDepartment(row.id)"
            />
            <pure-button
              v-if="['repairing'].includes(row.currState)"
              type="text"
              label="放弃维修"
              @click="onAbandonRepair(row.id)"
            />
            <pure-button
              v-if="['send_back'].includes(row.currState)"
              type="text"
              label="送回确认"
              @click="onConfirmReturn(row.id)"
            />
            <pure-button
              v-if="['wait_dept_take'].includes(row.currState)"
              type="text"
              label="送回处置"
              @click="onDealReturn(row.id)"
            />

            <pure-button
              v-if="['suspended'].includes(row.currState)"
              type="text"
              label="开启"
              @click="onOpenSuspended(row.id)"
            />

            <pure-button
              v-if="['wait_dept_takeaway',
                     'wait_receive',
                     'receive_manage',
                     'manufacturer_takeaway',
                     'wait_quote',
                     'part_quote',
                     'quote_complete',
                     'auctions_failed',
                     'wait_quote_audit',
                     'repairing',
                     'wait_dept_take',
                     'service_wait_take',

              ].includes(row.currState)"
              type="text"
              label="暂停"
              @click="onSuspend(row.id)"
            />
            <pure-button
              v-if="['wait_dept_takeaway',
                     'wait_receive',
                     'receive_manage',
                     'manufacturer_takeaway',
                     'wait_quote',
                     'part_quote',
                     'quote_complete',

              ].includes(row.currState)"
              type="text"
              label="终止"
              @click="onTerminate(row.id)"
            />
          </more-button>
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import CarryInServiceApi from './api';
import CarryInfoDrawer from './drawer/carryInfo.vue';
import DealCarryInServiceDrawer from './drawer/dealCarryInService.vue';
import CarryInServiceDetailDrawer from './drawer/detail.vue';
import AbandonRepairDialog from './dialog/abandonRepair.vue';
import TerminateDialog from './dialog/terminate.vue';
import { faultRemarkFormatter, } from '@/feat/ticket/filter';
import PureTable from '@/feat/component/pureTable';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import MoreButton from '@/components/button/moreButton';
import TreeDicCascader from '@/feat/system/dictionary/tree/component/treeDicCascader.vue';
import {
  omitBy,
  isNil,
} from 'lodash';
export default {
  components: {
    PureTable,
    DepartmentCascader,
    DicSelect,
    MoreButton,
    TreeDicCascader,
  },
  filters: {
    faultRemarkFormatter,
  },
  data() {
    return {
      listApi: CarryInServiceApi.list,
      queryCondition: {
        query: null,
        startTime: null,
        endTime: null,
        deptId: null,
        deviceType: null,
        currState: null,
      },
      queryForm: {
        query: null,
        time: [],
        deptId: null,
        deviceType: null,
        currState: null,
      },
    };
  },
  computed: {
    columns() {
      return this.$store.state.ticketCarryInService.carryInServiceColumn;
    },
  },
  created() {
    this.initVuexData();
    this.$store.dispatch('user/center/DISPATCHT_GET_USER_LIST');
  },
  methods: {
    // 初始化Vuex数据
    initVuexData() {
      this.$store.dispatch('ticketCarryInService/UPDATE_MANUFACTURER_LIST');
    },
    // 新增送修
    onCreateCarryInfo() {
      this.$drawer({
        width: '720px',
        component: () => <CarryInfoDrawer operatorType='CREATE' onDone={this.onPerformedOperation}/>,
      });
    },
    onView(repairId, state) {
      this.$drawer({
        width: '1184px',
        component: () => <CarryInServiceDetailDrawer operatorType='VIEW' onDone={this.onPerformedOperation} id={repairId}/>,
      });
    },

    // 终止
    onTerminate(repairId) {
      this.$dialog({
        title: '终止',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <TerminateDialog repairId={repairId} onDone={this.onPerformedOperation}/>,
      });
    },
    // 暂停
    async onSuspend(repairId) {
      await this.$confirm('确认暂停本条送修数据吗？', '提示', { confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', });
      await CarryInServiceApi.suspend(repairId);
      this.$message.success('已暂停');
      this.onPerformedOperation();
    },
    // 开启暂停
    async onOpenSuspended(repairId) {
      await CarryInServiceApi.openSuspended(repairId);
      this.$message.success('已开启');
      this.onPerformedOperation();
    },
    // 送回处置
    onDealReturn(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='DealReturnPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 送回确认
    onConfirmReturn(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='ConfirmReturnPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 放弃维修
    onAbandonRepair(repairId) {
      this.$dialog({
        title: '放弃维修',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <AbandonRepairDialog repairId={repairId} onDone={this.onPerformedOperation}/>,
      });
    },
    // 确认送回科室
    onConfirmSendBackToDepartment(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='ConfirmSendBackToDepartmentPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 报价审核
    onExamineQuotePrice(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='ExamineQuotePricePanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 流标处理
    onDealFailureTender(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='FailureTenderPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 结束报价
    onEndQuotePrice(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='QuotePriceWithBidPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },
    // 接收处置
    onDealAccept(repairId) {
      this.$drawer({
        width: '1688px',
        component: () => <DealCarryInServiceDrawer operatorType='CREATE' action='DealAcceptPanel' onDone={this.onPerformedOperation} repairId={repairId}/>,
      });
    },

    onPerformedOperation() {
      this.$refs.pureTable.fetchData();
    },
    onQuery() {
      const query = omitBy(this.queryForm, isNil);
      this.$refs.pureTable.currentPage = 0;
      this.queryCondition.startTime = query.time?.[0] || null;
      this.queryCondition.endTime = query.time?.[1] || null;
      this.queryCondition.query = query.query || null;
      this.queryCondition.deptId = query.deptId || null;
      this.queryCondition.deviceType = query.deviceType || null;
      this.queryCondition.currState = query.currState || null;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
.w-200 {
  width: 200px;
}
.w-298 {
  width: 340px;
}
.state{
  &--wait_dept_takeaway,
  &--manufacturer_takeaway,
  &--wait_quote,
  &--part_quote,
  &--quote_complete,
  &--repairing
  {
    color: $--pure-color-theme;
  }
  &--wait_receive,
  &--receive_manage,
  &--send_back,
  &--wait_dept_take,
  &--dept_wait_receive,
  &--stop
  {
    color: $--pure-color-warning;
  }
  &--auctions_failed,
  &--wait_quote_audit,
  &--quote_audit_notpass,
  &--cant_repair,
  &--cancel_quote,
  &--cancel_repair,
  &--repair_complete,
  &--termination
  {
    color: $--pure-color-danger;
  }
  &--complete
  {
    color: $--pure-color-text;
    opacity: 0.4;
  }
  &--service_wait_take {
    color: $--pure-color-text;
  }
}
</style>

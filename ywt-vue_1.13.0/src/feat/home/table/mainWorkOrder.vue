<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-08-31 16:36:23
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-12-08 11:40:12
 * @Description:主面板-工单表格
-->

<template>
  <el-container class="ticket">
    <el-main>
      <table-area>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              :max-height="tableMaxHeight"
              border
              :data="data"
              :empty-text="emptyText"
            >
              <el-table-column
                label="序号"
                align="left"
                type="index"
                width="85px"
              />
              <el-table-column
                v-for="(item, index) in tableColumns"
                :key="index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{ row }">
                  <span
                    v-if="item.prop === 'degree'"
                    :class="'degree-' + row[item.prop]"
                  >
                    {{ row[item.prop] | degree }}
                  </span>
                  <span
                    v-else-if="item.prop === 'currState'"
                    :class="'state--' + row[item.prop]"
                  >
                    {{ row[item.prop] | ticketState }}
                  </span>
                  <span v-else-if="item.prop==='faultRemark'">
                    <linked-button
                      v-if="row.hurryCount"
                      :type="1"
                      :count="row.hurryCount"
                      @click="onViewLinkedCallRecord(row, 1)"
                    />
                    <linked-button
                      v-if="row.repeatCount"
                      :count="row.repeatCount"
                      :type="2"
                      @click="onViewLinkedCallRecord(row,2)"
                    />
                    <linked-button
                      v-if="row.revokeCount"
                      :count="row.revokeCount"
                      :type="3"
                      @click="onViewLinkedCallRecord(row,3)"
                    />
                    <el-tooltip content="点击查看主工单" placement="top">
                      <pure-tag
                        v-if="row['orderNum'].includes('#')"
                        :label="'协'"
                        @click="onViewTicket(row.parentOrderNum)"
                      />
                    </el-tooltip>
                    {{ row[item.prop] | faultRemarkFormatter }}
                  </span>
                  <span
                    v-else-if="item.prop === 'isOvertime'"
                    :class="'over-time-' + row[item.prop]"
                  >
                    {{ row[item.prop] ? "是" : "否" }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left">
                <template slot-scope="{ row }">
                  <pure-button
                    v-if="
                      row['currState']==='wait_accept'&&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="接单"
                    @click="onAcceptTicket(row.orderNum)"
                  />
                  <pure-button
                    v-if="
                      row['currState']==='wait_accept' &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="退回"
                    @click="onSendTicketBack(row.orderNum)"
                  />
                  <pure-button
                    v-if="
                      ['processing','not_pass_audit'].includes(row.currState) &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="处理"
                    @click="onUpdateTicket(row.orderNum, 'making')"
                  />
                  <pure-button
                    v-if="
                      row.currState==='suspended' &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="开启"
                    @click="onOpenSuspendedTicket(row.orderNum)"
                  />
                  <pure-button
                    v-if="
                      row.currState==='terminated' &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="重启"
                    @click="onRestartTerminatedTicket(row.orderNum)"
                  />
                  <pure-button
                    v-if="
                      row.currState === 'wait_audit' &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="通过"
                    @click="onPassAudit(row.orderNum)"
                  />
                  <pure-button
                    v-if="
                      row.currState === 'wait_audit' &&
                        queryCondition.showRange === 0
                    "
                    type="text"
                    label="未通过"
                    @click="onNotPassAudit(row.orderNum)"
                  />
                  <pure-button
                    type="text"
                    label="查看"
                    @click="onViewTicket(row.orderNum)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template slot="footer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            :layout="layout"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </template>
      </table-area>
    </el-main>
  </el-container>
</template>

<script>
import PaginationTable from '@/minxins/common/paginationTable';
import HomeApi from '@/apis/home';
import DealWorkOrder from '@/views/reportFault/sharedComponents/dialog/dealWorkOrder';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import NotPass from '@/views/reportFault/sharedComponents/dialog/notPass';
import TableArea from '@/views/components/common/tableArea.vue';
import {
  ticketState,
  faultRemarkFormatter,
} from '@/views/reportFault/filter';
import TicketApi from '@/views/reportFault/api';
import TicketMixin from '@/feat/ticket/mixin';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import PureTag from '@/components/tag/tag.vue';
export default {
  name: 'MainWorkOrder',
  components: {
    TableArea,
    LinkedButton,
    PureTag,
  },
  filters: {
    ticketState,
    faultRemarkFormatter,
  },
  mixins: [PaginationTable, TicketMixin],
  props: {
    queryData: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      listApi: HomeApi.workOrderList,
      tableColumns: [
        {
          label: '故障描述',
          prop: 'faultRemark',
        },
        {
          label: '处理人',
          prop: 'makeUserToName',
        },
        {
          label: '紧急程度',
          prop: 'degree',
        },
        {
          label: '状态',
          prop: 'currState',
        },
        {
          label: '报修时间',
          prop: 'infoTime',
        },
        {
          label: '是否超时',
          prop: 'isOvertime',
        }
      ],
    };
  },
  watch: {
    queryData: {
      handler(newVal) {
        this.queryCondition.startTime = newVal.dateRange?.[0];
        this.queryCondition.endTime = newVal.dateRange?.[1];
        this.queryCondition.sendUser = newVal.sendUser?.join(',');
        this.queryCondition.waitWork = newVal.waitWork;
        this.queryCondition.showRange = newVal.showRange;
        this.fetchData();
      },
      deep: true,
    },
  },
  async created() {
    this.data = [];
    this.queryCondition.startTime = this.queryData.dateRange?.[0];
    this.queryCondition.endTime = this.queryData.dateRange?.[1];
    this.queryCondition.sendUser = this.queryData.sendUser?.join(',');
    this.queryCondition.waitWork = this.queryData.waitWork;
    this.queryCondition.showRange = this.queryData.showRange;
    this.queryCondition.pageNum = this.currentPage;
    this.queryCondition.pageSize = this.pageSize;
    this.fetchData();
  },
  methods: {
    onPerformedOperation() {
      this.$emit('update');
      this.fetchData();
    },

    async handleDealOrder(row, type) {
      try {
        const data = await WorkOrderApi.detail(row.orderNum);
        this.$drawer({
          width: '1688px',
          component: () => <DealWorkOrder onDone={this.onPerformedOperation} makeType={type} data={data}/>,
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async handlePass(row) {
      await TicketApi.passAudit(row.orderNum);
      this.onPerformedOperation();
    },
    handleUnpass(row) {
      this.$dialog({
        title: '审核信息',
        width: '536px',
        top: '32vh',
        position: 'center',
        component: () => (
          <NotPass orderNum={row.orderNum} onDone={this.onPerformedOperation} />
        ),
      });
    },
    async init() {
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
.over-time-1 {
  color: #f56c6c;
}
/**紧急程度 */
//非常紧急
.degree-1 {
  color: #f56c6c;
}
//较紧急
.degree-2 {
  color: #e6a23c;
}
//常规故障
.degree-3 {
  color: #2d405e;
}
/**
  工单状态
*/
//待接单
.orderState-create {
  color: #f56c6c;
}
//未派单
.orderState-start,
.orderState-back,
.orderState-null {
  color: #e6a23c;
}
//处理中
//已完成
.orderState-end_termination,
.orderstate_close {
  color: #cad0d7;
}
//处理中
.orderState- {
  color: #67c23a;
}
/**
  来电状态
*/
//未接
.phoneState-2 {
  color: #f56c6c;
}
//已接
.phoneState-0 {
  color: #2d405e;
}
//已回拨
.phoneState-1,
.phoneState-3 {
  color: #e6a23c;
}
</style>

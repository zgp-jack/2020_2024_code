<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-01-20 11:34:31
 * @Description:服务台
-->

<template>
  <el-container class="ticket">
    <el-main>
      <pure-table-area>
        <template slot="header">
          <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
          </div>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              border
              :data="data"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                label="序号"
                align="left"
                width="85px"
                type="index"
                show-overflow-tooltip
                fixed
              >
                <template #header="scope">
                  <el-popover
                    v-if="scope.column.fixed"
                    style="padding:0"
                    popper-class="no-padding"
                    placement="bottom-start"
                    width="400"
                    :offset="-16"
                    :visible-arrow="false"
                    trigger="click"
                  >
                    <el-tabs type="border-card">
                      <el-tab-pane label="表头设置">
                        <pure-draggable :data="tableColumn" :has-checked="true" @change="handleTableColumnChange" />
                      </el-tab-pane>
                      <el-tab-pane label="排序规则">
                        <pure-draggable :data="orderRule" @change="handleOrderRuleChange" />
                      </el-tab-pane>
                    </el-tabs>
                    <i slot="reference" class="el-icon-s-operation" />
                  </el-popover>
                  序号
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item, index) in tableHeader"
                :key="item.prop+index"
                :label="item.label"
                :prop="item.prop"
                :min-width="item.minWidth"
                :column-key="item.prop"
                align="left"
                :width="item.width"
                :fixed="item.fixed"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">
                  <div v-if="item.prop ==='recording'">
                    <my-audio
                      v-if="row.recording"
                      :key="row.recording"
                      :the-url="row.recording"
                    />
                  </div>
                  <span v-else-if="item.prop === 'type'" :class="'phoneState-'+row.type">
                    {{ row[item.prop] | phoneState }}
                  </span>
                  <div v-else-if="item.prop === 'linkedType'">
                    <pure-button
                      v-if="row[item.prop]"
                      type="text"
                      :label="convertLinkedLabel(row[item.prop])"
                      @click="onViewTicket(row.linkedCode)"
                    />
                  </div>
                  <span v-else-if="item.prop ==='source'">
                    {{ row[item.prop] | source }}
                  </span>
                  <span v-else-if="item.prop ==='degree'" :class="'degree--'+row.degree">
                    {{ row[item.prop] | degree }}
                  </span>
                  <span v-else-if="item.prop ==='rangeType'">
                    {{ row[item.prop] | range }}
                  </span>
                  <span v-else-if="item.prop ==='currState'" :class="'state--'+row.currState">
                    {{ row[item.prop] | ticketState }}
                  </span>
                  <span v-else-if="item.prop==='faultRemark'">
                    <linked-button
                      v-if="row.hurryCount"
                      :type="1"
                      :count="row.hurryCount"
                      @click="onViewLinkedList(row, 1)"
                    />
                    <linked-button
                      v-if="row.repeatCount"
                      :count="row.repeatCount"
                      :type="2"
                      @click="onViewLinkedList(row,2)"
                    />
                    <linked-button
                      v-if="row.revokeCount"
                      :count="row.revokeCount"
                      :type="3"
                      @click="onViewLinkedList(row,3)"
                    />
                    <el-tooltip content="点击查看主工单" placement="top">
                      <pure-tag
                        v-if="row['orderNum'].includes('#')"
                        :label="'协'"
                        @click="onViewTicket(row.parentOrderNum)"
                      />
                    </el-tooltip>
                    {{ row[item.prop] }}
                  </span>
                  <span v-else>
                    {{ row[item.prop] }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="left" width="197px" fixed="right">
                <template slot-scope="{row}">
                  <pure-button
                    v-if="canAcceptState.includes(row['currState'])"
                    type="text"
                    label="接单"
                    @click="onAcceptTicket(row.orderNum)"
                  />

                  <pure-button
                    v-if="canSendBackState.includes(row['currState'])"
                    type="text"
                    label="退回"
                    @click="onSendTicketBack(row.orderNum)"
                  />
                  <pure-button
                    v-if="canDealState.includes(row['currState'])"
                    type="text"
                    label="处理"
                    @click="onDealOrder(row, 4)"
                  />
                  <pure-button
                    v-if="canOpenState.includes(row['currState'])"
                    type="text"
                    label="开启"
                    @click="onOpenSuspendedTicket(row.orderNum)"
                  />
                  <pure-button
                    v-if="canRestartState.includes(row['currState'])"
                    type="text"
                    label="重启"
                    @click="onRestartTerminatedTicket(row.orderNum)"
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
      </pure-table-area>
    </el-main>

  </el-container>
</template>
<script>
import TicketMixin from '../mixin';
import { fields, } from '@/config/table.config';
import MyTicketApi from '@/apis/reportFault/myOrder';
import DealWorkOrder from '../sharedComponents/dialog/dealWorkOrder';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import PaginationTable from '@/minxins/common/paginationTable';
import PureDraggable from '@/components/draggable';
import PureTag from '@/components/tag/tag.vue';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import LinkedListDialog from '@/views/reportFault/sharedComponents/dialog/linkedList';
import {
  ticketState,
} from '../filter';
export default {
  name: 'BzWdgd',
  components: {
    MyAudio: () => import('@/components/audio'),
    PureDraggable,
    PureTag,
    LinkedButton,
  },
  filters: {
    ticketState,
  },
  mixins: [PaginationTable, TicketMixin],
  data() {
    return {
      fields,
      // 可执行处理操作工单状态
      canDealState: ['processing', 'not_pass_audit'],
      // 可执行退回操作工单状态
      canSendBackState: ['wait_accept'],
      // 可执行接单操作工单状态
      canAcceptState: ['wait_accept'],

      // 可执行重启操作状态 -
      canRestartState: ['terminated'],
      // 可执行开启操作状态
      canOpenState: ['suspended'],
      // 不可执行查看操作的工单状态
      canNotViewState: ['start', null, undefined],
      tableColumn: [],
      orderRule: this.$store.state['reportFault/myOrder'].orderRule,
      // 排序规则
      sortTemp: null,
      listApi: MyTicketApi.list,
    };
  },
  computed: {
    complexTableColumn() {
      return this.$store.state['reportFault/myOrder'].complexTableColumn;
    },
    tableHeader() {
      return this.tableColumn.filter(item => item.checked).map(item => {
        return item;
      });
    },
  },
  created() {
    this.sortTemp = this.genSortTemp(this.orderRule);
    this.queryCondition.temp = 'myself';
    this.tableColumn = this.complexTableColumn;
    this.queryCondition.sortTemp = this.sortTemp;
    this.fetchData();
  },
  methods: {
    /**
     * 表格筛选之后监听事件
     */
    changeFilter(v) {
      this.queryCondition.query = v;
      this.fetchData(v);
    },
    async onDealOrder(row, type) {
      try {
        const data = await WorkOrderApi.detail(row.orderNum);
        this.$drawer({
          width: '1688px',
          component: () => <DealWorkOrder onDone={this.fetchData} makeType={type} data={data}/>,
        });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },

    // 表头设置变更
    async handleTableColumnChange(newVal) {
      this.tableColumn = newVal;
      this.$store.dispatch('reportFault/myOrder/UPDATE_COMPLEX_TABLE_COLUMN', newVal);
    },
    // 排序规则变更
    async handleOrderRuleChange(newOrderRule) {
      this.orderRule = newOrderRule;
      this.sortTemp = this.genSortTemp(newOrderRule);
      this.queryCondition.sortTemp = this.sortTemp;
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.fetchData();
      this.$store.dispatch('reportFault/myOrder/UPDATE_ORDER_RULE', newOrderRule);
    },
    // 生成排序规则字符串
    genSortTemp(orderRule) {
      return orderRule.map(item => item.label).join(',') || null;
    },
    onViewLinkedList(row, type) {
      let title = '';
      let subTitle = '';
      switch (type) {
        case 1:
          title = '催单信息';
          subTitle = `催单次数: ${row.hurryCount}`;
          break;
        case 2:
          title = '重报信息';
          subTitle = `重报次数: ${row.repeatCount}`;
          break;
        case 3:
          title = '撤单信息';
          subTitle = `撤单次数: ${row.revokeCount}`;
          break;
      }
      this.$dialog({
        title,
        subTitle,
        width: '648px',
        top: '10vh',
        position: 'center',
        component: () => <LinkedListDialog type={type} orderNum={row.orderNum}/>,
      });
    },
  },

};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
</style>

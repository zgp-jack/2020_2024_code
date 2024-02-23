<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-04-16 15:03:34
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 14:00:32
 * @Description:服务台
-->

<template>
  <el-container class="ticket">
    <el-main>
      <table-area>
        <template slot="header">
          <pure-collapse-transition
            @transition-end="handleCollapseChange"
          >
            <filter-panel
              v-show="showFilterPanel"
              class="filtedr-panel"
              :red-data="redData"
              @changeTemplateType="handleChangeTemplateType"
            />
          </pure-collapse-transition>
          <el-row
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >
            <el-col :span="1">
              <caret-button
                label="筛选"
                class="base-margin-right"
                @click="handleFilterPanel"
              />
            </el-col>
            <el-col :span="5">
              <search v-model="searchValue" class="base-margin-right" />
            </el-col>
            <el-col :span="18">
              <span
                class="agent base-margin-right"
              ><span>当前坐席类型：</span> 人工坐席</span>
              <span
                class="agent base-margin-right"
              ><span>坐席人员:</span> {{ onlineList }}</span>
            </el-col>
            <el-col :span="6" :offset="1" class="align-right base-margin-right">
              <pure-button label="坐席设定" type="wire-frame" @click="openSettingSeatDialog" />
              <pure-button label="创建工单" type="default" @click="handleCreateEmptyOrder" />
            </el-col>
          </el-row>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              ref="table"
              v-loading="loading"
              border
              :data="data"
              row-key="id"
              :max-height="tableMaxHeight"
            >
              <el-table-column
                label="序号"
                align="left"
                width="85px"
                type="index"
                show-overflow-tooltip
                :fixed="true"
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
                v-for="(item,index) in tableHeader"
                :key="item.prop+index"
                :label="item.label"
                :prop="item.prop"
                :column-key="item.prop"
                :min-width="item.minWidth"
                :show-overflow-tooltip="true"
                :width="item.width"
                :fixed="item.fixed"
                :class-name="item.prop==='recording'?'recording-column':''"
                align="left"
              >
                <template slot-scope="{row}">
                  <div v-if="item.prop ==='recording'">
                    <my-audio
                      v-if="row.recording"
                      :key="row.recording"
                      :the-url="row.recording"
                    />
                  </div>
                  <span v-else-if="item.prop === 'type'" :class="'call-type--'+row.type">
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
                  <span v-else-if="item.prop ==='dealType'">
                    {{ row[item.prop] | dealType }}
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
              <el-table-column v-if="tableColumnType!== 'phoneFind'" label="操作" align="left" width="213" :fixed="'right'">
                <template slot-scope="{row}">
                  <template v-if="tableColumnType === 'normal'">
                    <pure-button
                      v-if="row.type===0&&!row.dealType"
                      type="text"
                      label="建单"
                      @click="onCreateTicketByCallRecord(row)"
                    />
                    <pure-button
                      v-if="row.type===0&&!row.dealType"
                      type="text"
                      label="电话找人"
                      @click="onPhoneFindPerson(row)"
                    />
                    <pure-button
                      v-if="row.dealType==='create_order'"
                      type="text"
                      label="查看"
                      @click="onViewTicket(row.orderNum)"
                    />
                  </template>

                  <template v-else>
                    <pure-button
                      v-if="canDistributState.includes(row['currState'])"
                      type="text"
                      label="派单"
                      @click="onDispatch(row)"
                    />
                    <pure-button
                      v-if="canEndState.includes(row['currState'])"
                      type="text"
                      label="终止"
                      @click="onDealOrder(row, 6)"
                    />
                    <pure-button
                      v-if="
                        canSuspendState.includes(
                          row['currState']
                        )
                      "
                      type="text"
                      label="暂停"
                      @click="onDealOrder(row, 2)"
                    />
                    <pure-button
                      type="text"
                      label="查看"
                      @click="onViewTicket(row.orderNum)"
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
                  </template>
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
    <un-received />
  </el-container>
</template>

<script>
import caretButton from '@/components/button/caretButton';
import MyAudio from '@/components/audio/audio';
import { getRedInfo, } from '@/apis/reportFault/workOrder';
import SettingSeat from '../sharedComponents/dialog/settingSeat';
import Dispatch from '../sharedComponents/dialog/dispatch';
import CreateWorkOrder from '../sharedComponents/dialog/createWorkOrder';
import DealWorkOrder from '../sharedComponents/dialog/dealWorkOrder';
import FindPersonByPhone from '../sharedComponents/dialog/findPersonByPhone';
import WorkOrderApi from '@/apis/reportFault/workOrder';
import PureDraggable from '@/components/draggable';
import PureCollapseTransition from '@/components/collapseTransition';
import {
  mapGetters,
} from 'vuex';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import LinkedListDialog from '@/views/reportFault/sharedComponents/dialog/linkedList';
import PaginationTable from '@/minxins/common/paginationTable';
import UnReceived from '@/views/reportFault/sharedComponents/panel/unReceived.vue';
import TableArea from '@/views/components/common/tableArea.vue';
import FilterPanel from './filterPanel.vue';
import PureWebsocket from '@/utils/PureWebSocket';
import PureTag from '@/components/tag/tag.vue';
import {
  findIndex,
} from 'lodash';
import {
  ticketState,
} from '../filter';
import ServiceDeskApi from './api';
import TicketMixin from '../mixin';
export default {
  name: 'BzFwt',
  components: {
    FilterPanel,
    caretButton,
    MyAudio,
    PureDraggable,
    UnReceived,
    TableArea,
    PureCollapseTransition,
    LinkedButton,
    PureTag,
  },
  filters: {
    ticketState,
    dealType(dealType) {
      const dealTypeMap = {
        'create_order': '创建工单',
        'end_phone': '电话解决',
        'end_look': '电话找人',
        'end_invalid': '无效电话',
      };
      return dealTypeMap[dealType] || '未处理';
    },
  },
  mixins: [PaginationTable, TicketMixin],
  data() {
    return {
      orderRule: this.$store.state['reportFault/center'].orderRule,
      showFilterPanel: true,
      // 排序规则
      sortTemp: null,
      templateType: '待派单',
      tableColumn: [],
      normalType: ['电话报修', '已接', '未接', '待建单', '电话找人'],
      // 红点数据
      redData: {},
      // 可执行建单操作的工单状态
      canCreateState: [null, undefined],
      // 可执行派单操作的工单状态
      canDistributState: ['wait_delivery'],
      // 不可执行查看操作的工单状态
      canNotViewState: [null, undefined],
      // 可执行终止操作的工单状态
      canEndState: [
        // 'wait_delivery',
        // 'wait_accept',
        'processing',
        'suspended'
      ],
      // 可执行暂停操作的工单状态
      canSuspendState: [
        // 'wait_delivery',
        // 'wait_accept',
        'processing'
      ],
      // 可执行电话找人的工单状态
      canPhoneFindState: [null, undefined],
      // 可执行电话已解决的工单状态
      canPhoneSolvedState: [],
      // 可执行重启操作状态 -
      canRestartState: ['terminated'],
      // 可执行开启操作状态
      canOpenState: ['suspended'],
      websoket: null,
      // 当前被连接的分机
      currentPhone: 0,
      // 获取缓存中存在的分机
      storagePhoneList: [],
      filterParam: {},
      // 表头类型 'normal' 'complex' 'phoneFind'
      tableColumnType: 'complex',
      listApi: WorkOrderApi.list,
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'onlineList']),
    normalTableColumn() {
      return this.$store.state['reportFault/center'].normalTableColumn;
    },
    complexTableColumn() {
      return this.$store.state['reportFault/center'].complexTableColumn;
    },
    phoneFindTableColumn() {
      return this.$store.state['reportFault/center'].PhoneFindTableColumn;
    },
    tableHeader() {
      return this.tableColumn.filter(item => item.checked).map(item => {
        return item;
      });
    },
  },
  async created() {
    try {
      this.sortTemp = this.genSortTemp(this.orderRule);
      this.queryCondition.sortTemp = this.genSortTemp(this.orderRule);
      this.queryCondition.temp = WorkOrderApi.TYPE[this.templateType];
      this.tableColumn = this.complexTableColumn;
      const redInfo = await getRedInfo();
      this.redData = Object.assign({}, this.redData, redInfo);
      this.setTableMaxHeight();
      await this.fetchData();
    } catch (error) {
      console.log(error);
    }
  },

  async mounted() {
    this.$store.state['reportFault/callCenter'].ws = new PureWebsocket({
      url: `${this.$store.state.login.uriConfig.wsUri}?token=${this.$store.state.login.refreshToken}`,
    });
    this.$store.state['reportFault/callCenter'].ws.onMessage(async (data) => {
      if (data.code === 0) {
        console.log('websocket开始监听');
      } else if (data.code === 10) {
        console.log('当前在线坐席：', data.body);
        const phone = await this.$store.dispatch('reportFault/callCenter/INIT_ONLINE_INFO', data.body);
        this.$store.state['reportFault/callCenter'].ws.send({ code: 16, data: phone, });
      } else if (data.code === 12) {
        console.log('你好，有弹屏信息');

        if (this.$store.state.app.openedDrawerOrDialogCount > 0) {
          this.$store.state.app.unrecivedPanelVisible = true;
          this.$store.state.app.unrevivedData.push({ orign: { info: data.body, }, phone: data.body.phone, user: data.body.user, deptId: data.body.deptId, time: data.body.createTime, id: data.body.id, });
        } else {
          this.handleCreateOrder({ orign: { info: data.body, }, });
        }
      } else if (data.code === 11) {
        console.log('坐席变更', data.body);
        this.$store.dispatch('reportFault/callCenter/UPDATE_ONLINE_INFO', data.body);
      } else if (data.code === 14) {
        console.log('电话挂断');
        const index = findIndex(this.$store.state.app.unrevivedData, (item) => item.id === data.body.id);
        if (index >= 0) {
          this.$store.state.app.unrevivedData.splice(index, 1);
        }
      }
    });
  },
  methods: {
    handleFilterPanel() {
      this.showFilterPanel = !this.showFilterPanel;
    },
    handleCollapseChange() {
      this.setTableMaxHeight();
    },
    // 表头设置变更
    async handleTableColumnChange(newVal) {
      this.tableColumn = newVal;
      if (this.tableColumnType === 'normal') {
        this.$store.dispatch('reportFault/center/UPDATE_NORMAL_TABLE_COLUMN', newVal);
      } else if (this.tableColumnType === 'phoneFind') {
        this.$store.dispatch('reportFault/center/UPDATE_PHONE_FIND_TABLE_COLUMN', newVal);
      } else {
        this.$store.dispatch('reportFault/center/UPDATE_COMPLEX_TABLE_COLUMN', newVal);
      }
    },
    // 排序规则变更
    async handleOrderRuleChange(newOrderRule) {
      this.orderRule = newOrderRule;
      this.sortTemp = this.genSortTemp(newOrderRule);
      this.currentPage = 0;
      this.fetchData();
      this.$store.dispatch('reportFault/center/UPDATE_ORDER_RULE', newOrderRule);
    },
    openSettingSeatDialog() {
      this.$dialog({
        title: '坐席设定',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <SettingSeat/>,
      });
    },
    // 根据通话记录创建工单
    onCreateTicketByCallRecord(row) {
      const data = {
        fault: {},
        info: row,
        make: {},
      };
      this.$drawer({
        width: '1688px',
        component: () => <CreateWorkOrder type='pop' onDone={this.fetchData} data={data}/>,
      });
    },
    onPhoneFindPerson(row) {
      this.$dialog({
        title: '电话找人',
        width: '390px',
        top: '32vh',
        position: 'center',
        component: () => <FindPersonByPhone orderId={row.id} onDone={this.fetchData}/>,
      });
    },

    onDispatch(row) {
      this.$dialog({
        title: '派单',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <Dispatch orderNum={row.orderNum} onDone={this.fetchData}/>,
      });
    },
    convertLinkedLabel(type) {
      switch (type) {
        case 1:
          return '催单';
        case 2:
          return '重报';
        case 3:
          return '撤单';
        default:
          return null;
      }
    },
    async afterFetchData() {
      const rs = await ServiceDeskApi.redInfo();
      this.redData = Object.assign({}, this.redData, rs);
    },
    handleCreateOrder(row) {
      this.$drawer({
        width: '1688px',
        component: () => <CreateWorkOrder type='pop' onDone={this.fetchData} data={row.orign}/>,
      });
    },

    handleCreateEmptyOrder() {
      this.$drawer({
        width: '1688px',
        component: () => <CreateWorkOrder onDone={this.fetchData}/>,
      });
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

    async handleChangeTemplateType(type) {
      this.filterParam = {};
      this.templateType = type;
      this.$refs.table.clearFilter();
      this.currentPage = 0;
      this.queryCondition.pageNum = this.currentPage;
      this.queryCondition.temp = WorkOrderApi.TYPE[type];
      if (this.normalType.includes(type)) {
        this.tableColumnType = 'normal';
        this.tableColumn = this.normalTableColumn;
        this.listApi = WorkOrderApi.callRecordList;
        if (type === '电话找人') {
          this.tableColumnType = 'phoneFind';
          this.tableColumn = this.phoneFindTableColumn;
        }
      } else {
        this.tableColumnType = 'complex';
        this.tableColumn = this.complexTableColumn;
        this.listApi = WorkOrderApi.list;
      }
      await this.fetchData();
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

<style lang='scss' scoped>
@import "~@/styles/ticket.scss";
.agent {
  color: #2d405e;
  font-size: $--pure-base-font-size;
  span {
    color: #879bba;
  }
}
.btn{
  width: 100px;
  padding-left: 0;
  padding-right: 0;
}
.filtedr-panel {
 width: 1040px;
 height: 179px;
 overflow-y: hidden;
}
::v-deep .recording-column {
  padding: 12px 0;
}
</style>

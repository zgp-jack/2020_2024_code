<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-01-17 15:39:42
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 15:53:59
 * @Description: 工单-服务台
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :query-condition="queryCondition"
        :list-api="listApi"
        :row-style="rowStyle"
        :operation-column-width="250"
      >
        <template slot="header">
          <pure-collapse-transition
            @transition-end="onFlowChartPanelTransitionEnd"
          >
            <flow-chart-panel
              v-show="flowChartVisiable"
              ref="flowChartPanel"
              class="flow-chart-panel"
              :default-template-type="queryCondition.temp"
              :red-data="redData"
              @templateTypeChange="onTemplateTypeChange"
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
                @click="onChangeFlowChartPanelVisiable"
              />
            </el-col>
            <el-col :span="11">
              <span class="statistic_item">已接：<span>{{ redData.pickedUp }}</span></span>
              <span class="statistic_item">未接：<span>{{ redData.missed }}</span></span>
              <span class="statistic_item">已建：<span>{{ redData.establish }}</span></span>
              <span class="statistic_item">电话解决：<span>{{ redData.endPhone }}</span></span>
              <span v-show="queryBarVisible" class="search_btn" @click="onToggleQueryBar">展开搜索<i class="el-icon-arrow-down" /></span>
            </el-col>

            <el-col :span="8">
              <span v-if="socketStatus!==1" class="socket-error">{{ socketErrorMessage }}</span>
              <template v-else>
                <span
                  class="agent base-margin-right"
                ><span>当前坐席类型：</span> {{ seatTypeLabel }}</span>
                <span
                  v-if="seatType === 'ARTIFICIAL_SEAT'"
                  class="agent base-margin-right"
                ><span>坐席人员:</span> {{ onlineList }}</span>
                <span
                  v-else-if="seatType === 'CALL_DIVERT'"
                  class="agent base-margin-right"
                ><span>转移号码:</span> {{ callDivertLabel }}</span>
              </template>

            </el-col>
            <el-col :span="4" :offset="1" class="align-right base-margin-right">
              <pure-button label="坐席设定" type="wire-frame" :disabled="socketStatus!==1" @click="onSetSeat" />
              <pure-button label="创建工单" type="default" @click="onCreateTicket()" />
            </el-col>
          </el-row>
          <el-row
            v-show="!queryBarVisible"
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >
            <el-col :span="3">
              <retrieval class="base-margin-right" @change="onRetrievalChange" />
            </el-col>
            <el-col :span="19">
              <el-date-picker
                v-model="tempQueryCondition.time"
                size="mini"
                class="base-margin-right"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="通话时间"
                end-placeholder="通话时间"
              />
              <el-select v-model="tempQueryCondition.reception" filterable multiple="" collapse-tags placeholder="所有服务台人员" style="width:200px" size="mini" class="base-margin-right">
                <el-option
                  v-for="item in receptionList"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                />
              </el-select>
              <el-select v-model="tempQueryCondition.hospitalId" placeholder="所有报修院区" collapse-tags multiple clearable style="width:200px" size="mini" class="base-margin-right">
                <el-option
                  v-for="item in hospitalList"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
              <dept-has-team-cascader size="mini" style="width:200px" class="base-margin-right" @change="onDeptHasTeamCascaderChanged" />
              <pure-button label="查询" class="base-margin-right" type="wire-frame" @click="onQuery" />
              <span class="search_btn" @click="onToggleQueryBar">收起<i class="el-icon-arrow-up" /></span>
            </el-col>

          </el-row>
        </template>
        <template slot="indexColumn" slot-scope="scope">
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
            <el-tabs v-model="activedTab" type="border-card">
              <el-tab-pane label="表头设置" name="tableColumn">
                <pure-draggable :data="columns" :has-checked="true" @change="onTableColumnChange" />
              </el-tab-pane>
              <el-tab-pane v-if="tableColumnType==='ticket'" label="排序规则" name="ticketRule">
                <pure-draggable :data="ticketRule" @change="onTicketRuleChange" />
              </el-tab-pane>
            </el-tabs>
            <i slot="reference" class="el-icon-s-operation" />
          </el-popover>
          序号
        </template>
        <template slot="indexColumnContent" slot-scope="{row,$index}">
          <span v-if="isBackTicket(row)" style="float:left">
            <el-tag>退</el-tag>
            {{ $index+1 }}
          </span>
          <span v-else>{{ $index+1 }}</span>
        </template>
        <template slot="columns" slot-scope="{row,prop}">
          <div v-if="prop ==='recording'">
            <my-audio
              v-if="row.recording"
              :key="row.recording"
              :the-url="row.recording"
            />
            <span v-else>无录音信息</span>
          </div>
          <span v-else-if="prop === 'type'" :class="'call-type--'+row.type">
            {{ row[prop] | phoneState }}
          </span>
          <div v-else-if="prop === 'linkedType'">
            <pure-button
              v-if="row[prop]"
              type="text"
              :label="convertLinkedLabel(row[prop])"
              @click="onViewTicket(row.linkedCode)"
            />
          </div>
          <span v-else-if="prop ==='source'">
            {{ row[prop] | source }}
          </span>
          <span v-else-if="prop ==='degree'" :class="'degree--'+row.degree">
            {{ row[prop] | degree }}
          </span>
          <span v-else-if="prop==='dealType'">
            {{ row[prop] | callRecordDealType }}
          </span>
          <span v-else-if="prop ==='rangeType'">
            {{ row[prop] | range }}
          </span>
          <span v-else-if="prop ==='currState'" :class="'state--'+row.currState">
            {{ row[prop] | ticketState }}
          </span>
          <span v-else-if="prop==='faultRemark'">
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
            {{ row[prop] | faultRemarkFormatter }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
        <template v-if="tableColumnType!=='callRecordPhoneFind'" :slot="tableColumnType==='callRecordPhoneFind'?'':'operationColumn'" slot-scope="{row}">
          <template v-if="tableColumnType === 'callRecord'">
            <more-button :slice-number="3 ">
              <pure-button
                v-if="row.type===0&&!row.dealType"
                type="text"
                label="建单"
                @click="onCreateTicket('byCallRecord',row)"
              />
              <pure-button
                v-if="row.type===0&&!row.dealType"
                type="text"
                label="电话找人"
                @click="onFindPerson(row.id)"
              />
              <pure-button
                v-if="!row.dealType"
                type="text"
                label="无效电话"
                @click="onInvalidPhone(row.id)"
              />
              <pure-button
                v-if="['end_phone','create_order'].includes(row.dealType)"
                type="text"
                label="查看"
                @click="onViewTicket(row.orderNum)"
              />
            </more-button>
          </template>

          <template v-else>
            <more-button :slice-number="3">
              <pure-button
                v-if="canDistributState.includes(row['currState'])"
                type="text"
                label="派单"
                @click="onDispatchTicket(row.orderNum)"
              />
              <pure-button
                v-if="row.currState === 'wait_accept'"
                type="text"
                label="重派"
                @click="onReDispatchTicket(row.orderNum)"
              />
              <pure-button
                v-if="canEndState.includes(row['currState'])"
                type="text"
                label="终止"
                @click="onUpdateTicket(row.orderNum, 'endTermination')"
              />

              <pure-button
                v-if="
                  canSuspendState.includes(
                    row['currState']
                  )
                "
                type="text"
                label="暂停"
                @click="onUpdateTicket(row.orderNum, 'suspend')"
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
              <pure-button
                v-if="canUpdateAnswerAndFaultInfo.includes(row['currState'])"
                type="text"
                label="编辑"
                @click="onUpdateAnswerAndFaultInfo(row.orderNum)"
              />

              <pure-button
                type="text"
                label="打印"
                @click="onPrintTicket(row.id)"
              />
            </more-button>
          </template>
        </template>
      </pure-table>
    </el-main>
    <un-received />
  </el-container>
</template>

<script>
import ServiceDeskApi from './api';
import TicketMixin from '../mixin';
import FlowChartPanel from './panel/flowChart.vue';
import SeatSettingDialog from './dialog/seatSetting.vue';
import {
  ticketState,
  callRecordDealType,
  faultRemarkFormatter,
} from '../filter';
import DepartmentApi from '@/feat/system/department/api';
import PureTable from '@/feat/component/pureTable';
import CaretButton from '@/components/button/caretButton';
import PureCollapseTransition from '@/components/collapseTransition';
import PureWebsocket from '@/utils/PureWebSocket';
import MyAudio from '@/components/audio/audio';
import FindPersonByPhone from '@/views/reportFault/sharedComponents/dialog/findPersonByPhone';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import UnReceived from '@/views/reportFault/sharedComponents/panel/unReceived.vue';
import PureTag from '@/components/tag/tag.vue';
import PureDraggable from '@/components/draggable';
import DeptHasTeamCascader from '@/feat/system/department/component/deptHasTeamCascader.vue';
import {
  findIndex,
} from 'lodash';
import {
  mapGetters,
  mapActions,
} from 'vuex';
import MoreButton from '@/components/button/moreButton';
import Moment from 'moment';
export default {
  name: 'BzFwt',
  components: {
    PureTable,
    FlowChartPanel,
    CaretButton,
    PureCollapseTransition,
    MyAudio,
    LinkedButton,
    UnReceived,
    PureTag,
    PureDraggable,
    MoreButton,
    DeptHasTeamCascader,
  },
  filters: {
    ticketState,
    callRecordDealType,
    faultRemarkFormatter,
  },
  mixins: [TicketMixin],
  data() {
    return {
      columns: [],
      // 表头类型 ticket/callRecord/callRecordPhoneFind(电话找人)
      tableColumnType: 'callRecord',
      listApi: ServiceDeskApi.callRecordList,
      flowChartVisiable: true,
      activedTab: 'tableColumn',
      // 红点数据
      redData: {
        pickedUp: 0,
        missed: 0,
        establish: 0,
        endPhone: 0,
      },
      // 查询条件，更改值后会自动触发查询请求
      queryCondition: {
        query: null,
        temp: 'untenited',
        sortTemp: null,
        startTime: null,
        endTime: null,
        reception: null,
        hospitalId: null,
        departmentId: null,
        teamId: null,
      },
      tempQueryCondition: {
        query: null,
        reception: null,
        time: [],
        hospitalId: null,
        departmentId: null,
        teamId: null,
      },
      ticketRule: this.$store.state.ticketServiceDesk.ticketRule,

      // 可执行派单操作的工单状态
      canDistributState: ['wait_delivery'],
      // 可执行终止操作的工单状态
      canEndState: [
        'processing',
        'suspended',
        'wait_delivery',
        'wait_accept',
        'processing'
      ],
      // 可执行暂停操作的工单状态
      canSuspendState: [
        'processing'
      ],

      // 可执行重启操作状态 -
      canRestartState: ['terminated'],
      // 可执行开启操作状态
      canOpenState: ['suspended'],
      // 可编辑接听信息，故障信息状态
      canUpdateAnswerAndFaultInfo: ['wait_delivery', 'wait_accept', 'processing'],
      // 坐席类型
      seatType: 'ARTIFICIAL_SEAT',
      callDivertPhone: '',
      queryBarVisible: true,
      receptionList: [],
      todayDate: Moment().format('YYYY-MM-DD'),
      autoRefreshTimer: null,
      autoRefreshTimeInterval: 60 * 1000,
      hospitalList: [],
      // 呼叫转移号码显示
      callDivertLabel: '',
      // 微信报修需要通知的人员
      engineersNeedToNotify: '',

    };
  },

  computed: {
    ...mapGetters(['userInfo', 'onlineList', 'socketStatus']),
    callRecordTableColumn() {
      return this.$store.state.ticketServiceDesk.callRecordTableColumn;
    },
    callRecordPhoneFindTableColumn() {
      return this.$store.state.ticketServiceDesk.callRecordPhoneFindTableColumn;
    },
    ticketTableColumn() {
      return this.$store.state.ticketServiceDesk.ticketTableColumn;
    },
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
    seatTypeLabel() {
      switch (this.seatType) {
        case 'ARTIFICIAL_SEAT':
          return '人工坐席';
        case 'CALL_DIVERT':
          return '呼叫转移';
        default:
          return '未知';
      }
    },
    socketErrorMessage() {
      switch (this.socketStatus) {
        case 0:
          return 'websocket连接中...';
        case 2:
          return 'websocket断开,请联系系统管理员';
        case 3:
          return 'websocket无法正常连接,请联系系统管理员';
        default:
          return 'websocket异常,请联系系统管理员';
      }
    },
  },
  async mounted() {
    this.$refs.pureTable.afterFetchData = this.afterFetchData;
    this.$store.state.ticketServiceDesk.ws = new PureWebsocket({
      url: `${this.$store.state.login.uriConfig.wsUri}?token=${this.$store.state.login.accessToken}`,
    });
    this.$store.state.ticketServiceDesk.ws.onMessage(this.onWebsocketMessage);
  },

  async created() {
    try {
      this.fetchHospital();
      this.fetchTableColumnData();
      this.DISPATCHT_GET_USER_LIST();
      this.sortTemp = this.genSortTemp(this.ticketRule);
      this.queryCondition.sortTemp = this.genSortTemp(this.ticketRule);
      this.queryCondition.startTime = this.todayDate;
      this.queryCondition.endTime = this.todayDate;
      this.tempQueryCondition.time = [this.todayDate, this.todayDate];
      this.columns = this.callRecordTableColumn;
      this.receptionList = await ServiceDeskApi.receptionList();
      this.startAutoRefreshTask();
    } catch (error) {
      console.log(error);
    }
  },
  deactivated() {
    this.stopAutoRefreshTask();
  },
  activated() {
    this.startAutoRefreshTask();
  },
  methods: {
    ...mapActions('user/center', ['DISPATCHT_GET_USER_LIST']),
    async fetchTableColumnData() {
      const { permission: callRecordColumn, } = await ServiceDeskApi.tableColumnDetail('callRecord') || {};
      if (callRecordColumn) {
        this.$store.dispatch('ticketServiceDesk/UPDATE_CALL_RECORD_COLUMN', JSON.parse(callRecordColumn));
      }
      const { permission: ticketColumn, } = await ServiceDeskApi.tableColumnDetail('ticket') || {};
      if (ticketColumn) {
        this.$store.dispatch('ticketServiceDesk/UPDATE_TICKET_TABLE_COLUMN', JSON.parse(ticketColumn));
      }
      const { permission: callRecordPhoneFindColumn, } = await ServiceDeskApi.tableColumnDetail('callRecordsPhoneFind') || {};
      if (callRecordPhoneFindColumn) {
        this.$store.dispatch('ticketServiceDesk/UPDATE_CALL_RECORD_PHONE_FIND_COLUMN', JSON.parse(callRecordPhoneFindColumn));
      }
    },
    // 获取院区数据
    async fetchHospital() {
      const { list, } = await DepartmentApi.list({ pageNum: 0, pageSize: 99999, deptType: 1, state: 0, });
      this.hospitalList = list;
    },
    // 开启定时刷新任务
    startAutoRefreshTask() {
      if (!this.autoRefreshTimer) {
        this.autoRefreshTimer = setInterval(() => {
          this.onPerformedOpertion();
        }, this.autoRefreshTimeInterval);
      }
    },

    // 暂停定时刷新任务
    stopAutoRefreshTask() {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    },
    rowStyle({ row, }) {
      let color = null;
      const backColor = 'rgba(254,247,247,1)';
      if (this.isBackTicket(row)) {
        color = backColor;
      }
      return {
        'background': color,
      };
    },
    onFlowChartPanelTransitionEnd() {
      setTimeout(() => {
        this.$refs.pureTable.setTableMaxHeight();
      }, 100);
    },
    // 处理websocket信息
    async onWebsocketMessage(data) {
      console.log(data);
      const { code, body, msg, } = data;
      switch (code) {
        // websocket连接成功
        case 0:
          console.log('websocket连接成功');
          break;
          // 当前在线坐席
        case 10:
          this.dealArtificialSeatInfo(body);
          break;
          // 人工坐席变更
        case 11:
          this.dealArtificialSeatChange(body);
          break;
          // 弹屏信息
        case 12:
          this.dealPopInfo(body);
          break;
          // 电话挂断
        case 14:
          this.dealPhoneHangup(body);
          break;
          // 心跳检测
        case 15:
          break;
          // 呼叫转移变更
        case 17:
          this.dealCallDivertChange(body);
          break;
          // 呼叫转移或微信报修通知变更
        case 18:
          this.dealCallDivertOrWechatNotifyChange(body);
          break;
          // 待派单提醒
        case 210:
          this.dealWaitDeliveryNotify(body);
          break;
          // 告警消息
        case 101:
          this.alertMessage(body);
          break;
        case -1:
          this.$message.error(msg);
          break;
      }
    },
    // 告警消息
    alertMessage(data) {
      this.$notify({
        title: '集中报修事件提醒',
        message: data,
        type: 'warning',
        duration: 0,
      });
    },

    // 处理当前坐席信息
    async dealArtificialSeatInfo(data) {
      this.seatType = 'ARTIFICIAL_SEAT';
      const phone = await this.$store.dispatch('ticketServiceDesk/INIT_ONLINE_INFO', data);
      this.$store.state.ticketServiceDesk.ws.send({ code: 16, data: phone, });
    },
    // 处理坐席变更
    dealArtificialSeatChange(data) {
      this.seatType = 'ARTIFICIAL_SEAT';
      this.$store.dispatch('ticketServiceDesk/UPDATE_ONLINE_INFO', data);
    },
    // 处理弹屏信息
    dealPopInfo(data) {
      if (this.$store.state.app.openedDrawerOrDialogCount > 0) {
        this.$store.state.app.unrecivedPanelVisible = true;
        this.$store.state.app.unrevivedData.push({ orign: { info: data, }, phone: data.phone, user: data.user, deptId: data.deptId, time: data.createTime, id: data.id, });
      } else {
        this.onCreateTicket('byPop', data);
      }
    },
    // 处理电话挂断
    dealPhoneHangup(data) {
      const index = findIndex(this.$store.state.app.unrevivedData, (item) => item.id === data.id);
      if (index >= 0) {
        this.$store.state.app.unrevivedData.splice(index, 1);
      }
    },
    // 处理呼叫转移变更
    dealCallDivertChange(data) {
      this.seatType = 'CALL_DIVERT';
      this.callDivertPhone = data;
      this.callDivertLabel = this.callDivertPhone;
    },
    dealCallDivertOrWechatNotifyChange(data) {
      this.seatType = 'CALL_DIVERT';
      this.callDivertLabel = data.phone || '未设置成功呼叫转移号码';
      this.engineersNeedToNotify = data.engineersNeedToNotify;
      if (this.engineersNeedToNotify) {
        this.callDivertLabel = data.phone + '已开启微信报修通知';
      }
    },
    // 处理待派单提醒
    dealWaitDeliveryNotify(data) {
      this.$notify({
        title: '超时待派单提醒',
        message: `今日共有${data}条工单超时未派单，请及时处理`,
        iconClass: 'el-icon-alarm-clock',
        customClass: 'notify-warning pointer',
        duration: 30000,
        onClick: () => this.onTemplateTypeChange('waitDelivery'),
      });
    },

    onTemplateTypeChange(type) {
      // 属于通话记录的模板
      // 电话报修-phoneCreate
      // 已接-pickedUp
      // 未接-missed
      // 待建单-untenited
      // 电话找人-findSomeone 与普通通话记录表头不一样
      console.log('zheshi lll');
      const callRecordTemplate = ['phoneCreate', 'pickedUp', 'todayPickedUp', 'missed', 'untenited'];
      this.$refs.pureTable.currentPage = 0;
      if (callRecordTemplate.includes(type)) {
        this.tableColumnType = 'callRecord';
        this.columns = this.callRecordTableColumn;
        this.listApi = ServiceDeskApi.callRecordList;
      } else if (type === 'findSomeone') {
        this.tableColumnType = 'callRecordPhoneFind';
        this.columns = this.callRecordPhoneFindTableColumn;
        this.listApi = ServiceDeskApi.callRecordList;
      } else {
        this.tableColumnType = 'ticket';
        this.columns = this.ticketTableColumn;
        this.listApi = ServiceDeskApi.list;
      }
      this.queryCondition.temp = type;
      this.activedTab = 'tableColumn';
    },
    onChangeFlowChartPanelVisiable() {
      this.flowChartVisiable = !this.flowChartVisiable;
    },
    onToggleQueryBar() {
      this.queryBarVisible = !this.queryBarVisible;
      this.$nextTick(() => {
        this.$refs.pureTable.setTableMaxHeight();
      });
    },
    onRetrievalChange(val) {
      this.tempQueryCondition.query = val;
    },
    isBackTicket(row) {
      return row.operState === 'back';
    },
    onSetSeat() {
      const data = {
        callDivertPhone: this.callDivertPhone,
        engineersNeedToNotify: this.engineersNeedToNotify,
      };
      this.$dialog({
        title: '坐席设定',
        width: '688px',
        top: '32vh',
        position: 'center',
        component: () => <SeatSettingDialog currentSeatType={this.seatType} data={data}/>,
      });
    },

    // 生成排序规则字符串
    genSortTemp(ticketRule) {
      return ticketRule.map(item => item.label).join(',') || null;
    },
    convertLinkedLabel(linkedType) {
      switch (linkedType) {
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
    // 表头设置变更
    async onTableColumnChange(newVal) {
      this.columns = newVal;
      if (this.tableColumnType === 'callRecord') {
        this.$store.dispatch('ticketServiceDesk/UPDATE_CALL_RECORD_COLUMN', newVal);
      } else if (this.tableColumnType === 'callRecordPhoneFind') {
        this.$store.dispatch('ticketServiceDesk/UPDATE_CALL_RECORD_PHONE_FIND_COLUMN', newVal);
      } else {
        this.$store.dispatch('ticketServiceDesk/UPDATE_TICKET_TABLE_COLUMN', newVal);
      }
    },
    // 排序规则变更
    async onTicketRuleChange(newTicketRule) {
      this.ticketRule = newTicketRule;
      this.sortTemp = this.genSortTemp(newTicketRule);
      this.onPerformedOpertion();
      this.$store.dispatch('ticketServiceDesk/UPDATE_TICKET_RULE', newTicketRule);
    },
    onPhoneFindPerson(row) {
      this.$dialog({
        title: '电话找人',
        width: '390px',
        top: '32vh',
        position: 'center',
        component: () => <FindPersonByPhone orderId={row.id} onDone={this.onPerformedOpertion}/>,
      });
    },
    async afterFetchData() {
      const rs = await ServiceDeskApi.redInfo({ ...this.queryCondition, });
      this.redData = Object.assign({}, this.redData, rs);
    },
    onPerformedOpertion() {
      this.$refs.pureTable.fetchData();
    },
    onQuery() {
      this.queryCondition.query = this.tempQueryCondition.query || null;
      this.queryCondition.reception = this.tempQueryCondition.reception.join(',') || null;
      this.queryCondition.startTime = this.tempQueryCondition.time?.[0];
      this.queryCondition.endTime = this.tempQueryCondition.time?.[1];
      this.queryCondition.hospitalId = this.tempQueryCondition.hospitalId.join(',') || null;
      this.queryCondition.teamId = this.tempQueryCondition.teamId;
      this.queryCondition.departmentId = this.tempQueryCondition.departmentId;
    },
    onDeptHasTeamCascaderChanged(nodeData) {
      if (nodeData) {
        if (nodeData.type === 'department') {
          this.tempQueryCondition.departmentId = nodeData.id;
          this.tempQueryCondition.teamId = null;
        } else {
          this.tempQueryCondition.departmentId = null;
          this.tempQueryCondition.teamId = nodeData.id;
        }
      } else {
        this.tempQueryCondition.departmentId = null;
        this.tempQueryCondition.teamId = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
.flow-chart-panel {
  width: 1065px;
  height: 179px;
  overflow-y: hidden;
}
.socket-error {
 color: #f56c6c;
}
.agent {
  color: #2d405e;
  font-size: $--pure-base-font-size;
  span {
    color: #879bba;
  }
}
.el-tag {
  border-radius: 50%;
  padding: 4px;
  height: 24px;
  line-height: 14px;
  border: 1px solid rgba(245,108,108,0.50);
  background: rgba(245,108,108,0.10);
  color: #f56c6c;
  cursor: pointer;
}
.search_btn {
  color:#426ED7;
  cursor: pointer;
  margin-left: 48px;
}
.statistic_item {
& + .statistic_item {
  margin-left: 48px;
}
  color: #7D8DB3;
  span {
    color: #334266;
  }
}
</style>

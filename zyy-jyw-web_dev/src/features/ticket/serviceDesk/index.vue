<template>
  <el-container class="pure pure-ticket">
    <el-header class="header">
      <el-row
        class="service-desk"
        justify="space-between"
        type="flex"
      >
        <el-col
          class="base-margin-left"
        >
          <span v-if="socketStatus!==1" class="socket-error">{{ socketErrorMessage }}</span>
          <template v-else>
            <!-- <template v-if="notline === 'notOnline'">
              <span class="socket-error">坐席未上线</span>
              <pure-button
                type="major"
                label="上线"
                @click="onSetSeat"
              />
            </template> -->
            <template>
              <span class="agent">当前坐席类型：<span class="agent-value">{{ seatTypeLabel }}</span></span>
              <span class="agent">坐席人员:<span class="agent-value">{{ onlineList }}</span></span>
              <pure-button
                v-if="notOnline === 'mine'"
                icon="earphone"
                label="坐席设定"
                @click="onSetSeat"
              />
              <pure-button
                v-if="notOnline === 'mine'"
                type="major"
                label="下线"
                @click="onSeat"
              />
              <pure-button
                v-if="notOnline === 'notMine'"
                type="major"
                label="上线"
                @click="onSetSeat"
              />
            </template>
          </template>
        </el-col>
        <el-col :span="12" class="service-detail">
          <span>
            服务台情况
            <el-tooltip placement="top">
              <div slot="content">

                统计数据与查询条件(时间、坐席人员)有关联
                <br>
                默认查询今日所有坐席人员的情况
              </div>
              <svg-icon icon-class="question" />
            </el-tooltip>
            ：
          </span>
          <span class="item">已接：<span>{{ redData.pickedUp }}</span></span>
          <span class="item">未接：<span>{{ redData.missed }}</span></span>
          <span class="item">已建：<span>{{ redData.createOrder }}</span></span>
          <span class="item">电话解决：<span>{{ redData.endPhone }}</span></span>
        </el-col>
      </el-row>

    </el-header>
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :list-api="listApi"
        :operation-column-width="250"
        :query-condition="queryCondition"
        style="padding: 0 10px"
      >
        <template slot="header">

          <flow-chart-panel
            :default-template-type="queryCondition.temp"
            :red-data="redData"
            @templateTypeChange="onTemplateTypeChange"
            @transition-end="onFlowChartPanelTransitionEnd"
          />
          <el-row
            class="base-margin-top"
            type="flex"
          >
            <el-col :span="22">
              <template
                v-if="tableColumnType==='ticket'"
              >
                <el-input
                  v-model="queryConditionTemp.ticketQuery"
                  class="item"
                  placeholder="故障描述/工单号/报修电话"
                >
                  <i
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
                <el-date-picker
                  v-model="queryConditionTemp.ticketCreateInfoDate"
                  class="item"
                  end-placeholder="报修时间"
                  range-separator="-"
                  size="mini"
                  start-placeholder="报修时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                />
                <user-select
                  v-model="queryConditionTemp.createUserList"
                  class="item"
                  collapse-tags
                  multiple
                  placeholder="建单人"
                  size="mini"
                />
                <dept-multi-cascader
                  v-model="queryConditionTemp.ticketHospitalList"
                  :show-all-levels="false"
                  class="item"
                  placeholder="报修院区/科室"
                />
                <dic-select
                  v-model="queryConditionTemp.degree"
                  class="item"
                  dic-key="obs_fault_degree"
                  placeholder="紧急程度"
                  size="mini"
                />
                <dic-select
                  v-show="queryConditionExpand"
                  v-model="queryConditionTemp.rangeType"
                  class="item"
                  dic-key="obs_fault_range"
                  placeholder="影响范围"
                  size="mini"
                />
                <dic-select
                  v-show="queryConditionExpand"
                  v-model="queryConditionTemp.source"
                  class="item"
                  dic-key="obs_fault_source"
                  placeholder="故障来源"
                  size="mini"
                />
                <dic-select
                  v-show="queryConditionExpand"
                  v-model="queryConditionTemp.orderState"
                  class="item"
                  dic-key="obs_fault_state"
                  placeholder="工单状态"
                  size="mini"
                />
                <user-select
                  v-show="queryConditionExpand"
                  v-model="queryConditionTemp.makeUserList"
                  class="item"
                  collapse-tags
                  multiple
                  placeholder="处理人"
                  size="mini"
                />
                <user-select
                  v-show="queryConditionExpand"
                  v-model="queryConditionTemp.serverUserList"
                  class="item"
                  collapse-tags
                  multiple
                  placeholder="坐席人"
                  size="mini"
                />
                <pure-button
                  icon="search"
                  label="查询"
                  size="mini"
                  type="minor"
                  @click="onQueryTicket"
                />
                <pure-button
                  icon="reset"
                  label="重置"
                  size="mini"
                  type="patch"
                  @click="onResetTicket"
                />
                <pure-button
                  :icon="expandIcon"
                  :label="expandLabel"
                  icon-position="right"
                  size="mini"
                  type="text"
                  @click="onToggleQueryCondition"
                />
              </template>
              <template
                v-if="tableColumnType==='callRecord'"
              >
                <el-input
                  v-model="queryConditionTemp.recordQuery"
                  class="item"
                  placeholder="工单号/报修电话"
                >
                  <i
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
                <el-date-picker
                  v-model="queryConditionTemp.createInfoDate"
                  class="item"
                  end-placeholder="来电时间 "
                  range-separator="-"
                  size="mini"
                  start-placeholder="来电时间"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
                <dic-select
                  key="query_condition_temp_obs_deal_type"
                  v-model="queryConditionTemp.dealType"
                  class="item"
                  dic-key="obs_deal_type"
                  placeholder="处置类型"
                  size="mini"
                />
                <dept-multi-cascader
                  v-model="queryConditionTemp.hospitalList"
                  class="item"
                  placeholder="报修院区/科室"
                />
                <user-select
                  v-model="queryConditionTemp.userList"
                  class="item"
                  collapse-tags
                  multiple
                  placeholder="坐席人/所找人员"
                  size="mini"
                />
                <pure-button
                  icon="search"
                  label="查询"
                  size="mini"
                  type="minor"
                  @click="onQueryRecord"
                />
                <pure-button
                  icon="reset"
                  label="重置"
                  size="mini"
                  type="patch"
                  @click="onResetRecord"
                />
              </template>
            </el-col>
            <el-col
              :span="2"
              class="text-align-end"
            >
              <pure-button
                v-auth="'obstacles:server:add'"
                icon="add"
                label="创建工单"
                @click="onCreateTicket()"
              />
            </el-col>
          </el-row>
        </template>
        <template slot="indexColumn">
          序号
        </template>
        <template
          slot="columns"
          slot-scope="{row,prop}"
        >
          <div v-if="prop==='recording'">
            <pure-audio
              v-if="row.recording"
              :key="row.recording"
              :the-url="row.recording"
            />
            <span v-else>-</span>
          </div>
          <span
            v-else-if="prop === 'callTypeToName'"
            :class="['call-record-status--'+row.callType,'prefix-dot']"
          >{{ row[prop] }}</span>
          <span v-else-if="prop ==='source'">
            {{ row[prop] }}
          </span>
          <div v-else-if="prop ==='degreeToName'">
            <span
              v-if="row[prop] !== null"
              :class="['degree','degree--'+row.degree]"
            >
              {{ row[prop] }}
            </span>
            <span v-else />
          </div>
          <span v-else-if="prop ==='rangeType'">
            {{ row[prop] }}
          </span>
          <span
            v-else-if="prop ==='currStateToName'"
            :class="['state--'+row.currState,'state','prefix-dot']"
          >{{ row[prop] }}</span>
          <span
            v-else-if="prop==='faultRemark'"
            class="fault-description"
            @click="onViewTicket(row.orderNum)"
          >
            <pure-tag
              v-if="isBackTicket(row)"
              label="退"
              type="danger"
            />
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
            <pure-tag
              v-if="row.repeatCount"
              :label="row.repeatCount"
              :max="99"
              icon="loop"
            />
            {{ row[prop] }}
          </span>
          <span v-else-if="prop==='linkedCode'">
            <span
              v-if="row[prop]"
              class="ticket-id"
              @click="onViewTicket(row[prop])"
            >
              {{ row[prop] }}
            </span>
            <span v-else>
              -
            </span>
          </span>
          <span v-else-if="prop==='dealTypeToName'">
            {{ row[prop] || '未处理' }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
        <template
          v-if="tableColumnType!=='callRecordPhoneFind'"
          :slot="tableColumnType==='callRecordPhoneFind'?'':'operationColumn'"
          slot-scope="{row}"
        >
          <template v-if="tableColumnType === 'callRecord'">
            <pure-more-button :slice-number="3 ">
              <pure-button
                v-if="row.callType===0&&!row.dealType"
                v-auth="'obstacles:server:add'"
                label="建单"
                type="text"
                @click="onCreateTicket('byPop',row)"
              />
              <pure-button
                v-if="row.type===0&&!row.dealType"
                v-auth="'obstacles:server:deal:find'"
                label="电话找人"
                type="text"
                @click="onFindPerson(row.id)"
              />
              <pure-button
                v-if="!row.dealType"
                v-auth="'obstacles:server:deal:invalid'"
                label="无效电话"
                type="text"
                @click="onInvalidPhone(row.id)"
              />
              <pure-button
                v-if="['end_phone','create_order'].includes(row.dealType)"
                label="查看"
                type="text"
                @click="onViewTicket(row.orderNum)"
              />
            </pure-more-button>
          </template>

          <template v-else>
            <pure-more-button :slice-number="3">
              <pure-button
                label="查看"
                type="text"
                @click="onViewTicket(row.orderNum)"
              />
              <pure-button
                v-if="canDispatchState.includes(row['currState'])"
                v-auth="'obstacles:server:allocate'"
                label="派单"
                type="text"
                @click="onDispatchTicket(row.orderNum)"
              />
              <pure-button
                v-if="row.currState === 'wait_accept'"
                v-auth="'obstacles:server:again:allocate'"
                label="重派"
                type="text"
                @click="onReDispatchTicket(row.orderNum)"
              />
              <pure-button
                v-if="canEndState.includes(row['currState'])"
                v-auth="'obstacles:server:termination'"
                label="终止"
                text-color="warning"
                type="text"
                @click="onUpdateTicket(row.orderNum, 'endTermination')"
              />

              <pure-button
                v-if="
                  canSuspendState.includes(
                    row['currState']
                  )
                "
                v-auth="'obstacles:server:suspend'"
                label="暂停"
                text-color="warning"
                type="text"
                @click="onUpdateTicket(row.orderNum, 'suspend')"
              />

              <pure-button
                v-if="canOpenState.includes(row['currState'])"
                v-auth="'obstacles:server:open'"
                label="开启"
                type="text"
                @click="onOpenSuspendedTicket(row.orderNum)"
              />

              <pure-button
                v-if="canRestartState.includes(row['currState'])"
                v-auth="'obstacles:server:restart'"
                label="重启"
                type="text"
                @click="onRestartTerminatedTicket(row.orderNum)"
              />

              <pure-button
                v-if="canUpdateAnswerAndFaultInfoState.includes(row['currState'])"
                v-auth="'obstacles:server:edit'"
                label="编辑"
                type="text"
                @click="onUpdateAnswerAndFaultInfo(row.orderNum)"
              />
              <pure-button
                v-if="['wait_delivery','processing','wait_accept','suspended','not_pass_audit'].includes(row.currState)"
                v-auth="'obstacles:server:reminder'"
                label="催单"
                type="text"
                @click="editReminder(row)"
              />

              <!--              屏蔽打印-->
              <!--              <pure-button
                label="打印"
                type="text"
                @click="onPrintTicket(row.id)"
              />-->
            </pure-more-button>
          </template>
        </template>
      </pure-table>
    </el-main>
    <div v-if="isPhone" class="phoneDialog">
      <div class="dialog-header">新来电提醒
        <span class="dialog-close" @click="onClose"><i class="el-icon-close" /></span>
      </div>
      <div class="dialog-content">
        <el-scrollbar>
          <div v-for="(item, index) in list" :key="index" class="dialog-item">
            <div class="item-top">
              <div>
                <span v-if="item.type != 2" class="item-unCall">未接</span>
                <span class="item-font">{{ item.place }} <span v-if="!item.place">{{ item.phone }}</span></span>
              </div>
              <div class="item-font">{{ item.user }}</div>
            </div>
            <div class="item-bottom">
              <div class="item-font">{{ item.createTime }}</div>
              <pure-button
                v-if="item.type == 2"
                type="major"
                label="去建单"
                @click="onCreateCall(item, index)"
              />
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- <div v-else class="onCalling" @click="onOpen">
      <img v-if="isOnCalling" src="../../login/images/icon-user.png" alt="">
    </div> -->
  </el-container>
</template>

<script>
import TicketMixin from '../mixin';
import ServiceDeskApi from './api';
import FlowChartPanel from './components/test.vue';
import PureWebsocket from '@/common/utils/pureWebSocket';
import PureAudio from '@/common/components/audio';
import Moment from 'moment';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import DeptMultiCascader from '@/features/system/departmentManagement/components/deptMultiCascader.vue';
import SeatSettingDialog from './dialog/seat.vue';
import { mapState, } from 'vuex';
import {
  findIndex,
} from 'lodash';
import WarrantyApi from '@/features/ticket/warranty/api';
export default {
  name: 'TicketServiceDesk',
  components: {
    FlowChartPanel,
    PureAudio,
    DicSelect,
    UserSelect,
    DeptMultiCascader,
  },
  mixins: [
    TicketMixin,
  ],
  data() {
    return {
      columns: [],
      // tableColumnType: 'callRecord',
      tableColumnType: 'ticket',
      // listApi: ServiceDeskApi.callRecordList,
      listApi: ServiceDeskApi.list,
      flowChartVisible: true,
      redData: {},
      queryCondition: {
        temp: 'UNTENITED',
        keyword: null,
        createInfoEndDate: null,
        createInfoStartDate: null,
        dealType: null,
        hospitalList: [],
        userList: [],
        createUserList: [],
        degree: null,
        rangeType: null,
        source: null,
        orderState: null,
        makeUserList: [],
        serverUserList: [],
      },
      queryConditionTemp: {
        keyword: '',

        createFaultTime: [],
        createUserList: [],

        /**
         * 通话查询参数
         */
        recordQuery: null,
        createInfoDate: [],
        dealType: null,
        hospitalList: [],
        userList: [],
        /**
         * 工单查询参数
         */
        ticketQuery: null,
        ticketCreateInfoDate: [],
        degree: null,
        rangeType: null,
        source: null,
        orderState: null,
        makeUserList: [],
        serverUserList: [],
        ticketHospitalList: [],
      },
      tempQueryCondition: {},
      canDispatchState: [
        'wait_delivery',
      ],
      canEndState: [
        'processing',
        'suspended',
        'wait_delivery',
        'wait_accept',
      ],
      canSuspendState: [
        'processing',
      ],
      canRestartState: [
        'terminated',
      ],
      canOpenState: [
        'suspended',
      ],
      canUpdateAnswerAndFaultInfoState: [
        'wait_delivery',
        'wait_accept',
        'processing',
      ],
      seatType: 'ARTIFICIAL_SEAT',
      todayDate: Moment().format('YYYY-MM-DD'),
      autoRefreshTimer: null,
      autoRefreshTimeInterval: 60 * 1000,
      callDivertLabel: '',
      // 微信报修需要通知的人员
      engineersNeedToNotify: '',
      queryConditionExpand: true,
      callDivertPhone: '',
      isOnCalling: false,
    };
  },
  computed: {
    ...mapState('TICKET_SERVICE_DESK', [
      'userInfo',
      'onlineList',
      'socketStatus',
      'phoneList',
    ]),
    isPhone() {
      return this.$store.state['TICKET_SERVICE_DESK'].unrevivedData.length > 0 && this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible;
    },
    list() {
      return this.$store.state['TICKET_SERVICE_DESK'].unrevivedData;
    },
    notOnline() {
      const nickName = this.$store.state['APP_LOGIN'].userInfo.nickName;
      if (this.onlineList.indexOf(nickName) === -1) {
        return 'notMine';
      } else if (this.onlineList.indexOf(nickName) !== -1) {
        return 'mine';
      }
      return '';
    },
    notline() {
      if (this.phoneList.length === 0) {
        return 'notOnline';
      } else {
        return '';
      }
      // if (this.onlineList.length && this.onlineList !== '暂无在线坐席' && this.onlineList !== '暂未设置坐席人员') {}
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
    expandLabel() {
      if (this.queryConditionExpand) {
        return '收起';
      } else {
        return '展开';
      }
    },
    expandIcon() {
      if (this.queryConditionExpand) {
        return 'arrow-up';
      } else {
        return 'arrow-down';
      }
    },
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
    callRecordTableColumn() {
      return [{
        name: '接听情况',
        label: '接听情况',
        prop: 'callTypeToName',
        id: 1,
        order: 1,
        checked: true,
        width: 86,
      },
      {
        name: '报修电话',
        label: '报修电话',
        prop: 'phone',
        id: 2,
        order: 2,
        checked: true,
        width: 146,
      },
      {
        name: '报修院区/科室',
        label: '报修院区/科室',
        prop: 'deptName',
        id: 3,
        order: 3,
        checked: true,
        width: 158,
      },
      {
        name: '处置类型',
        label: '处置类型',
        prop: 'dealTypeToName',
        id: 4,
        order: 4,
        checked: true,
        width: 103,
      },
      {
        name: '来电时间',
        label: '来电时间',
        prop: 'createTime',
        id: 5,
        order: 5,
        checked: true,
        width: 211,
      },
      {
        name: '(关联)工单号',
        label: '(关联)工单号',
        prop: 'orderNum',
        id: 6,
        order: 6,
        checked: true,
        width: 230,
        fixed: 'left',
      },
      {
        name: '坐席人',
        label: '坐席人',
        prop: 'receptionName',
        id: 7,
        order: 7,
        checked: true,
        width: 103,
      },
      {
        name: '所找人员',
        label: '所找人员',
        prop: 'findUserName',
        id: 8,
        order: 8,
        checked: true,
        width: 103,
      },
      {
        name: '录音',
        label: '录音',
        prop: 'recording',
        id: 9,
        order: 9,
        checked: true,
        width: 288,
      },
      ];
    },
    callRecordPhoneFindTableColumn() {
      return [
        {
          name: '类型',
          label: '类型',
          prop: 'type',
          id: 1,
          order: 1,
          checked: true,
          width: 102,
        }, {
          name: '通话时间',
          label: '通话时间',
          prop: 'createTime',
          id: 2,
          order: 2,
          checked: true,
          width: 227,
        }, {
          name: '报修科室',
          label: '报修科室',
          prop: 'deptName',
          id: 3,
          order: 3,
          checked: true,
          width: 420,
        },
        {
          name: '报修人',
          label: '报修人',
          prop: 'user',
          id: 4,
          order: 4,
          checked: true,
          width: 119,
        },
        {
          name: '通话号码',
          label: '通话号码',
          prop: 'phone',
          id: 5,
          order: 5,
          checked: true,
          width: 162,
        }, {
          name: '服务台',
          label: '服务台',
          prop: 'receptionToName',
          id: 6,
          order: 6,
          checked: true,
          width: 119,
        },
        {
          name: '所找人员',
          label: '所找人员',
          prop: 'findUserToName',
          id: 7,
          order: 7,
          checked: true,
          width: 119,
        },
        {
          name: '录音',
          label: '录音',
          prop: 'recording',
          id: 8,
          order: 8,
          checked: true,
        },
      ];
    },
    ticketTableColumn() {
      return [
        {
          name: '故障描述',
          label: '故障描述',
          prop: 'faultRemark',
          id: 10,
          order: 10,
          checked: true,
          width: 230,
          fixed: 'left',
        },
        {
          name: '紧急程度',
          label: '紧急程度',
          prop: 'degreeToName',
          id: 1,
          order: 1,
          checked: true,
          width: 119,
          fixed: false,
        }, {
          name: '状态',
          label: '状态',
          prop: 'currStateToName',
          id: 2,
          order: 2,
          checked: true,
          width: 102,
          fixed: false,
        }, {
          name: '影响范围',
          label: '影响范围',
          prop: 'rangeTypeToName',
          id: 3,
          order: 3,
          checked: true,
          width: 137,
          fixed: false,
        }, {
          name: '报修时间',
          label: '报修时间',
          prop: 'createTime',
          id: 5,
          order: 5,
          checked: true,
          width: 227,
          fixed: false,
        }, {
          name: '报修电话',
          label: '报修电话',
          prop: 'phone',
          id: 4,
          order: 4,
          checked: true,
          width: 140,
          fixed: false,
        }, {
          name: '报修科室',
          label: '报修科室',
          prop: 'deptName',
          id: 6,
          order: 6,
          checked: true,
          width: 124,
          fixed: false,
        }, {
          name: '故障来源',
          label: '故障来源',
          prop: 'sourceToName',
          id: 7,
          order: 7,
          checked: true,
          width: 120,
          fixed: false,
        }, {
          name: '坐席人',
          label: '坐席人',
          prop: 'receptionName',
          id: 8,
          order: 8,
          checked: true,
          width: 120,
          fixed: false,
        }, {
          name: '建单人',
          label: '建单人',
          prop: 'createUserName',
          id: 9,
          order: 9,
          checked: true,
          width: 120,
          fixed: false,
        }, {
          name: '处理人',
          label: '处理人',
          prop: 'makeUserName',
          id: 10,
          order: 10,
          checked: true,
          width: 120,
          fixed: false,
        },
      ];
    },
  },
  async mounted() {
    this.init();
    this.$refs.pureTable.afterFetchData = this.afterFetchData;
    this.$store.state['TICKET_SERVICE_DESK'].ws = new PureWebsocket({
      url: `${process.env.VUE_APP_WS_URL}?token=${this.$store.state['APP_LOGIN'].accessToken}`,
    });
    this.$store.state['TICKET_SERVICE_DESK'].ws.onMessage(this.onWebsocketMessage);
  },
  async created() {
    // this.columns = this.callRecordTableColumn;
    this.columns = this.ticketTableColumn;

    // setTimeout(() => {
    //   this.dealPopInfo({
    //     createTime: '2024-02-21 10:48:53',
    //     orderNum: 'JYW-O202402210003',
    //     phone: '18080022848',
    //     place: '研发中心1楼201',
    //     user: '黑子桑',
    //   });
    // }, 3000);
    // setTimeout(() => {
    //   this.dealPopInfoIng({
    //     orderNum: 'JYW-O202402210003',
    //     phone: '18080022848',
    //     place: '研发中心1楼201',
    //     user: '黑子桑',
    //   });
    // }, 6000);
    // setTimeout(() => {
    //   this.dealPhoneHangup({
    //     orderNum: 'JYW-O202402210003',
    //     phone: '18080022848',
    //     place: '研发中心1楼201',
    //     user: '黑子桑',
    //   });
    // }, 9000);
  },

  methods: {
    onCreateCall(data, index) {
      this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible = false;
      this.$store.state['TICKET_SERVICE_DESK'].unrevivedData.splice(index, 1);
      this.onCreateTicket('byPop', data);
    },
    isBackTicket(row) {
      return row.makeState === 'back';
    },
    onClose() {
      this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible = false;
      // this.$store.state['TICKET_SERVICE_DESK'].unrevivedData = [];
    },
    onOpen() {
      this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible = true;
    },
    async onSeat() {
      await this.$confirm('你正在进行坐席下线操作，是否确认下线？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
      });
      this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 16, data: [], });
    },
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
          // 弹屏信息 -- 来电
        case 12:
          this.dealPopInfo(body);
          break;
        case 13:
          this.dealPopInfoIng(body);
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
        // 呼叫转移或微信报修通知变更
        case 19:
          this.dealServiceMessage(body);
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
    // 处理弹屏信息 -- 来电
    dealPopInfo(data) {
      // if (this.$store.state['TICKET_SERVICE_DESK'].openedDrawerOrDialogCount > 0) {
      this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible = true;
      this.$store.state['TICKET_SERVICE_DESK'].unrevivedData.push({ ...data, type: 1, });
      // } else {
      //   this.onCreateTicket('byPop', data);
      // }
    },
    dealPopInfoIng(data) {
      const index = findIndex(this.$store.state['TICKET_SERVICE_DESK'].unrevivedData, (item) => item.orderNum === data.orderNum);
      if (index >= 0) {
        this.$store.state['TICKET_SERVICE_DESK'].unrecivedPanelVisible = true;
        this.isOnCalling = true;
        this.$store.state['TICKET_SERVICE_DESK'].unrevivedData.splice(index, 1, {
          ...this.$store.state['TICKET_SERVICE_DESK'].unrevivedData[index],
          type: 2,
        });
      }
    },
    // 处理电话挂断
    dealPhoneHangup(data) {
      const index = findIndex(this.$store.state['TICKET_SERVICE_DESK'].unrevivedData, (item) => item.orderNum === data.orderNum);
      if (index >= 0) {
        this.isOnCalling = false;
      }
    },
    // 处理服务台消息推送
    dealServiceMessage(body) {
      this.$notify({
        title: '提示',
        message: body,
        duration: 0,
      });
    },
    // 处理当前坐席信息
    async dealArtificialSeatInfo(data) {
      // if (Object.keys(data).length === 0) {
      //   this.notline = 'notOnline';
      //   return;
      // }
      this.seatType = 'ARTIFICIAL_SEAT';
      const phone = await this.$store.dispatch('TICKET_SERVICE_DESK/INIT_ONLINE_INFO', data);
      this.$store.state['TICKET_SERVICE_DESK'].ws.send({ code: 16, data: phone, });
    },
    // 处理坐席变更
    dealArtificialSeatChange(data) {
      this.seatType = 'ARTIFICIAL_SEAT';
      this.$store.dispatch('TICKET_SERVICE_DESK/UPDATE_ONLINE_INFO', data);
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
        component: () => <SeatSettingDialog currentSeatType={this.seatType} data={data} onDone={this.cancle}/>,
      });
    },
    cancle() {},
    init() {
      this.$nextTick(() => {
        this.$refs.pureTable.handleCurrentChange(1);
      });
    },
    onTemplateTypeChange(type) {
      // 属于通话记录的模板
      // 电话报修-phoneCreate
      // 已接-pickedUp
      // 未接-missed
      // 待建单-untenited
      // 电话找人-findSomeone 与普通通话记录表头不一样
      const callRecordTemplate = [
        'PHONE_CREATE',
        'PICKED_UP',
        'MISSED',
        'UNTENITED',
        'FIND_SOMEONE',
      ];
      if (callRecordTemplate.includes(type)) {
        this.tableColumnType = 'callRecord';
        this.columns = this.callRecordTableColumn;
        this.listApi = ServiceDeskApi.callRecordList;
      } else {
        this.tableColumnType = 'ticket';
        this.columns = this.ticketTableColumn;
        this.listApi = ServiceDeskApi.list;
      }
      this.queryCondition.temp = type;
      this.$nextTick(() => {
        this.init();
      });
    },
    async afterFetchData() {
      const rs = await ServiceDeskApi.redInfo({ ...this.queryCondition, });
      this.redData = Object.assign({}, this.redData, rs);
    },
    onFlowChartPanelTransitionEnd() {
      setTimeout(() => {
        this.$refs.pureTable.setTableMaxHeight();
      }, 100);
    },
    onToggleQueryCondition() {
      this.queryConditionExpand = !this.queryConditionExpand;
      this.$nextTick(() => {
        this.$refs.pureTable.setTableMaxHeight();
      });
    },
    onQueryRecord() {
      this.queryCondition.keyword = this.queryConditionTemp.recordQuery;
      this.queryCondition.createInfoStartDate = this.queryConditionTemp.createInfoDate?.[0];
      this.queryCondition.createInfoEndDate = this.queryConditionTemp.createInfoDate?.[1];
      this.queryCondition.dealType = this.queryConditionTemp.dealType;
      this.queryCondition.userList = this.queryConditionTemp.userList;
      this.queryCondition.hospitalList = this.queryConditionTemp.hospitalList;
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    onResetRecord() {
      this.queryConditionTemp.recordQuery = null;
      this.queryConditionTemp.createInfoDate = [];
      this.queryConditionTemp.userList = [];
      this.queryConditionTemp.hospitalList = [];
      this.queryConditionTemp.dealType = null;
      this.onQueryRecord();
    },
    onQueryTicket() {
      this.queryCondition.keyword = this.queryConditionTemp.ticketQuery;
      this.queryCondition.createInfoStartDate = this.queryConditionTemp.ticketCreateInfoDate?.[0];
      this.queryCondition.createInfoEndDate = this.queryConditionTemp.ticketCreateInfoDate?.[1];
      this.queryCondition.createUserList = this.queryConditionTemp.createUserList;
      this.queryCondition.degree = this.queryConditionTemp.degree;
      this.queryCondition.rangeType = this.queryConditionTemp.rangeType;
      this.queryCondition.source = this.queryConditionTemp.source;
      this.queryCondition.orderState = this.queryConditionTemp.orderState;
      this.queryCondition.makeUserList = this.queryConditionTemp.makeUserList;
      this.queryCondition.serverUserList = this.queryConditionTemp.serverUserList;
      this.queryCondition.hospitalList = this.queryConditionTemp.ticketHospitalList;
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    onResetTicket() {
      this.queryConditionTemp.ticketQuery = null;
      this.queryConditionTemp.ticketCreateInfoDate = [];
      this.queryConditionTemp.createUserList = [];
      this.queryConditionTemp.degree = null;
      this.queryConditionTemp.rangeType = null;
      this.queryConditionTemp.source = null;
      this.queryConditionTemp.orderState = null;
      this.queryConditionTemp.makeUserList = [];
      this.queryConditionTemp.serverUserList = [];
      this.queryConditionTemp.ticketHospitalList = [];
      this.onQueryTicket();
    },
    /* 催单*/
    async editReminder(row) {
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
@import "~@/common/styles/theme/handle.scss";
@import "../common/ticket.scss";
.phoneDialog {
  position: fixed;
  width: 300px;
  height: 400px;
  bottom: 16px;
  right: 16px;
  background-color: #fff;
  z-index: 9999;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.onCalling {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 9999;
  cursor: pointer;
}
.dialog-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #DDE9E8;
  font-size: 18px;
  font-weight: bold;
  font-family: Source Han Sans CN-Bold, Source Han Sans CN;
}
.dialog-close {
  font-size: 16px;
  color: #666;
  cursor: pointer;
}
.dialog-content {
  height: calc(100% - 50px);
  padding: 16px;
  margin-right: 4px;
  overflow-y: scroll;
}
.dialog-item {
  padding-top: 5px;
}
.item-top, .item-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-bottom {
  margin-top: 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(136, 136, 136, .2);
}
.item-unCall {
  font-size: 16px;
  color: rgb(255, 159, 69);
  background-color: rgb(255, 241, 219);
  padding: 2px 5px;
  margin-right: 5px;
}
.item-font {
  font-size: 16px;
  color: #2d405e;
}
.socket-error {
 color: #f56c6c;
 margin-right: 10px;
}
.base-margin-left {
  display: flex;
  align-items: center;
}
.pure {
  padding: 0px !important;

  .header {
    @include background_color_imp('color-bg');
    height: auto !important;
  }

  .el-main {
    padding: 16px;
  }

  .agent {
    font-size: 14px;
    margin-right: 16px;
    @include font_color_imp('color-text-minor');

    &-value {
      @include font_color_imp('color-primary');
    }
  }

  .service-desk {
    @include background_color_imp('color-assist-4');
    padding: 6px;
  }

  .item {
    width: 240px;
    margin-right: 16px;
    margin-bottom: 16px;
  }

  .service-detail {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @include font_color_imp('color-primary');
    font-size: 14px;

    .item {
      text-align: center;
      width: 108px;
      display: inline-block;
      margin: 0;
      @include font_color_imp('color-text-minor');

      span {
        @include font_color_imp('color-primary')
      }
    }
  }
}

</style>

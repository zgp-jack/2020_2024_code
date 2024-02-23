<template>
  <pure-table
    ref="pureTable"
    :columns="filteredColumns"
    :list-api="listApi"
    :operation-column-width="250"
    :query-condition="queryCondition"
    style="padding: 0 10px"
  >
    <template slot="header">

      <el-row
        class="base-margin-top"
        type="flex"
      >
        <el-col :span="24">
          <template
            v-if="tableColumnType==='WAIT_DELIVERY'"
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
              v-model="queryConditionTemp.rangeType"
              class="item"
              dic-key="obs_fault_range"
              placeholder="影响范围"
              size="mini"
            />
            <dic-select
              v-model="queryConditionTemp.source"
              class="item"
              dic-key="obs_fault_source"
              placeholder="故障来源"
              size="mini"
            />
            <user-select
              v-model="queryConditionTemp.makeUserList"
              class="item"
              collapse-tags
              multiple
              placeholder="处理人"
              size="mini"
            />
            <user-select
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
          </template>
          <template
            v-if="tableColumnType==='UNTENITED'"
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
            />
            <dic-select
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
        <!-- <el-col
              :span="2"
              class="text-align-end"
            >
              <pure-button
                icon="add"
                label="创建工单"
                @click="onCreateTicket()"
              />
            </el-col> -->
      </el-row>
      <el-radio-group v-model="tableColumnType" class="button-group" size="mini" @change="changeCurrState">
        <el-radio-button label="WAIT_DELIVERY">待派单</el-radio-button>
        <el-radio-button label="UNTENITED">待建单</el-radio-button>
      </el-radio-group>
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
      <span
        v-else-if="prop ==='degreeToName'"
        :class="['degree','degree--'+row.degree]"
      >
        {{ row[prop] || '-' }}
      </span>
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
      slot="operationColumn"
      slot-scope="{row}"
    >
      <template v-if="tableColumnType === 'UNTENITED'">
        <pure-more-button :slice-number="3 ">
          <pure-button
            v-if="row.callType===0&&!row.dealType"
            v-auth="'obstacles:server:add'"
            label="建单"
            type="text"
            @click="onCreateTicket('byCallRecord',row)"
          />
          <pure-button
            v-if="row.type===0&&!row.dealType"
            v-auth="'obstacles:server:deal:invalid'"
            label="电话找人"
            type="text"
            @click="onFindPerson(row.id)"
          />
          <pure-button
            v-if="!row.dealType"
            v-auth="'obstacles:server:deal:find'"
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
        <pure-more-button :slice-number="4">
          <pure-button
            v-if="canDispatchState.includes(row['currState'])"
            v-auth="'obstacles:server:allocate'"
            label="派单"
            type="text"
            @click="onDispatchTicket(row.orderNum)"
          />
          <pure-button
            v-if="canUpdateAnswerAndFaultInfoState.includes(row['currState'])"
            v-auth="'obstacles:server:edit'"
            label="编辑"
            type="text"
            @click="onUpdateAnswerAndFaultInfo(row.orderNum)"
          />
          <!--              屏蔽打印-->
          <!--          <pure-button
            label="打印"
            type="text"
            @click="onPrintTicket(row.id)"
          />-->
          <pure-button
            v-if="canEndState.includes(row['currState'])"
            v-auth="'obstacles:server:termination,obstacles:mine:order:termination'"
            label="终止"
            text-color="warning"
            type="text"
            @click="onUpdateTicket(row.orderNum, 'endTermination')"
          />
        </pure-more-button>
      </template>
    </template>
  </pure-table>
</template>
<script>
import TicketMixin from '@/features/ticket/mixin';
import PendingApi from '../api';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import DeptMultiCascader from '@/features/system/departmentManagement/components/deptMultiCascader.vue';
export default {
  name: 'Repair',
  components: {
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
      tableColumnType: 'WAIT_DELIVERY',
      listApi: PendingApi.waitDispatch,
      queryCondition: {
        temp: 'WAIT_DELIVERY',
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
    };
  },
  computed: {
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
    ticketTableColumn() {
      return [{
        name: '故障描述',
        label: '故障描述',
        prop: 'faultRemark',
        id: 10,
        order: 10,
        checked: true,
        width: 230,
        fixed: 'left',
      }, {
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
        name: '工单来源',
        label: '工单来源',
        prop: 'sourceToName',
        id: 7,
        order: 7,
        checked: true,
        width: 120,
        fixed: false,
      }, {
        name: '建单人',
        label: '建单人',
        prop: 'createUserName',
        id: 8,
        order: 8,
        checked: true,
        width: 120,
        fixed: false,
      }, {
        name: '处理人',
        label: '处理人',
        prop: 'makeUserName',
        id: 9,
        order: 9,
        checked: true,
        width: 120,
        fixed: false,
      },
      ];
    },
  },
  mounted() {
    // 执行了activated函数
    this.init('WAIT_DELIVERY');
  },
  methods: {
    changeCurrState(type) {
      this.init(type);
    },
    init(type) {
      this.queryCondition.temp = type;
      if (type === 'WAIT_DELIVERY') {
        this.columns = this.ticketTableColumn;
        this.listApi = PendingApi.waitDispatch;
      } else {
        this.columns = this.callRecordTableColumn;
        this.listApi = PendingApi.waitCreate;
      }
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
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
        this.$refs.pureTable.onSearch();
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
        this.$refs.pureTable.onSearch();
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
  },
};
</script>
<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";
@import "@/features/ticket/common/ticket.scss";
.item {
    width: 240px;
    margin-right: 16px;
    margin-bottom: 16px;
}
</style>

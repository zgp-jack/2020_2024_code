<template>
  <TableLayout>
    <pure-table
      ref="pureTable"
      :columns="filteredColumns"
      :list-api="listApi"
      :query-condition="queryCondition"
      style="padding: 16px 10px"
    >

      <template slot="header">
        <el-row>
          <el-input
            v-model="queryConditionTemp.keyword"
            class="item"
            placeholder="故障描述/工单号/报修电话"
          >
            <i
              slot="prefix"
              class="el-icon-search el-input__icon"
            />
          </el-input>
          <el-date-picker
            v-model="queryConditionTemp.createInfoDate"
            class="item"
            end-placeholder="报修时间"
            range-separator="-"
            size="mini"
            start-placeholder="报修时间"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
          <user-select v-model="queryConditionTemp.createUserList" placeholder="建单人" multiple collapse-tags size="mini" class="item" />
          <use-department-list v-model="queryConditionTemp.hospitalList" placeholder="报修院区/科室" :props="props" size="mini" class="item" />
          <dic-select v-model="queryConditionTemp.degree" dic-key="obs_fault_degree" placeholder="紧急程度" size="mini" class="item" />
          <dic-select v-show="queryConditionExpand" v-model="queryConditionTemp.rangeType" dic-key="obs_fault_range" placeholder="影响范围" size="mini" class="item" />
          <dic-select v-show="queryConditionExpand" v-model="queryConditionTemp.source" dic-key="obs_fault_source" placeholder="故障来源" size="mini" class="item" />
          <el-date-picker
            v-show="queryConditionExpand"
            v-model="queryConditionTemp.createFaultDate"
            class="item"
            end-placeholder="建单时间"
            range-separator="-"
            size="mini"
            start-placeholder="建单时间"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
          <pure-button
            icon="search"
            label="查询"
            size="mini"
            type="minor"
            @click="onSearch"
          />
          <pure-button
            icon="reset"
            label="重置"
            size="mini"
            type="patch"
            @click="onReset"
          />
          <pure-button
            :icon="expandIcon"
            :label="expandLabel"
            icon-position="right"
            size="mini"
            type="text"
            @click="onToggleQueryCondition"
          />
        </el-row>
        <el-radio-group v-model="queryConditionTemp.currState" class="button-group" size="mini" @change="changeCurrState">
          <el-radio-button :label="''">全部 {{ orderCount.all }}</el-radio-button>
          <el-radio-button label="wait_accept">待接单 {{ orderCount.waitAccept }}</el-radio-button>
          <el-radio-button label="processing">处理中 {{ orderCount.processing }}</el-radio-button>
          <el-radio-button label="wait_audit">待审核 {{ orderCount.waitAudit }}</el-radio-button>
          <el-radio-button label="not_pass_audit">审核未通过 {{ orderCount.notPassAudit }}</el-radio-button>
          <el-radio-button label="wait_appraisal">待评价 {{ orderCount.waitAppraisal }}</el-radio-button>
          <el-radio-button label="suspended">已暂停 {{ orderCount.suspended }}</el-radio-button>
          <el-radio-button label="terminated">已终止 {{ orderCount.terminated }}</el-radio-button>
          <el-radio-button label="ended">已完成 {{ orderCount.ended }}</el-radio-button>
        </el-radio-group>
      </template>
      <template slot="indexColumn">
        序号
      </template>
      <template
        slot="columns"
        slot-scope="{row,prop}"
      >
        <span
          v-if="prop==='faultRemark'"
          class="fault-remark"
          @click="onViewTicket(row.orderNum)"
        >
          {{ row[prop] }}
        </span>
        <span v-else>
          {{ row[prop] }}
        </span>

      </template>
      <template
        slot="operationColumn"
        slot-scope="{row}"
      >
        <pure-more-button :slice-number="3">
          <pure-button
            label="查看"
            type="text"
            @click="onViewTicket(row.orderNum)"
          />
          <!--              屏蔽打印-->
          <!--          <pure-button
            label="打印"
            type="text"
            @click="onPrintTicket(row.id)"
          />-->
          <!--      待接单    -->
          <pure-button
            v-if="row['currState']==='wait_accept'"
            v-auth="'obstacles:mine:order:receive'"
            label="接单"
            type="text"
            @click="onAcceptTicket(row.orderNum, initCount)"
          />
          <pure-button
            v-if="row['currState']==='wait_accept'"
            v-auth="'obstacles:mine:order:reback'"
            label="退单"
            type="text"
            @click="onMineSendTicketBack(row.orderNum)"
          />
          <!--     处理中     -->
          <pure-button
            v-if="['processing','not_pass_audit'].includes(row.currState)"
            v-auth="'obstacles:mine:order:make'"
            label="处理"
            type="text"
            @click="onMineUpdateTicket(row.orderNum, 'making')"
          />
          <pure-button
            v-if="row['currState']==='processing'"
            v-auth="'obstacles:mine:order:suspend'"
            label="暂停"
            text-color="warning"
            type="text"
            @click="onMineUpdateTicket(row.orderNum, 'suspend')"
          />
          <pure-button
            v-if="['processing','suspended'].includes(row.currState)"
            v-auth="'obstacles:mine:order:termination'"
            label="终止"
            text-color="warning"
            type="text"
            @click="onMineUpdateTicket(row.orderNum, 'endTermination')"
          />
          <!--    已终止     -->
          <pure-button
            v-if="row['currState']==='terminated'"
            v-auth="'obstacles:mine:order:restart'"
            label="重启"
            type="text"
            @click="onRestartTerminatedTicket(row.orderNum,initCount)"
          />
          <!--     已暂停     -->
          <pure-button
            v-if="row.currState==='suspended'"
            v-auth="'obstacles:mine:order:open'"
            label="开启"
            type="text"
            @click="onOpenSuspendedTicket(row.orderNum, initCount)"
          />
          <!--    已完成      -->
          <pure-button
            v-if="row['currState']==='ended'"
            v-auth="'obstacles:mine:order:knowledge'"
            label="生成知识"
            type="text"
            @click="onGenerat(row)"
          />

        </pure-more-button>

      </template>
    </pure-table>
  </TableLayout>
</template>

<script>
import PureTable from '@/common/components/table';
import MineApi from './api';
import TicketMixin from '../mixin';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import KnowledgeDrawer from '@/features/library/applyManagement/components/knowledge.vue';
import MineTicketDrawer from '@/features/ticket/common/drawer/ticket.vue';

export default {
  name: 'TicketMine',
  components: {
    UseDepartmentList,
    PureTable,
    DicSelect,
    UserSelect,
  },
  mixins: [
    TicketMixin,
  ],
  data() {
    return {
      props: { multiple: true, },
      filteredColumns: [
        {
          label: '故障描述',
          prop: 'faultRemark',
        },
        {
          label: '工单号',
          prop: 'orderNum',
        },
        {
          label: '工单状态',
          prop: 'currStateToName',
        },
        {
          label: '报修科室',
          prop: 'deptName',
        },
        {
          label: '故障分类',
          prop: 'faultTypeToName',
        },
        {
          label: '影响范围',
          prop: 'rangeTypeToName',
        },
        {
          label: '报修电话',
          prop: 'phone',
        },
        {
          label: '报修时间',
          prop: 'createTime',
        },
        {
          label: '建单人',
          prop: 'createUserToName',
        },
        {
          label: '建单时间',
          prop: 'createFaultTime',
        },
        {
          label: '故障来源',
          prop: 'sourceToName',
        },
      ],
      queryCondition: {
      },
      queryConditionTemp: {
        currState: '',
        keyword: '',
        degree: null,
        rangeType: null,
        source: null,
        createInfoDate: [],
        createFaultDate: [],
        createUserList: [],
        hospitalList: [],
      },
      listApi: MineApi.list,
      queryConditionExpand: true,
      orderCount: {
        all: 0,
        waitAccept: 0,
        processing: 0,
        waitAudit: 0,
        notPassAudit: 0,
        waitAppraisal: 0,
        suspended: 0,
        terminated: 0,
        ended: 0,
      },
    };
  },
  computed: {
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
  },
  mounted() {
    this.initList();
    this.initCount();
  },
  beforeCreate() {
  },
  methods: {
    onGenerat(row) {
      const data = {
        title: row.faultRemark?.slice(0, 30),
        faultType: row.faultType,
        question: row.faultRemark,
        enclosure: row.enclosure,
        answer: row.answer,
      };
      this.$drawer({
        component: () => <KnowledgeDrawer operatorType='CREATE' initData={data} onDone={this.cancel}/>,
        width: '900px',
      });
    },
    cancel() {
      this.$emit('done');
    },
    async initCount() {
      const res = await MineApi.count();
      this.orderCount = res;
    },
    initList() {
      this.$refs.pureTable.fetchData();
    },
    onDone() {
      this.initList();
      this.initCount();
    },
    onSearch() {
      this.queryCondition = {
        ...this.queryConditionTemp,
      };
      this.queryCondition.createInfoStartDate = this.queryConditionTemp.createInfoDate?.[0];
      this.queryCondition.createInfoEndDate = this.queryConditionTemp.createInfoDate?.[1];
      this.queryCondition.createFaultStartDate = this.queryConditionTemp.createFaultDate?.[0];
      this.queryCondition.createFaultEndDate = this.queryConditionTemp.createFaultDate?.[1];
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onReset() {
      this.queryConditionTemp = {};
      this.queryCondition = {};
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    changeCurrState() {
      this.onSearch();
    },
    onToggleQueryCondition() {
      this.queryConditionExpand = !this.queryConditionExpand;
      this.$nextTick(() => {
        this.$refs.pureTable.setTableMaxHeight();
      });
    },
    /**
     *  我的工单退回工单
     * @param {String} ticketId 工单编号
     */
    async onMineSendTicketBack(ticketId) {
      this.$drawer({
        width: '87.917%',
        component: () => <MineTicketDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType='back'
          onDone={this.onDone}
        />,
      });
    },
    /**
     * 更新(处理)工单
     * @param {String} ticketId 工单编号
     * @param {String} dealType 工单操作 完成-complete, 暂停工单-suspend, 终止工单-endTermination, 转交-forward, 退回-back, 处理-making, 工单升级-endUpgrade, 多人协作-assist
     */
    async onMineUpdateTicket(ticketId, dealType) {
      this.$drawer({
        width: '87.917%',
        component: () => <MineTicketDrawer
          operatorType='UPDATE'
          id={ticketId}
          dealType={dealType}
          onDone={this.onDone}
        />,
      });
    },
  },
};
</script>

<style lang='scss'
  scoped
>
@import "~@/common/styles/theme/handle.scss";

.fault-remark {
  @include font_color_imp('color-primary');
  cursor: pointer;
}

.button-group {
  margin: 10px 0;
}

.item {
  width: 240px;
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>

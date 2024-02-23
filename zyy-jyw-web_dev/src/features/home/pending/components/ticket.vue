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
            v-model="queryConditionTemp.keywords"
            class="item"
            placeholder="故障描述/工单号/报修电话"
          >
            <i
              slot="prefix"
              class="el-icon-search el-input__icon"
            />
          </el-input>
          <el-date-picker
            v-model="queryConditionTemp.repairTime"
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
            v-model="queryConditionTemp.createTime"
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
            v-if="row['currState']==='wait_audit'"
            v-auth="'obstacles:mine:order:enact'"
            label="通过"
            type="text"
            @click="onConfirm(row)"
          />
          <pure-button
            v-if="row['currState']==='wait_audit'"
            v-auth="'obstacles:mine:order:reject'"
            label="驳回"
            text-color="warning"
            type="text"
            @click="onReject(row)"
          />
          <pure-button
            v-if="row['currState']==='wait_accept'"
            v-auth="'obstacles:mine:order:receive'"
            label="接单"
            type="text"
            @click="onAcceptTicket(row.orderNum)"
          />
          <pure-button
            v-if="row['currState']==='wait_accept'"
            v-auth="'obstacles:mine:order:reback'"
            label="退单"
            type="text"
            @click="onSendTicketBack(row.orderNum)"
          />
          <pure-button
            v-if="['processing','not_pass_audit'].includes(row.currState)"
            v-auth="'obstacles:mine:order:make'"
            label="处理"
            type="text"
            @click="onUpdateTicket(row.orderNum, 'making')"
          />
          <pure-button
            v-if="row.currState==='suspended'"
            v-auth="'obstacles:mine:order:restart,obstacles:server:restart'"
            label="重启"
            type="text"
            @click="onOpenSuspendedTicket(row.orderNum)"
          />
          <!--              屏蔽打印-->
          <!--          <pure-button
            label="打印"
            type="text"
            @click="onPrintTicket(row.infoId)"
          />-->
          <pure-button
            label="查看"
            type="text"
            @click="onViewTicket(row.orderNum)"
          />
        </pure-more-button>

      </template>
    </pure-table>
  </TableLayout>
</template>

<script>
import PureTable from '@/common/components/table';
import PendingApi from '../api';
import TicketMixin from '@/features/ticket/mixin';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import DialogReject from '@/features/ticket/myReviewed/dialog/reject.vue';

export default {
  name: 'Ticket',
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
          label: '故障分类',
          prop: 'faultTypeToName',
        },
        {
          label: '影响范围',
          prop: 'rangeTypeToName',
        },
        {
          label: '报修时间',
          prop: 'createTime',
        },
        {
          label: '报修院区/科室 ',
          prop: 'deptName',
        },
      ],
      queryCondition: {
      },
      queryConditionTemp: {
        keywords: '',
        degree: null,
        rangeType: null,
        source: null,
        repairTime: [],
        createTime: [],
        createUserList: [],
        hospitalList: [],
        currState: '',
      },
      listApi: PendingApi.handleRepair,
      queryConditionExpand: true,
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
    // 执行了activated函数
    this.initList();
  },
  methods: {
    initList() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    onSearch() {
      this.queryCondition = {
        ...this.queryConditionTemp,
      };
      this.queryCondition.repairStartTime = this.queryConditionTemp.repairTime?.[0];
      this.queryCondition.repairEndTime = this.queryConditionTemp.repairTime?.[1];
      this.queryCondition.createStartTime = this.queryConditionTemp.createTime?.[0];
      this.queryCondition.createEndTime = this.queryConditionTemp.createTime?.[1];
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onReset() {
      this.queryConditionTemp = {};
      this.queryCondition = {};
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    },
    /* changeCurrState() {
      this.onSearch();
    }, */
    onToggleQueryCondition() {
      this.queryConditionExpand = !this.queryConditionExpand;
      this.$nextTick(() => {
        this.$refs.pureTable.setTableMaxHeight();
      });
    },
    onReject(row) {
      this.$dialog({
        component: () => <DialogReject orderNum={row.orderNum} onDone={this.onSearch} />,
      });
    },
    async onConfirm(row) {
      await PendingApi.pass(row.orderNum);
      this.$message.success('通过成功');
      this.initList();
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

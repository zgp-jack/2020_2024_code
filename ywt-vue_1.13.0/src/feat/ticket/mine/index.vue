<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-07 14:23:53
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2023-02-13 16:21:40
 * @Description:工单-我的工单
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :query-condition="queryCondition"
        :list-api="listApi"
      >
        <template slot="header">
          <el-row
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >
            <pure-button-group style="display:inline" :options="groupBtnOptions" default-active="处理中" @change="onTabChange" />
          </el-row>
          <el-row
            type="flex"
            align="middle"
            class="base-margin-left base-margin-top"
          >

            <el-col :span="4">
              <retrieval class="base-margin-right" @change="onRetrievalChange" />
            </el-col>
            <el-col :span="4">
              <el-select v-model="hospitalId" placeholder="所有报修院区" collapse-tags multiple clearable style="width:200px" size="mini" class="base-margin-right" @change="onHospitalChange">
                <el-option
                  v-for="item in hospitalList"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.id"
                />
              </el-select>
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
            <el-tabs type="border-card">
              <el-tab-pane label="表头设置">
                <pure-draggable :data="columns" :has-checked="true" @change="onTableColumnChange" />
              </el-tab-pane>
              <el-tab-pane label="排序规则">
                <pure-draggable :data="ticketRule" @change="onTicketRuleChange" />
              </el-tab-pane>
            </el-tabs>
            <i slot="reference" class="el-icon-s-operation" />
          </el-popover>
          序号
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
        <template slot="operationColumn" slot-scope="{row}">
          <more-button :slice-number="3 ">
            <pure-button
              v-if="row['currState']==='wait_accept'"
              type="text"
              label="接单"
              @click="onAcceptTicket(row.orderNum)"
            />

            <pure-button
              v-if="row['currState']==='wait_accept'"
              type="text"
              label="退回"
              @click="onSendTicketBack(row.orderNum)"
            />
            <pure-button
              v-if="['processing','not_pass_audit'].includes(row.currState)"
              type="text"
              label="处理"
              @click="onUpdateTicket(row.orderNum, 'making')"
            />
            <pure-button
              v-if="row.currState==='suspended'"
              type="text"
              label="开启"
              @click="onOpenSuspendedTicket(row.orderNum)"
            />
            <pure-button
              v-if="showReviewBtn(row)"
              type="text"
              label="通过"
              @click="onPassAudit(row.orderNum)"
            />
            <pure-button
              v-if="showReviewBtn(row)"
              type="text"
              label="未通过"
              @click="onNotPassAudit(row.orderNum)"
            />
            <pure-button
              v-if="row.currState==='terminated'"
              type="text"
              label="重启"
              @click="onRestartTerminatedTicket(row.orderNum)"
            />
            <pure-button
              type="text"
              label="打印"
              @click="onPrintTicket(row.id)"
            />
            <pure-button
              type="text"
              label="查看"
              @click="onViewTicket(row.orderNum)"
            />
          </more-button>
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import MineApi from './api';
import TicketMixin from '../mixin';
import {
  ticketState,
  callRecordDealType,
  faultRemarkFormatter,
} from '../filter';
import DepartmentApi from '@/feat/system/department/api';
import PureTable from '@/feat/component/pureTable';
import MyAudio from '@/components/audio/audio';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import PureTag from '@/components/tag/tag.vue';
import PureDraggable from '@/components/draggable';
import PureButtonGroup from '@/components/button/buttonGroup.vue';
import MoreButton from '@/components/button/moreButton';
import {
  mapGetters,
} from 'vuex';
export default {
  name: 'BzWdgd',
  components: {
    PureTable,
    MyAudio,
    LinkedButton,
    PureTag,
    PureDraggable,
    PureButtonGroup,
    MoreButton,
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
      listApi: MineApi.list,
      queryCondition: {
        query: null,
        sortTemp: null,
        currState: 'processing',
        hospitalId: null,
      },
      ticketRule: this.$store.state.ticketMine.ticketRule,
      hospitalList: [],
      hospitalId: null,
      groupBtnOptions: [{
        count: null,
        name: '处理中',
      }, {
        count: null,
        name: '待接单',
      }, {
        count: null,
        name: '待审核',
      }, {
        count: null,
        name: '审核未过',
      }, {
        count: null,
        name: '待评价',
      },
      {
        count: null,
        name: '已终止',
      },
      {
        count: null,
        name: '已结束',
      }
      ],
    };
  },
  computed: {
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
    ticketTableColumn() {
      return this.$store.state.ticketMine.ticketTableColumn;
    },
    ...mapGetters([
      'userInfo'
    ]),
  },
  created() {
    console.log('hello');
    this.fetchHospital();
    this.sortTemp = this.genSortTemp(this.ticketRule);
    this.queryCondition.sortTemp = this.genSortTemp(this.ticketRule);
    this.columns = this.ticketTableColumn;
    this.updateRedData();
  },
  activated() {
    this.updateRedData();
  },
  methods: {
    onRetrievalChange(val) {
      this.queryCondition.query = val;
    },
    onHospitalChange(val) {
      this.queryCondition.hospitalId = val?.join(',') || null;
    },
    // 表头设置变更
    async onTableColumnChange(newVal) {
      this.columns = newVal;
      this.$store.dispatch('ticketMine/UPDATE_TICKET_TABLE_COLUMN', newVal);
    },
    // 排序规则变更
    async onTicketRuleChange(newTicketRule) {
      this.ticketRule = newTicketRule;
      this.sortTemp = this.genSortTemp(newTicketRule);
      this.onPerformedOpertion();
      console.log(newTicketRule);
      this.$store.dispatch('ticketMine/UPDATE_TICKET_RULE', newTicketRule);
    },
    onPerformedOpertion() {
      this.$refs.pureTable.fetchData();
      this.updateRedData();
    },
    // 生成排序规则字符串
    genSortTemp(ticketRule) {
      return ticketRule.map(item => item.label).join(',') || null;
    },
    // 获取院区数据
    async fetchHospital() {
      const { list, } = await DepartmentApi.list({ pageNum: 0, pageSize: 99999, deptType: 1, state: 0, });
      this.hospitalList = list;
    },
    hasReviewPermission() {
      return this.userInfo.permissions.includes('ORDER_AUDIT');
    },
    showReviewBtn(row) {
      return this.hasReviewPermission() && row.currState === 'wait_audit';
    },
    onTabChange(val) {
      this.updateRedData();
      switch (val) {
        case '处理中':
          this.queryCondition.currState = 'processing';
          break;
        case '待接单':
          this.queryCondition.currState = 'wait_accept';
          break;
        case '待审核':
          this.queryCondition.currState = 'wait_audit';
          break;
        case '审核未过':
          this.queryCondition.currState = 'not_pass_audit';
          break;
        case '待评价':
          this.queryCondition.currState = 'wait_appraisal';
          break;
        case '已终止':
          this.queryCondition.currState = 'terminated';
          break;
        case '已结束':
          this.queryCondition.currState = 'ended';
          break;
      }
    },
    async updateRedData() {
      const redData = await MineApi.redData();
      this.groupBtnOptions = [{
        count: redData.processing || null,
        name: '处理中',
      }, {
        count: redData.waitAccept || null,
        name: '待接单',
      }, {
        count: redData.waitAudit || null,
        name: '待审核',
      }, {
        count: redData.notPassAudit || null,
        name: '审核未过',
      }, {
        count: redData.waitAppraisal || null,
        name: '待评价',
      },
      {
        count: redData.terminated || null,
        name: '已终止',
      },
      {
        count: redData.ended || null,
        name: '已结束',
      }
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
</style>

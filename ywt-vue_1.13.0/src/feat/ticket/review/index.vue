<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-09 11:44:42
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 17:21:22
 * @Description:工单-工单审核
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :query-condition="queryCondition"
        :list-api="listApi"
        selection
        @selection-change="onSelectionChange"
      >
        <template slot="header">
          <el-row
            type="flex"
            align="middle"
            class="query base-margin-left base-margin-top"
          >

            <pure-button
              class="base-margin-right"
              label="通过"
              @click="onMultiPassAudit"
            />
            <el-col class="query-condition">
              <el-form
                ref="form"
                size="mini"
                inline
                :model="queryForm"
              >
                <el-form-item prop="faultRemark">
                  <el-input v-model="queryForm.faultRemark" placeholder="故障描述" class="short-condition " clearable />
                </el-form-item>
                <el-form-item prop="hospitalId">
                  <el-select v-model="queryForm.hospitalId" placeholder="所有报修院区" collapse-tags multiple clearable class="short-condition">
                    <el-option
                      v-for="item in hospitalList"
                      :key="item.id"
                      :label="item.deptName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="faultType">
                  <fault-type-select
                    v-model="queryForm.faultType"
                    class="short-condition"
                  />
                </el-form-item>
                <el-form-item prop="teamIds">
                  <dept-has-team-cascader ref="deptHasTeamCascader" size="mini" class="short-condition" @change="onDeptHasTeamCascaderChanged" />
                </el-form-item>

                <el-form-item prop="infoCreateTime">
                  <el-date-picker
                    v-model="queryForm.infoCreateTime"
                    type="daterange"
                    start-placeholder="报修时间"
                    end-placeholder="报修时间"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    class="condition date"
                  />
                </el-form-item>
                <el-form-item prop="completeTime">
                  <el-date-picker
                    v-model="queryForm.completeTime"
                    type="daterange"
                    start-placeholder="完成时间"
                    end-placeholder="完成时间"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    class="condition date"
                  />
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="3">
              <span class="base-margin-right"><pure-button label="重置" type="wire-frame" @click="onResetForm" /></span>
              <pure-button label="查询" type="default" @click="onQuery" />

            </el-col>

            <!-- <el-col :span="4">
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
            </el-col> -->
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
          <pure-button
            type="text"
            label="通过"
            @click="onPassAudit(row.orderNum)"
          />
          <pure-button
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
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import ReviewApi from './api';
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
import DeptHasTeamCascader from '@/feat/system/department/component/deptHasTeamCascader.vue';
import {
  omitBy,
  isNil,
} from 'lodash';
export default {
  name: 'BzWdgd',
  components: {
    PureTable,
    MyAudio,
    LinkedButton,
    PureTag,
    PureDraggable,
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
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
      listApi: ReviewApi.list,
      queryCondition: {
        query: null,
        infoStartTime: null,
        infoEndTime: null,
        completeStartTime: null,
        completeEndTime: null,
        faultType: null,
        sortTemp: null,
        teamIds: null,
        hospitalId: null,
        departmentId: null,
        teamId: null,
      },
      ticketRule: this.$store.state.ticketReview.ticketRule,
      multipleSelection: [],
      hospitalList: [],
      hospitalId: null,
      queryForm: {
        faultRemark: null,
        faultType: null,
        infoCreateTime: [],
        completeTime: [],
        departmentId: null,
        teamId: null,
      },

    };
  },
  computed: {
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
    ticketTableColumn() {
      return this.$store.state.ticketReview.ticketTableColumn;
    },
  },
  created() {
    this.fetchHospital();
    this.sortTemp = this.genSortTemp(this.ticketRule);
    this.queryCondition.sortTemp = this.genSortTemp(this.ticketRule);
    this.columns = this.ticketTableColumn;
  },
  methods: {
    onResetForm() {
      this.queryForm.departmentId = null;
      this.queryForm.teamId = null;
      this.$refs.deptHasTeamCascader.clear();
      this.$refs.form.resetFields();
      this.onQuery();
    },
    onQuery() {
      const query = omitBy(this.queryForm, isNil);
      this.$refs.pureTable.currentPage = 0;
      this.queryCondition.infoStartTime = query.infoCreateTime?.[0] || null;
      this.queryCondition.infoEndTime = query.infoCreateTime?.[1] || null;
      this.queryCondition.completeStartTime = query.completeTime?.[0] || null;
      this.queryCondition.completeEndTime = query.completeTime?.[1] || null;
      this.queryCondition.query = query.faultRemark || null;
      this.queryCondition.faultType = query.faultType || null;
      this.queryCondition.teamIds = query.teamIds || null;
      this.queryCondition.hospitalId = query.hospitalId?.join(',') || null;
      this.queryCondition.departmentId = query.departmentId;
      this.queryCondition.teamId = query.teamId;
    },
    onRetrievalChange(val) {
      this.queryCondition.query = val;
    },
    onHospitalChange(val) {
      this.queryCondition.hospitalId = val?.join(',') || null;
    },
    // 表头设置变更
    async onTableColumnChange(newVal) {
      this.columns = newVal;
      this.$store.dispatch('ticketReview/UPDATE_TICKET_TABLE_COLUMN', newVal);
    },
    // 排序规则变更
    async onTicketRuleChange(newTicketRule) {
      this.ticketRule = newTicketRule;
      this.sortTemp = this.genSortTemp(newTicketRule);
      this.onPerformedOpertion();
      console.log(newTicketRule);
      this.$store.dispatch('ticketReview/UPDATE_TICKET_RULE', newTicketRule);
    },
    onPerformedOpertion() {
      this.$refs.pureTable.fetchData();
    },
    // 生成排序规则字符串
    genSortTemp(ticketRule) {
      return ticketRule.map(item => item.label).join(',') || null;
    },
    onSelectionChange(val) {
      this.multipleSelection = val;
    },
    onMultiPassAudit() {
      if (this.multipleSelection.length === 0) {
        return;
      }
      const ticketIds = this.multipleSelection.map(item => item.orderNum).join(',');
      this.onPassAudit(ticketIds);
    },
    // 获取院区数据
    async fetchHospital() {
      const { list, } = await DepartmentApi.list({ pageNum: 0, pageSize: 99999, deptType: 1, state: 0, });
      this.hospitalList = list;
    },
    onDeptHasTeamCascaderChanged(nodeData) {
      if (nodeData) {
        if (nodeData.type === 'department') {
          this.queryForm.departmentId = nodeData.id;
          this.queryForm.teamId = null;
        } else {
          this.queryForm.departmentId = null;
          this.queryForm.teamId = nodeData.id;
        }
      } else {
        this.queryForm.departmentId = null;
        this.queryForm.teamId = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
.query-condition {
  width: auto;

}
.query-btn {
  width:220px;
  padding-right: 25px;
  border-right: 1px solid #e6eaf2;
}

.query {
  .condition {
    width: 280px;
    &.date {
      width: 280px;
    }
  }
  .short-condition {
    width:180px;
  }
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>

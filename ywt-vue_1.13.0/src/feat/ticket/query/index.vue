<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-02-08 15:54:25
 * @LastEditors: Pure 305737824@qq.com
 * @LastEditTime: 2023-05-31 16:54:17
 * @Description:工单-工单查询
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
            class="query base-margin-left base-margin-top base-margin-right"
          >
            <el-col class="query-condition">
              <el-form
                ref="form"
                size="mini"
                inline
                :model="queryForm"
              >
                <el-form-item prop="faultRemark">
                  <el-input v-model="queryForm.faultRemark" placeholder="故障描述" class="condition base-margin-bottom" clearable />
                </el-form-item>
                <el-form-item prop="phone">
                  <el-input v-model="queryForm.phone" placeholder="报修电话" class="condition" clearable />
                </el-form-item>
                <el-form-item prop="deptId">
                  <department-cascader v-model="queryForm.deptId" class="condition" placeholder="报修科室" />
                </el-form-item>
                <el-form-item prop="faultType">
                  <fault-type-select
                    v-model="queryForm.faultType"
                    class="short-condition"
                  />
                </el-form-item>
                <el-form-item prop="createUser">
                  <engineer-select v-model="queryForm.createUser" class="short-condition" clearable filterable multiple collapse-tags placeholder="建单人" />
                </el-form-item>
                <el-form-item prop="currState">
                  <dic-multi-select v-model="queryForm.currState" type="string" placeholder="工单状态" collapse-tags class="short-condition" dic-key="ticketState" />
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
                <el-form-item prop="makeCreateTime">
                  <el-date-picker
                    v-model="queryForm.makeCreateTime"
                    type="daterange"
                    start-placeholder="建单日期"
                    end-placeholder="建单日期"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    class="condition date"
                  />
                </el-form-item>
                <el-form-item prop="teamIds">
                  <dept-has-team-cascader ref="deptHasTeamCascader" size="mini" class="condition" @change="onDeptHasTeamCascaderChanged" />
                </el-form-item>
                <el-form-item prop="source">
                  <dic-select v-model="queryForm.source" dic-key="faultSource" placeholder="故障来源" class="short-condition" />
                </el-form-item>
                <el-form-item prop="makeUser">
                  <engineer-select v-model="queryForm.makeUser" class="short-condition" clearable filterable multiple collapse-tags placeholder="处理人" />
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
              </el-form>
            </el-col>
            <el-col class="query-btn">
              <div class="base-margin-bottom"> <pure-button label="重置" type="wire-frame" @click="onResetForm" /></div>
              <div> <pure-button label="查询" type="default" @click="onQuery" /></div>

            </el-col>
            <el-col class="query-download">
              <svg-icon icon-class="download" @click="onDownload" />
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
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import DicMultiSelect from '@/feat/system/dictionary/normal/component/dicMultiSelect.vue';
import DicSelect from '@/feat/system/dictionary/normal/component/dicSelect.vue';
import DeptHasTeamCascader from '@/feat/system/department/component/deptHasTeamCascader.vue';
import {
  omitBy,
  isNil,
} from 'lodash';
import downLoadFile from '@/utils/downLoad';
export default {
  name: 'BzWdgd',
  components: {
    PureTable,
    MyAudio,
    LinkedButton,
    PureTag,
    PureDraggable,
    DepartmentCascader,
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    DicSelect,
    DicMultiSelect,
    EngineerSelect: () => import('@/feat/system/user/component/v2/engineerDraggableSelect'),
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
      listApi: MineApi.list,
      queryForm: {
        query: null,
        sortTemp: null,
        faultRemark: null,
        phone: null,
        deptId: null,
        faultType: null,
        createUser: null,
        currState: null,
        infoCreateTime: [],
        makeCreateTime: [],
        source: null,
        makeUser: null,
        teamIds: null, // 运维小组中人员是处理人的
        hospitalId: null,
        departmentId: null,
        teamId: null,

      },
      queryCondition: {
        query: null,
        infoStartTime: null,
        infoEndTime: null,
        faultStartTime: null,
        faultEndTime: null,
        faultRemark: null,
        phone: null,
        deptId: null,
        faultType: null,
        createUser: null,
        source: null,
        makeUser: null,
        currState: null,
        teamIds: null,
        hospitalId: null,
        departmentId: null,
        teamId: null,
      },
      ticketRule: this.$store.state.ticketMine.ticketRule,
      hospitalList: [],
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
  },
  created() {
    this.fetchHospital();
    this.sortTemp = this.genSortTemp(this.ticketRule);
    this.queryCondition.sortTemp = this.genSortTemp(this.ticketRule);
    this.columns = this.ticketTableColumn;
  },
  methods: {
    onRetrievalChange(val) {
      this.queryCondition.query = val;
    },
    async onDownload() {
      const res = await MineApi.download({
        ...this.queryCondition,
        pageNum: null,
        pageSize: null,
      });
      downLoadFile(res, '工单查询.xlsx');
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
    },
    // 生成排序规则字符串
    genSortTemp(ticketRule) {
      return ticketRule.map(item => item.label).join(',') || null;
    },
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
      this.queryCondition.faultStartTime = query.makeCreateTime?.[0] || null;
      this.queryCondition.faultEndTime = query.makeCreateTime?.[1] || null;
      this.queryCondition.faultRemark = query.faultRemark || null;
      this.queryCondition.phone = query.phone || null;
      this.queryCondition.deptId = query.deptId || null;
      this.queryCondition.faultType = query.faultType || null;
      this.queryCondition.createUser = query.createUser || null;
      this.queryCondition.source = query.source || null;
      this.queryCondition.makeUser = query.makeUser || null;
      this.queryCondition.teamIds = query.teamIds || null;
      this.queryCondition.currState = query.currState || null;
      this.queryCondition.hospitalId = query.hospitalId?.join(',') || null;
      this.queryCondition.departmentId = query.departmentId;
      this.queryCondition.teamId = query.teamId;
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
  width:120px;
  padding-right: 25px;
  border-right: 1px solid #e6eaf2;
}
.query-download {
   padding-left: 25px;
  width: 120px;
  font-size: 32px;
  cursor: pointer;
}
.query {
  .condition {
    width: 278px;
    &.date {
      width: 278px;
    }
  }
  .short-condition {
    width:186px;
  }
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>

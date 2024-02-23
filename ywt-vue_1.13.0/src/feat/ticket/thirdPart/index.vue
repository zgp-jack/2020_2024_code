<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-06-29 10:26:06
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-06-30 11:40:09
 * @Description:工单-其他导入工单
-->
<template>
  <el-container class="ticket">
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="filteredColumns"
        :query-condition="queryCondition"
        :list-api="listApi"
        :operation-column-width="85"
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
                  <el-input v-model="queryForm.faultRemark" placeholder="故障描述" class="condition" clearable />
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
                <el-form-item>
                  <pure-button label="重置" type="wire-frame" @click="onResetForm" />
                  <pure-button label="查询" type="default" @click="onQuery" />
                </el-form-item>
              </el-form>
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
            {{ row[prop] }}
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
import ThirdPartApi from './api';
import {
  ticketState,
  callRecordDealType,
} from '../filter';
import ThirdPartTicketDrawer from './drawer/ticket.vue';
import PureTable from '@/feat/component/pureTable';
import MyAudio from '@/components/audio/audio';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import PureTag from '@/components/tag/tag.vue';
import PureDraggable from '@/components/draggable';
import {
  omitBy,
  isNil,
} from 'lodash';
export default {
  name: 'BzQtdrgd',
  components: {
    PureTable,
    MyAudio,
    LinkedButton,
    PureTag,
    PureDraggable,
  },
  filters: {
    ticketState,
    callRecordDealType,
  },
  data() {
    return {
      columns: [],
      listApi: ThirdPartApi.list,
      queryForm: {
        faultRemark: null,
        infoCreateTime: [],
      },
      queryCondition: {
        faultRemark: null,
        startTime: null,
        endTime: null,
      },
      ticketRule: this.$store.state.ticketThirdPart.ticketRule,
    };
  },
  computed: {
    filteredColumns() {
      return this.columns.filter(item => item.checked).map(item => {
        return item;
      });
    },
    ticketTableColumn() {
      return this.$store.state.ticketThirdPart.ticketTableColumn;
    },
  },
  created() {
    this.sortTemp = this.genSortTemp(this.ticketRule);
    this.queryCondition.sortTemp = this.genSortTemp(this.ticketRule);
    this.columns = this.ticketTableColumn;
  },
  methods: {
    onRetrievalChange(val) {
      this.queryCondition.query = val;
    },

    // 表头设置变更
    async onTableColumnChange(newVal) {
      this.columns = newVal;
      this.$store.dispatch('ticketThirdPart/UPDATE_TICKET_TABLE_COLUMN', newVal);
    },
    // 排序规则变更
    async onTicketRuleChange(newTicketRule) {
      this.ticketRule = newTicketRule;
      this.sortTemp = this.genSortTemp(newTicketRule);
      this.onPerformedOpertion();
      this.$store.dispatch('ticketThirdPart/UPDATE_TICKET_RULE', newTicketRule);
    },
    onPerformedOpertion() {
      this.$refs.pureTable.fetchData();
    },
    // 生成排序规则字符串
    genSortTemp(ticketRule) {
      return ticketRule.map(item => item.label).join(',') || null;
    },
    onResetForm() {
      this.$refs.form.resetFields();
      this.onQuery();
    },
    onQuery() {
      const query = omitBy(this.queryForm, isNil);
      this.$refs.pureTable.currentPage = 0;
      this.queryCondition.startTime = query.infoCreateTime?.[0] || null;
      this.queryCondition.endTime = query.infoCreateTime?.[1] || null;
      this.queryCondition.faultRemark = query.faultRemark || null;
    },
    onViewTicket(ticketId) {
      this.$drawer({
        width: '1444px',
        component: () => <ThirdPartTicketDrawer operatorType='VIEW' id={ticketId}/>,
      });
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
}

.query {
  .condition {
    width: 278px;
    &.date {
      width: 278px;
    }
  }
  .short-condition {
    width:200px;
  }
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>

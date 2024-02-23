<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2021-07-20 15:44:48
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-03-18 16:01:53
 * @Description: 工单查询
-->

<template>
  <el-container class="ticket">
    <el-main>
      <pure-table-area>
        <template slot="header">
          <!-- <div class="flex base-margin-left base-margin-top">
            <search
              v-model="searchValue"
              class="base-margin-right"
            />
          </div> -->
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
                  <dic-select v-model="queryForm.currState" type="string" placeholder="工单状态" class="short-condition" dic-key="ticketState" />
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
                  <group-select v-model="queryForm.teamIds" class="condition" clearable filterable multiple collapse-tags placeholder="运维小组" />
                </el-form-item>
                <el-form-item prop="source">
                  <dic-select v-model="queryForm.source" dic-key="faultSource" placeholder="故障来源" class="short-condition" />
                </el-form-item>
                <el-form-item prop="makeUser">
                  <engineer-select v-model="queryForm.makeUser" class="short-condition" clearable filterable multiple collapse-tags placeholder="处理人" />
                </el-form-item>

              </el-form>
            </el-col>
            <el-col class="query-btn">
              <div class="base-margin-bottom"> <pure-button label="重置" type="wire-frame" @click="onResetForm" /></div>
              <div> <pure-button label="查询" type="default" @click="handleQuery" /></div>
            </el-col>
          </el-row>
        </template>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <el-table
              v-loading="loading"
              :data="data"
              :empty-text="emptyText"
              :max-height="tableMaxHeight"
              border
            >
              <el-table-column
                label="序号"
                align="left"
                width="85px"
                show-overflow-tooltip
                fixed
              >
                <template #header="scope">
                  <el-popover
                    v-if="scope.column.fixed"
                    style="padding:0"
                    popper-class="no-padding"
                    placement="bottom-start"
                    width="400"
                    :visible-arrow="false"
                    trigger="click"
                  >
                    <el-tabs type="border-card">
                      <el-tab-pane label="表头设置">
                        <pure-draggable :data="tableColumn" :has-checked="true" @change="handleTableColumnChange" />
                      </el-tab-pane>
                    </el-tabs>
                    <i slot="reference" class="el-icon-s-operation" />
                  </el-popover>
                  序号
                </template>
                <template slot-scope="{$index}">
                  {{ $index +1 }}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item,index) in tableHeader"
                :key="item.prop+index"
                :label="item.label"
                :prop="item.prop"
                align="left"
                :width="item.width"
                :fixed="item.fixed"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="{row}">

                  <span v-if="item.prop ==='source'">
                    {{ row[item.prop] | source }}
                  </span>
                  <span v-else-if="item.prop ==='degree'" :class="'degree--'+row.degree">
                    {{ row[item.prop] | degree }}
                  </span>
                  <span v-else-if="item.prop ==='rangeType'">
                    {{ row[item.prop] | range }}
                  </span>
                  <span v-else-if="item.prop ==='faultType'">
                    {{ row[item.prop] | faultTypes }}
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
              <el-table-column label="操作" align="left" width="84" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="medium"
                    type="text"
                    @click="onViewTicket(scope.row.orderNum)"
                  >查看</el-button>
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
      </pure-table-area>
    </el-main>
  </el-container>
</template>
<script>
import TicketMixin from '../mixin';
import PaginationTable from '@/minxins/common/paginationTable';
import TicketQueryApi from './api';
import {
  omitBy,
  isNil,
  camelCase,
} from 'lodash';
import flat from 'flat';
import PureDraggable from '@/components/draggable';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import LinkedButton from '@/views/reportFault/sharedComponents/linkedButton';
import LinkedListDialog from '@/views/reportFault/sharedComponents/dialog/linkedList';
import PureTag from '@/components/tag/tag.vue';
import {
  ticketState,
} from '../filter';
export default {
  name: 'BzGdcx',
  components: {
    GroupSelect: () => import('./component/groupSelect.vue'),
    EngineerSelect: () => import('./component/engineerSelect.vue'),
    PureDraggable,
    DepartmentCascader,
    FaultTypeSelect: () => import('@/views/reportFault/sharedComponents/select/faultTypeSelect.vue'),
    DicSelect: () => import('@/views/components/dictionary/dicSelect.vue'),
    LinkedButton,
    PureTag,
  },
  filters: {
    ticketState,
  },
  mixins: [PaginationTable, TicketMixin],
  data() {
    return {
      queryForm: {
        faultRemark: null,
        phone: null,
        deptId: null,
        faultType: null,
        createUser: null,
        currState: [],
        infoCreateTime: [],
        makeCreateTime: [],
        faultCompleteTime: [],
        source: null,
        makeUser: null,
        teamIds: null, // 运维小组中人员是处理人的
      },
      tableColumn: [],
      orderRule: this.$store.state['reportFault/myOrder'].orderRule,
      listApi: TicketQueryApi.list,
    };
  },
  computed: {
    complexTableColumn() {
      return this.$store.state['reportFault/query'].complexTableColumn;
    },
    tableHeader() {
      return this.tableColumn.filter(item => item.checked).map(item => {
        return item;
      });
    },
  },
  created() {
    this.tableColumn = this.complexTableColumn;
    this.fetchData();
  },
  methods: {
    async handleQuery() {
      try {
        await this.$refs.form.validate();
        this.currentPage = 0;
        const query = omitBy(this.queryForm, isNil);
        this.queryCondition.infoStartTime = query.infoCreateTime?.[0] || null;
        this.queryCondition.infoEndTime = query.infoCreateTime?.[1] || null;
        this.queryCondition.faultStartTime = query.makeCreateTime?.[0] || null;
        this.queryCondition.faultEndTime = query.makeCreateTime?.[1] || null;
        this.queryCondition.faultRemark = query.faultRemark || null;
        this.queryCondition.phone = query.phone || null;
        this.queryCondition.deptId = query.deptId || null;
        this.queryCondition.faultType = query.faultType?.join(',') || null;
        this.queryCondition.createUser = query.createUser || null;
        this.queryCondition.faultProcessState = query.faultProcessState?.join(',') || null;
        this.queryCondition.source = query.source || null;
        this.queryCondition.makeUser = query.makeUser || null;
        this.queryCondition.teamIds = query.teamIds || null;
        this.queryCondition.currState = camelCase(query.currState) || null;
        this.queryCondition.pageNum = this.currentPage;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      }
    },
    onResetForm() {
      this.$refs.form.resetFields();
      this.handleQuery();
    },
    convertListData(list) {
      return list?.map(item => {
        const dt = flat(item);
        dt.orign = item;
        return dt;
      });
    },
    // 表头设置变更
    async handleTableColumnChange(newVal) {
      this.tableColumn = newVal;
      this.$store.dispatch('reportFault/query/UPDATE_COMPLEX_TABLE_COLUMN', newVal);
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

<style lang="scss" scoped>
@import "~@/styles/ticket.scss";
.query-condition {
  width: auto;
}
.query-btn {
  width:120px;
}
.query {
  .condition {
    width: 298px;
    &.date {
      width: 298px;
    }
  }
  .short-condition {
    width:190px;
  }
}
.el-form-item--mini.el-form-item {
  margin-bottom: 0;
}
</style>

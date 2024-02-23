/**
* @file index.vue.vue
* @author huang
* @date 2023/8/17
* @description 全部工单
* @projectName
* @email newflyhuang@gmail.com
*/

<template>
  <TableLayout>
    <pure-table
      ref="pureTable"
      :list-api="listApi"
      :query-condition="queryCondition"
      style="padding: 0 10px;"
    >
      <template #header>
        <query-panel
          @query="onQuery"
          @reset="onReset"
        >
          <el-form-item>
            <el-input
              v-model="queryForm.keywords"
              placeholder="故障描述/工单号/报修电话"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.createTime"
              end-placeholder="建单结束时间"
              start-placeholder="建单开始时间"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryForm.repairTime"
              end-placeholder="报修结束时间"
              start-placeholder="报修开始时间"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <user-select
              v-model="queryForm.createUserId"
              :multiple="false"
              collapse-tags
              placeholder="建单人"
            />
          </el-form-item>
          <el-form-item>
            <use-department-list v-model="queryForm.departmentId" placeholder="报修院区/科室" multiple style="width: 100%" />
          </el-form-item>
          <el-form-item>
            <dic-select
              v-model="queryForm.rangeType"
              dic-key="obs_fault_range"
              style="width: 100%"
              placeholder="影响范围"
            />
          </el-form-item>

          <el-form-item>
            <dic-select
              v-model="queryForm.source"
              dic-key="obs_fault_source"
              style="width: 100%"
              placeholder="报障来源"
            />
          </el-form-item>
          <el-form-item>
            <user-select
              v-model="queryForm.receptionUserId"
              :multiple="false"
              collapse-tags
              placeholder="坐席人"
            />
          </el-form-item>
          <el-form-item>
            <user-select
              v-model="queryForm.makeUserId"
              :multiple="false"
              collapse-tags
              placeholder="处理人"
            />
          </el-form-item>
          <el-form-item>
            <dic-select
              v-model="queryForm.currState"
              dic-key="obs_fault_state"
              style="width: 100%"
              placeholder="故障状态"
            />
          </el-form-item>
        </query-panel>
      </template>
      <template #indexColumn>
        序号
      </template>
      <el-table-column
        label="故障描述"
        prop="faultRemark"
        width="160"
        :show-overflow-tooltip="true"
      >
        <template #default="{row}">
          <span
            class="all_fault-description"
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
            {{ row.faultRemark }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="工单号"
        prop="orderNum"
        width="160"
      />
      <el-table-column
        label="状态"
        prop="currStateToName"
      />
      <el-table-column
        label="报修院区/科室"
        prop="deptName"
        width="160"
      />

      <el-table-column
        label="故障分类"
        prop="faultTypeToName"
      />

      <el-table-column
        label="影响范围"
        prop="rangeTypeToName"
      />

      <el-table-column
        label="报修电话"
        prop="phone"
      />
      <el-table-column
        label="报修时间"
        prop="repairTime"
      />

      <el-table-column
        label="建单人"
        prop="createUser"
      />
      <el-table-column
        label="建单时间"
        prop="createTime"
      />

      <el-table-column
        label="报障来源"
        prop="sourceToName"
      />

      <el-table-column
        label="坐席人"
        prop="receptionUser"
      />

      <el-table-column
        label="处理人"
        prop="makeUser"
      >
        <template #default="{row}">
          {{ row.makeUser || '-' }}
        </template>
      </el-table-column>

    </pure-table>
  </TableLayout>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import AllWorkOrderApi from './api';
import { debounce, } from 'lodash-es';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import DicSelect from '@/features/system/dataDictionary/components/dicSelect.vue';
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import TicketMixin from '../mixin';

export default {
  components: { UseDepartmentList, DicSelect, UserSelect, QueryPanel, },
  mixins: [
    TicketMixin,
  ],
  data() {
    return {
      listApi: AllWorkOrderApi.queryAllWorkOrder,
      queryCondition: {},
      queryForm: {
        // 建单结束时间(yyyy-MM-dd)
        createEndTime: '',
        // 建单开始时间(yyyy-MM-dd)
        createStartTime: '',
        createTime: [],
        // 建单人id
        createUserId: '',
        // 科室ID
        departmentId: '',
        // 关键字
        keywords: '',
        // 处理人ID
        makeUserId: '',
        // 影响范围
        rangeType: '',
        // 坐席人ID
        receptionUserId: '',
        // 报修结束时间(yyyy-MM-dd)
        repairEndTime: '',
        // 报修开始时间(yyyy-MM-dd)
        repairStartTime: '',
        repairTime: [],
        // 工单来源
        source: '',
        // 故障状态
        currState: '',
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.pureTable.fetchData(1);
    });
  },
  methods: {
    // 查询
    onQuery: debounce(function () {
      this.queryCondition = {
        ...this.queryForm,
      };
      this.queryCondition.createStartTime = this.queryForm.createTime[0];
      this.queryCondition.createEndTime = this.queryForm.createTime[1];
      this.queryCondition.repairStartTime = this.queryForm.repairTime[0];
      this.queryCondition.repairEndTime = this.queryForm.repairTime[1];
      console.log(this.queryCondition);
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    }, 300),
    // 重置
    onReset: debounce(function () {
      this.queryForm = {
        // 建单结束时间(yyyy-MM-dd)
        createEndTime: '',
        // 建单开始时间(yyyy-MM-dd)
        createStartTime: '',
        createTime: [],
        // 建单人id
        createUserId: '',
        // 科室ID
        departmentId: '',
        // 关键字
        keywords: '',
        // 处理人ID
        makeUserId: '',
        // 影响范围
        rangeType: '',
        // 坐席人ID
        receptionUserId: '',
        // 报修结束时间(yyyy-MM-dd)
        repairEndTime: '',
        // 报修开始时间(yyyy-MM-dd)
        repairStartTime: '',
        repairTime: [],
        // 工单来源
        source: '',
        // 故障状态
        currState: '',
      };
      this.queryCondition = {};
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData(1);
      });
    }, 300),
  },

};
</script>

<style lang="scss"
       scoped
>
@import "~@/common/styles/theme/handle.scss";
@import "@/features/ticket/common/ticket.scss";
.all_fault-description{
  @include font_color_imp('color-primary');
  cursor: pointer;
}
</style>

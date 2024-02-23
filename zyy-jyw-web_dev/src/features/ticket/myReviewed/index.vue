<!--由我审核的-->
<template>
  <hyy-view-layout>
    <pure-table
      ref="pureTable"
      :columns="columns"
      :list-api="listApi"
      :query-condition="queryCondition"
    >
      <template #header>
        <query-panel
          @query="onQuery"
          @reset="onReset"
        >
          <el-form-item>
            <el-input
              v-model="form.keywords"
              placeholder="故障描述/工单号/报修电话"
            />
          </el-form-item>

          <el-form-item v-if="showToBeReviewed">
            <el-date-picker
              v-model="form.time"
              end-placeholder="报修结束日期"
              format="yyyy-MM-dd"
              start-placeholder="报修开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item v-if="showToBeReviewed || showReviewed">
            <el-date-picker

              v-model="form.completeTime"
              end-placeholder="完成结束日期"
              format="yyyy-MM-dd"
              start-placeholder="完成开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item v-if="showReviewed">
            <el-date-picker
              v-model="form.reviewedTime"
              end-placeholder="审核结束日期"
              format="yyyy-MM-dd"
              start-placeholder="审核开始日期"
              type="daterange"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item v-if="showToBeReviewed">
            <user-select
              v-model="form.makeUserId"
              :multiple="false"
              collapse-tags
              placeholder="处理人"
            />
          </el-form-item>
          <el-form-item v-if="showToBeReviewed">
            <use-department-list v-model="form.departmentId" placeholder="报修院区/科室" style="width: 100%" />
          </el-form-item>
          <el-form-item v-if="showToBeReviewed">
            <fault-type-select
              v-model="form.faultType"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item v-if="showReviewed">
            <el-select
              v-model="form.processValue"
              clearable
              placeholder="审核状态"
            >
              <el-option
                label="通过"
                value="end_examine"
              />
              <el-option
                label="驳回"
                value="no_examine"
              />
            </el-select>
          </el-form-item>

          <template #extra>
            <el-radio-group
              v-model="handleType"
              size="small"
              @change="changeHandleType"
            >
              <el-radio-button label="待审核" />
              <el-radio-button label="已审核" />
            </el-radio-group>
          </template>
        </query-panel>

      </template>
      <template slot="indexColumn">
        序号
      </template>
      <template #columns="{row, prop}">
        <template v-if="prop === 'overTime'">
          {{ row[prop] === 0 ? "否" : "是" }}
        </template>
        <template v-else-if="prop === 'processValue'">
          <pure-type-text
            :config="PROCESS_VALUE"
            :type="row[prop]"
          />
        </template>
        <template v-else>
          {{ row[prop] || '-' }}
        </template>
      </template>

      <template #operationColumn="{row}">
        <template v-if="handleType ==='待审核'">
          <pure-button
            label="查看"
            type="text"
            @click="onViewTicket(row.orderNum)"
          />
          <pure-button
            v-auth="'obstacles:mine:order:enact'"
            label="通过"
            type="text"
            @click="onConfirm(row)"
          />
          <pure-button
            v-auth="'obstacles:mine:order:reject'"
            label="驳回"
            text-color="warning"
            type="text"
            @click="onReject(row)"
          />
        </template>
        <template v-if="handleType ==='已审核'">
          <pure-button
            label="查看"
            type="text"
            @click="onViewTicket(row.orderNum)"
          />
        </template>

      </template>
    </pure-table>
  </hyy-view-layout>
</template>

<script>
import QueryPanel from '@/common/components/query/queryPanel.vue';
import MyReviewedApi from './api';
import { debounce, } from 'lodash-es';
import DialogReject from './dialog/reject.vue';
import HyyViewLayout from '@/common/layout/viewLayout.vue';
import UseDepartmentList from '@/features/system/departmentManagement/components/cascaderDepartmentList.vue';
import UserSelect from '@/features/system/user/components/userSelect.vue';
import { PROCESS_VALUE, } from './config';
import TicketMixin from '../mixin';

export default {
  name: 'MyReviewed',
  components: {
    UserSelect,
    UseDepartmentList,
    HyyViewLayout,
    QueryPanel,
    FaultTypeSelect: () =>
      import('@/features/system/dataDictionary/components/faultTypeSelect.vue'),
  },
  mixins: [
    TicketMixin,
  ],
  data() {
    return {
      queryConditionExpand: true,
      listApi: null,
      handleType: '待审核',
      PROCESS_VALUE,
      form: {
        // 完成结束时间(yyyy-MM-dd)
        completeEndTime: '',
        // 完成开始时间(yyyy-MM-dd)
        completeStartTime: '',
        // 科室ID
        departmentId: '',
        // 报修结束时间(yyyy-MM-dd)
        endTime: '',
        // 故障分类
        faultType: '',
        // 关键字
        keywords: '',
        // 处理人Id
        makeUserId: '',
        // 报修开始时间(yyyy-MM-dd）
        startTime: '',
        time: [],
        completeTime: [],
        //   审核时间
        reviewedTime: [],
      },
      queryCondition: {},
      columns: [],
      // 待审核表格数据
      pendingColumns: [{
        label: '故障描述',
        prop: 'faultRemark',

      }, {
        label: '工单号',
        prop: 'orderNum',
      }, {
        label: '报修院区/科室',
        prop: 'deptName',
      },
      {
        label: '故障分类',
        prop: 'faultTypeToName',
      },
      {
        label: '报修电话',
        prop: 'phone',
      },
      {
        label: '报修人',
        prop: 'user',
      },
      {
        label: '报修时间',
        prop: 'createTime',
      },
      {
        label: '处理人',
        prop: 'makeUser',
      },
      {
        label: '完成时间',
        prop: 'completeDate',
      },
      {
        label: '是否超时完成',
        prop: 'overTime',
      },
      {
        label: '工单处理耗时（分钟）',
        prop: 'makeTime',
      },
      {
        label: '标准耗时（分钟）',
        prop: 'maxTime',
      },
      ],
      //   已处理表格
      processedColumns: [
        {
          label: '故障描述',
          prop: 'faultRemark',
        },
        {
          label: '工单号',
          prop: 'orderNum',
        },
        {
          label: '审核状态',
          prop: 'processValue',
        },
        {
          label: '审核时间',
          prop: 'examineTime',
        },
        {
          label: '处理人',
          prop: 'makeUser',
        },
        {
          label: '完成时间',
          prop: 'completeDate',
        },

      ],

    };
  },
  computed: {
    //  待审核
    showToBeReviewed() {
      return this.handleType === '待审核';
    },
    //  已审核
    showReviewed() {
      return this.handleType === '已审核';
    },
  },
  created() {
    this.initList();
  },
  methods: {
    initList() {
      this.listApi = MyReviewedApi.getMyToBeReviewedList;
      this.columns = this.pendingColumns;
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    changeHandleType: debounce(function (val) {
      this.handleType = val;
      if (val === '待审核') {
        this.columns = this.pendingColumns;
        this.listApi = MyReviewedApi.getMyToBeReviewedList;
      } else {
        this.listApi = MyReviewedApi.getMyReviewedList;
        this.columns = this.processedColumns;
      }
      // 切换清空查询条件
      this.form = {
        time: [],
        completeTime: [],
        reviewedTime: [],
      };
      this.queryCondition = {
        ...this.form,
      };
      // 此处处理切换tab时，表格数据出现异步的问题
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    }, 300),
    onReset() {
      this.queryCondition = {};
      this.form = {
        completeEndTime: '',
        completeStartTime: '',
        departmentId: '',
        endTime: '',
        faultType: '',
        keywords: '',
        makeUserId: '',
        startTime: '',
        time: [],
        completeTime: [],
        reviewedTime: [],
      };
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onQuery() {
      this.queryCondition = {
        ...this.form,
      };
      this.queryCondition.completeStartTime = this.form.completeTime[0];
      this.queryCondition.completeEndTime = this.form.completeTime[1];
      this.queryCondition.examineStartTime = this.form.reviewedTime[0];
      this.queryCondition.examineEndTime = this.form.reviewedTime[1];

      this.queryCondition.startTime = this.form.time[0];
      this.queryCondition.endTime = this.form.time[1];
      this.$nextTick(() => {
        this.$refs.pureTable.onSearch();
      });
    },
    onDone() {
      this.$nextTick(() => {
        this.$refs.pureTable.fetchData();
      });
    },
    onReject(row) {
      this.$dialog({
        component: () => <DialogReject
          orderNum={row.orderNum}
          onDone={this.onDone}
        />,
      });
    },
    async onConfirm(row) {
      this.$confirm('是否确认对工单进行审核通过操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          MyReviewedApi.pass(row.orderNum).then(() => {
            this.$message.success('操作成功');
            this.onDone();
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

<style lang="scss"
       scoped
>

</style>

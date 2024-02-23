<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:15:36
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-24 17:37:43
 * @Description:绩效-绩效审核
-->
<template>
  <el-container>
    <el-main>
      <pure-table
        ref="pureTable"
        :columns="columns"
        :query-condition="queryCondition"
        :list-api="listApi"
      >
        <template slot="header">
          <el-form
            ref="form"
            size="mini"
            inline
            class="base-margin-left base-margin-top"
          >
            <el-form-item>
              绩效考核 (统计周期{{ periodData.startDate }}至{{ periodData.endDate }})
            </el-form-item>
            <el-form-item label="科室">
              <department-cascader v-model="formData.deptId" class="w-200" @change="onDeptChanged" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select
                v-model="formData.roleIds"
                class="w-200"
                :disabled="!roleList.length"
                clearable
                multiple
                collapse-tags
                :filterable="true"
              >
                <el-option
                  v-for="(item ,index) in roleList"
                  :key="index"
                  :value="item.id"
                  :label="item.roleName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="人员">
              <el-select
                v-model="formData.userIds"
                class="w-200"
                :disabled="!engineerList.length"
                clearable
                multiple
                collapse-tags
                :filterable="true"
              >
                <el-option
                  v-for="(item ,index) in engineerList"
                  :key="index"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="统计周期">
              <el-date-picker
                v-model="formData.evaluationCycle"
                size="mini"
                type="month"
                class="w-200"
                format="yyyy-MM"
                value-format="yyyy-MM"
              />
            </el-form-item>
            <el-form-item>
              <pure-button label="统计查看" @click="onView" />
            </el-form-item>
          </el-form>
        </template>
        <template slot="indexColumn" />
        <template slot="columns" slot-scope="{row,prop}">
          <template v-if="['subjective','objective','score'].includes(prop)">
            <span :class="['score','score-'+row.auditState, 'score-type-'+prop]" @click="onClickScore(row,prop)">{{ row[prop] }}分</span>
            <el-tag v-if="prop==='subjective'&&row.subjectiveReconsider===1" @click="onClickScore(row,prop,'RECONSIDER_REVIEW')">复</el-tag>
            <el-tag v-if="prop==='objective'&&row.objectiveReconsider===1" @click="onClickScore(row,prop,'RECONSIDER_REVIEW')">复</el-tag>
          </template>
          <template v-else-if="prop==='auditStateToName'">
            <span :class="['audit-state-'+row.auditState]">{{ row[prop] }}</span>
          </template>
          <template v-else>
            {{ row[prop] }}
          </template>

        </template>
        <template slot="operationColumn" slot-scope="{row}">
          <pure-button
            v-if="isArchived(row)"
            label="趋势查看"
            type="text"
            @click="onViewTrend(row)"
          />
          <pure-button
            v-if="isWaitReview(row)"
            label="最终审核"
            type="text"
            @click="onReview(row)"
          />
        </template>
      </pure-table>
    </el-main>
  </el-container>
</template>

<script>
import ReviewApi from './api';
import MeritsApi from '../api';
import {
  showReconsiderTag,
} from '../utils';
import ReviewDialog from './dialog/review.vue';
import SubjectiveEvaluationReviewDrawer from './drawer/subjectiveEvaluation.vue';
import ObjectiveEvaluationReviewDrawer from './drawer/objectiveEvaluation.vue';
import PureTable from '@/feat/component/pureTable';
import DepartmentCascader from '@/feat/system/department/component/departmentCascader.vue';
import RoleApi from '@/feat/system/role/api';
import EngineerApi from '@/feat/system/user/api';
import TrendingDrawer from '@/feat/merits/drawer/trending';
import moment from 'moment';
export default {
  name: 'JxJxsh',
  components: {
    PureTable,
    DepartmentCascader,
  },
  data() {
    return {
      listApi: ReviewApi.list,
      roleList: [],
      engineerList: [],
      queryCondition: {
        evaluationCycle: moment().format('YYYY-MM'),
        deptId: null,
        roleIds: null,
        userIds: null,
      },
      formData: {
        evaluationCycle: moment().format('YYYY-MM'),
        deptId: null,
        roleIds: [],
        userIds: [],
      },
      columns: [{
        label: '考核周期',
        prop: 'evaluationCycle',
      },
      {
        label: '姓名',
        prop: 'userName',
      },
      {
        label: '角色',
        prop: 'roleName',
      },
      {
        label: '小组',
        prop: 'teamName',
      },
      {
        label: '科室',
        prop: 'deptName',
      },
      {
        label: '主观分值',
        prop: 'subjective',
      },
      {
        label: '客观分值',
        prop: 'objective',
      },
      {
        label: '合计得分',
        prop: 'score',
      },
      {
        label: '评分等级',
        prop: 'levelToName',
      },
      {
        label: '状态',
        prop: 'auditStateToName',
      }
      ],
      periodData: {
        startDate: null,
        endDate: null,
      },
    };
  },
  computed: {
    period() {
      return 'class="w-200"';
    },
  },
  created() {
    this.onDeptChanged();
    this.fetchPeriod();
  },
  methods: {
    async fetchPeriod() {
      try {
        const data = await MeritsApi.queryStatisticsPeriod(this.queryCondition.evaluationCycle);
        this.periodData = Object.assign({}, this.periodData, data);
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,

        });
      }
    },
    onReview(row) {
      this.$dialog({
        title: '最终审核',
        width: '688px',
        component: () => <ReviewDialog id={row.id} onDone={this.onReviewDone}/>,
      });
    },
    onReviewDone() {
      this.$refs.pureTable.fetchData();
    },
    onViewTrend(row) {
      const year = row.evaluationCycle?.split('-')[0];
      this.$drawer({
        width: '720px',
        component: () => <TrendingDrawer engineerId={row.userId} year={year} operatorType='VIEW'/>,
      });
    },
    async onView() {
      try {
        this.queryCondition.evaluationCycle = this.formData.evaluationCycle;
        this.queryCondition.deptId = this.formData.deptId;
        this.queryCondition.roleIds = this.formData.roleIds.length ? this.formData.roleIds.join(',') : null;
        this.queryCondition.userIds = this.formData.userIds.length ? this.formData.userIds.join(',') : null;
        this.fetchPeriod();
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,

        });
      }
    },
    onClickScore(row, prop, actionType = 'EVALUATE') {
      let operatorType = 'UPDATE';
      if (this.isArchived(row)) {
        operatorType = 'VIEW';
      }
      if (prop === 'subjective') {
        this.$drawer({
          width: '1424px',
          component: () => <SubjectiveEvaluationReviewDrawer id={row.id} operatorType={operatorType} actionType={actionType}/>,
        });
        return;
      }
      if (prop === 'objective') {
        if (actionType === 'EVALUATE') {
          operatorType = 'VIEW';
        }
        this.$drawer({
          width: '1424px',
          component: () => <ObjectiveEvaluationReviewDrawer id={row.id} operatorType={operatorType} actionType={actionType}/>,
        });
        return;
      }
    },
    async onDeptChanged(val = {}) {
      try {
        const { list, } = await RoleApi.list({ deptNo: val.deptNo, });
        const { list: userList, } = await EngineerApi.list({ deptNo: val.deptNo, states: '1', });
        this.engineerList = userList;
        this.roleList = list;
        this.formData.roleIds = [];
      } catch (error) {
        if (error) {
          this.$message({
            type: 'error',
            message: error,
          });
        }
      }
    },
    isArchived(row) {
      return row.auditState === '3';
    },
    isWaitReview(row) {
      return row.auditState === '1';
    },
    showReconsiderTag,
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item {
    margin-bottom: 0px;
}
.w-200 {
  width: 200px;
}
.score{
  text-decoration: underline;
  text-align: center;
  color: #426ed7;
  cursor: pointer;
  &-type-score {
    color: #334266;
    cursor: unset;
    text-decoration:unset;
  }
  &-type-score  {
    &.score-3 {
      opacity: 0.4;
    }
  }
}
.audit-state {

  // 待审核
  &-1 {
     color: #426ed7;;
  }
  // 未通过
  &-2 {
    color: #f56c6c;
  }
  // 已归档
  &-3 {
    color: #334266;
    opacity: 0.4;
  }
  // 未提交
  &-4 {
    color: #e6a23c;
  }
}
.el-tag {
  border-radius: 50%;
  padding: 4px;
  height: 24px;
  line-height: 14px;
  border: 1px solid rgba(245,108,108,0.50);
  background: rgba(245,108,108,0.10);
  color: #f56c6c;
  cursor: pointer;
}
</style>

<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 16:10:08
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-24 17:47:05
 * @Description:顶部综合面板
-->
<template>
  <div>
    <div class="flex space-between base-margin-top">
      <div>
        <span class="label">统计周期</span>
        <el-date-picker
          v-model="queryCondition.evaluationCycle"
          size="mini"
          type="month"
          class="date"
          format="yyyy-MM"
          value-format="yyyy-MM"
        />
        <pure-button label="统计查看" type="wire-frame-auto" @click="onView" />
        <pure-button label="查看绩效趋势" type="wire-frame-auto" @click="onViewTrending" />
      </div>
      <div class="flex left-content space-between">
        <div>
          <span class="label">主观评分</span>
          <span>{{ formData.subjective }}分</span>
        </div>
        <div>
          <span class="label">客观评分</span>
          <span>{{ formData.objective }}分</span>
        </div>
        <div>
          <span class="label">合计得分</span>
          <span>{{ formData.score }}分</span>
        </div>
        <div>
          <span class="label">评价</span>
          <span>{{ formData.levelToName }}</span>
        </div>
        <div>
          <span :class="['audit-state-'+formData.auditState]">{{ formData.auditStateToName }}</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import MineApi from '../api';
import { bus, } from '@/utils/bus';
import TrendingDrawer from '@/feat/merits/drawer/trending';
import {
  mapGetters,
} from 'vuex';
import {
  omitBy,
  isNil,
} from 'lodash';
import moment from 'moment';
export default {

  data() {
    return {
      formData: {
        subjective: null,
        objective: null,
        score: null,
        levelToName: '暂无',
        auditStateToName: null,
        level: null,
        auditState: null,
      },
      queryCondition: {
        evaluationCycle: null,
      },
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    year() {
      return this.queryCondition.evaluationCycle?.split('-')[0];
    },
  },

  mounted() {
    bus.$on('merits-submit-success', this.fetchData);
    this.queryCondition.evaluationCycle = moment().format('YYYY-MM');
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const data = await MineApi.mainInfoDetail({
          userId: this.userInfo.id,
          evaluationCycle: this.queryCondition.evaluationCycle,
        });
        this.formData = Object.assign({}, this.formData, omitBy(data, isNil));
        if (isNil(data)) {
          this.$message({
            type: 'warning',
            message: `未查询到${this.queryCondition.evaluationCycle}的绩效信息`,
          });
          return false;
        }
        this.$emit('loadComplete', {
          evaluationCycle: this.formData.evaluationCycle,
          performanceId: this.formData.id, });
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        });
      }
    },
    async onView() {
      await this.fetchData();
    },
    onViewTrending() {
      this.$drawer({
        width: '720px',
        component: () => <TrendingDrawer engineerId={this.userInfo.id} year={this.year} operatorType='VIEW'/>,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  font-size: 18px;
  color: #7d8db3;
  margin-right: 8px;
}
.date {
  margin-right: 24px;
  width: 200px;
}
.left-content {
  align-items: center;
  width: 750px;
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
</style>

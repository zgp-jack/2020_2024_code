<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-08-29 17:54:39
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-09-05 20:42:40
 * @Description:统计分析-项目
-->
<template>
  <el-container>
    <el-main>
      <div class="pure-top">
        <div class="content">
          <el-row type="flex" align="middle">
            <span class="title">统计分析</span>
            <el-date-picker
              v-model="period"
              size="mini"
              type="daterange"
              align="right"
              unlink-panels
              :clearable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
            <pure-button label="查询" class="base-margin-left" @click="onQuery" />
          </el-row>
        </div>
      </div>
      <div class="main">
        <div class="pure-placeholder" />
        <requirement-panel ref="requirementPanel" class="base-margin-bottom" />
        <project-panel ref="projectPanel" :date-time="period" class="base-margin-bottom" />
        <project-task-panel ref="projectTaskPanel" class="base-margin-bottom" />
        <project-work-panel class="base-margin-bottom" />
        <ProjectWorkHourPanel class="base-margin-bottom" />
        <ProjectLevelPanel />
      </div>
    </el-main>

  </el-container>
</template>

<script>
import ProjectPanel from './panel/project.vue';
import RequirementPanel from './panel/requirement.vue';
import ProjectTaskPanel from './panel/projectTask.vue';
import ProjectWorkPanel from './panel/projectWrok.vue';
import ProjectWorkHourPanel from './panel/projectWorkHour.vue';
import ProjectLevelPanel from './panel/projectLevel.vue';
import Moment from 'moment';
export default {
  name: 'TjfxXm',
  components: {
    ProjectPanel,
    RequirementPanel,
    ProjectTaskPanel,
    ProjectWorkPanel,
    ProjectWorkHourPanel,
    ProjectLevelPanel,

  },
  data() {
    return {
      period: [Moment().startOf('month').format('YYYY-MM-DD'), Moment().endOf('month').format('YYYY-MM-DD')],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }],
      },
    };
  },
  mounted() {
    this.onQuery();
  },
  methods: {
    onQuery() {
      const startTime = this.period?.[0];
      const endTime = this.period?.[1];
      this.$refs.requirementPanel.changeQueryCondition({ startTime, endTime, });
      this.$refs.projectPanel.changeQueryCondition({ startTime, endTime, });
      this.$refs.projectTaskPanel.changeQueryCondition({ startTime, endTime, });
    },
  },
};
</script>

<style lang="scss" scoped>
.pure-top {
  .title {
    font-size: 24px;
    margin-right: 48px;
  }
  height: 64px;
  background: #ffffff;
  width: calc(100% + 12px);
  position: absolute;
  left: 0;
  top: 0;
  padding: 12px;
  padding-top: 16px;
  z-index: 50;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
.main {

  // overflow-x: hidden ;
  .pure-placeholder {
     height: 64px;
  }

}
</style>

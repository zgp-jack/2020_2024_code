<!--
 * @Author: Pure <305737824@qq.com>
 * @CreateTime: 2022-04-07 10:10:16
 * @LastEditors: Pure <305737824@qq.com>
 * @LastEditTime: 2022-04-19 11:33:56
 * @Description:绩效-我的绩效
-->
<template>
  <el-container>
    <el-main>
      <pure-table-area>
        <template slot="body">
          <div ref="tableWrapper" class="table-wrapper">
            <main-panel @loadComplete="onBaseInfoLoaded" />
            <subjective-evaluation-panel ref="subjectEvaluationPanel" />
            <objective-evaluation-panel ref="objectEvaluationPanel" />
          </div>
        </template>
      </pure-table-area>
    </el-main>
  </el-container>
</template>
<script>
import MainPanel from './panel/main.vue';
import ObjectiveEvaluationPanel from './panel/objectiveEvaluation.vue';
import SubjectiveEvaluationPanel from './panel/subjectiveEvaluation.vue';
export default {
  name: 'JxWdjx',
  components: {
    MainPanel,
    ObjectiveEvaluationPanel,
    SubjectiveEvaluationPanel,
  },
  methods: {
    onBaseInfoLoaded(data) {
      this.$refs.subjectEvaluationPanel.fetchData(data.performanceId);
      this.$refs.objectEvaluationPanel.fetchData(data.performanceId);
    },
  },

};
</script>

<style lang="scss" scoped>
.table-wrapper {
  overflow: scroll;
}
</style>
